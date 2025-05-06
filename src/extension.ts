import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

function getEvalArgsString(): string {
	const config = vscode.workspace.getConfiguration('verilog-mode-wrapper');
	const evalArgs = config.get<Record<string, any>>('evalArgs');

	if (!evalArgs || Object.keys(evalArgs).length === 0) {
		return '';
	}

	const argsString = Object.entries(evalArgs)
		.map(([key, value]) => {
			let lispValue: string;
			if (typeof value === 'string') {
				// Treat all strings as symbols (no quotes)
				lispValue = value;
			} else if (typeof value === 'number') {
				// Numbers remain as numbers
				lispValue = value.toString();
			} else if (typeof value === 'boolean') {
				// Convert boolean true to 't' and false to 'nil'
				lispValue = value ? 't' : 'nil';
			} else {
				// Use JSON.stringify as a safe fallback for unexpected types
				lispValue = JSON.stringify(value);
			}
			return `${key} ${lispValue}`;
		})
		.join(' ');

	// Escape double quotes within the generated string for the shell's -eval "..." argument
	const escapedArgsString = argsString.replace(/"/g, '\\"');

	// Construct the final -eval argument string for the shell
	return `-eval \"(setq-default ${escapedArgsString})\"`;
}

function executeCommandInDirectory(command1: string, command2: string, filePath: string, evalArgs: string) {
	const directory = path.dirname(filePath);
	const fileName = path.basename(filePath);

	// Construct the command with evalArgs potentially included
	const command = `cd "${directory}" && ${command1} ${evalArgs} "${fileName}" ${command2}`;

	// Log the command for debugging purposes
	console.log(`Executing command: ${command}`);

	exec(command, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
			return;
		}
		if (stderr && stderr.trim() !== "") { // Check if stderr is not empty
			vscode.window.showInformationMessage(`Done: ${stderr}`);
			return;
		}
		// Optionally show stdout if needed, or a generic success message
		// vscode.window.showInformationMessage('Command executed successfully.');
	});
}

function verilog_batch_auto(filePath: string, evalArgs: string) {
	executeCommandInDirectory('emacs --batch', '-f verilog-batch-auto', filePath, evalArgs);
}

function verilog_batch_delete_auto(filePath: string, evalArgs: string) {
	executeCommandInDirectory('emacs --batch', '-f verilog-batch-delete-auto', filePath, evalArgs);
}

function verilog_batch_diff_auto(filePath: string, evalArgs: string) {
	executeCommandInDirectory('emacs --batch', ' -f verilog-batch-diff-auto', filePath, evalArgs);
}

function verilog_batch_inject_auto(filePath: string, evalArgs: string) {
	executeCommandInDirectory('emacs --batch', ' -f verilog-batch-inject-auto', filePath, evalArgs);
}

function verilog_batch_indent(filePath: string, evalArgs: string) {
	executeCommandInDirectory('emacs --batch', ' -f verilog-batch-indent', filePath, evalArgs);
}

function verilog_batch_delete_trailing_whitespace(filePath: string, evalArgs: string) {
	executeCommandInDirectory('emacs --batch', ' -f verilog-batch-delete-trailing-whitespace', filePath, evalArgs);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Define the type for command actions
	type CommandAction = (filePath: string, evalArgs: string) => void;

	// Define the structure for command objects
	interface CommandDefinition {
		command: string;
		action: CommandAction;
	}

	const commands: CommandDefinition[] = [
		{
			command: 'extension.verilog-mode-wrapper.auto',
			action: verilog_batch_auto
		},
		{
			command: 'extension.verilog-mode-wrapper.deleteAuto',
			action: verilog_batch_delete_auto
		},
		{
			command: 'extension.verilog-mode-wrapper.diffAuto',
			action: verilog_batch_diff_auto
		},
		{
			command: 'extension.verilog-mode-wrapper.injectAuto',
			action: verilog_batch_inject_auto
		},
		{
			command: 'extension.verilog-mode-wrapper.indent',
			action: verilog_batch_indent
		},
		{
			command: 'extension.verilog-mode-wrapper.deleteTrailingWhitespace',
			action: verilog_batch_delete_trailing_whitespace
		}
	];

	commands.forEach(({ command, action }: CommandDefinition) => {
		const disposable = vscode.commands.registerCommand(command, async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('There are no files open.');
				return;
			}

			// save file
			await editor.document.save();

			// get filepath
			const filePath = editor.document.fileName;

			// Get eval args from configuration
			const evalArgsString = getEvalArgsString();

			action(filePath, evalArgsString);
		});
		context.subscriptions.push(disposable);
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
