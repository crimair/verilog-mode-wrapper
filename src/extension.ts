import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

function getEmacsCommand(): string {
	const config = vscode.workspace.getConfiguration('verilog-mode-wrapper');
	const emacsPath = config.get<string>('emacsPath');
	
	if (emacsPath && emacsPath.trim() !== '') {
		return emacsPath;
	}
	
	// Default to 'emacs' if no path is configured
	return 'emacs';
}

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

function executeCommandInDirectory(command2: string, filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return new Promise((resolve, reject) => {
		const directory = path.dirname(filePath);
		const fileName = path.basename(filePath);
		const emacsCommand = getEmacsCommand();

		// Construct cursor position arguments for Emacs
		const gotoLineArg = `-eval \"(goto-line ${cursorPosition.line + 1})\"`; // VS Code line is 0-based, Emacs is 1-based
		const forwardCharArg = `-eval \"(forward-char ${cursorPosition.character})\"`;

		// Construct the command with evalArgs and cursor position args potentially included
		const command = `cd \"${directory}\" && \"${emacsCommand}\" --batch ${evalArgs} \"${fileName}\" ${gotoLineArg} ${forwardCharArg} ${command2}`;

		// Log the command for debugging purposes
		console.log(`Executing command: ${command}`);

		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error); // Reject the promise on error
				return;
			}
			if (stderr && stderr.trim() !== "") { // Check if stderr is not empty
				resolve(stderr); // Resolve with stderr content
				return;
			}
			// Resolve with stdout or a generic success message if needed
			resolve(stdout || 'Command executed successfully.');
		});
	});
}

function verilog_batch_auto(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-f verilog-batch-auto', filePath, evalArgs, cursorPosition);
}

function verilog_batch_delete_auto(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-f verilog-batch-delete-auto', filePath, evalArgs, cursorPosition);
}

function verilog_batch_diff_auto(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-f verilog-batch-diff-auto', filePath, evalArgs, cursorPosition);
}

function verilog_batch_inject_auto(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-f verilog-batch-inject-auto', filePath, evalArgs, cursorPosition);
}

function verilog_batch_indent(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-f verilog-batch-indent', filePath, evalArgs, cursorPosition);
}

function verilog_batch_delete_trailing_whitespace(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-f verilog-batch-delete-trailing-whitespace', filePath, evalArgs, cursorPosition);
}

function verilog_batch_pretty_declarations(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-eval "(verilog-batch-execute-func \\`verilog-pretty-declarations)"', filePath, evalArgs, cursorPosition);
}

function verilog_batch_label_be(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-eval "(verilog-batch-execute-func \\`verilog-label-be)"', filePath, evalArgs, cursorPosition);
}

function verilog_batch_expand_vector(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-eval "(verilog-batch-execute-func \\`verilog-expand-vector)"', filePath, evalArgs, cursorPosition);
}

function verilog_batch_pretty_expr(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-eval "(verilog-batch-execute-func \\`verilog-pretty-expr)"', filePath, evalArgs, cursorPosition);
}

function verilog_batch_delete_auto_star_implicit(filePath: string, evalArgs: string, cursorPosition: vscode.Position): Promise<string> {
	return executeCommandInDirectory('-eval "(verilog-batch-execute-func \\`verilog-delete-auto-star-implicit)"', filePath, evalArgs, cursorPosition);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Define the type for command actions
	type CommandAction = (filePath: string, evalArgs: string, cursorPosition: vscode.Position) => Promise<string>;

	// Define the structure for command objects
	interface CommandDefinition {
		command: string;
		title: string; // Add title for progress message
		action: CommandAction;
	}

	const commands: CommandDefinition[] = [
		{
			command: 'extension.verilog-mode-wrapper.auto',
			title: 'Running verilog-mode: AUTOs',
			action: verilog_batch_auto
		},
		{
			command: 'extension.verilog-mode-wrapper.deleteAuto',
			title: 'Running verilog-mode: Delete AUTOs',
			action: verilog_batch_delete_auto
		},
		{
			command: 'extension.verilog-mode-wrapper.diffAuto',
			title: 'Running verilog-mode: Diff AUTOs',
			action: verilog_batch_diff_auto
		},
		{
			command: 'extension.verilog-mode-wrapper.injectAuto',
			title: 'Running verilog-mode: Inject AUTOs',
			action: verilog_batch_inject_auto
		},
		{
			command: 'extension.verilog-mode-wrapper.indent',
			title: 'Running verilog-mode: Indent',
			action: verilog_batch_indent
		},
		{
			command: 'extension.verilog-mode-wrapper.deleteTrailingWhitespace',
			title: 'Running verilog-mode: Delete Trailing Whitespace',
			action: verilog_batch_delete_trailing_whitespace
		},
		{
			command: 'extension.verilog-mode-wrapper.prettyDeclarations',
			title: 'Running verilog-mode: Pretty Declarations',
			action: verilog_batch_pretty_declarations
},
		{
			command: 'extension.verilog-mode-wrapper.labelBe',
			title: 'Running verilog-mode: Label BE',
			action: verilog_batch_label_be
		},
		{
			command: 'extension.verilog-mode-wrapper.expandVector',
			title: 'Running verilog-mode: Expand Vector',
			action: verilog_batch_expand_vector
		},
		{
			command: 'extension.verilog-mode-wrapper.prettyExpr',
			title: 'Running verilog-mode: Pretty Expression',
			action: verilog_batch_pretty_expr
		},
		{
			command: 'extension.verilog-mode-wrapper.deleteAutoStarImplicit',
			title: 'Running verilog-mode: Delete AUTO STAR Implicit',
			action: verilog_batch_delete_auto_star_implicit
		}
	];

	commands.forEach(({ command, title, action }: CommandDefinition) => {
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
			// Get current cursor position
			const cursorPosition = editor.selection.active;

			// Get eval args from configuration
			const evalArgsString = getEvalArgsString();

			// Use withProgress to show progress notification
			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: title,
				cancellable: false // If the command can be cancelled, set this to true and handle cancellation
			}, async (progress) => {
				progress.report({ increment: 0, message: "Starting..." });

				try {
					// Execute the command and wait for it to complete, passing cursor position
					const result = await action(filePath, evalArgsString, cursorPosition);
					progress.report({ increment: 100, message: "Completed." });
				} catch (error: any) {
					progress.report({ increment: 100, message: "Failed." });
					vscode.window.showErrorMessage(`Error: ${error.message}`);
				}
				// Keep the notification visible for a short period after completion/failure
                await new Promise(resolve => setTimeout(resolve, 3000));
			});
		});
		context.subscriptions.push(disposable);
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
