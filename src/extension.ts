import * as vscode from 'vscode';
import { exec } from 'child_process';

function verilog_batch_auto(filePath: string) {

	const command = `emacs --batch ${filePath} -f verilog-batch-auto`;

	// execute command
	exec(command, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			vscode.window.showInformationMessage(`Done: ${stderr}`);
			return;
		}
	});
}

function verilog_batch_delete_auto(filePath: string) {

	const command = `emacs --batch ${filePath} -f verilog-batch-delete-auto`;

	// execute command
	exec(command, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			vscode.window.showInformationMessage(`Done: ${stderr}`);
			return;
		}
	});
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.runVerilogAuto', async () => {

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('There are no files open.');
		return;
	}

	// save file
	await editor.document.save();

	// get filepath
	const filePath = editor.document.fileName;

	verilog_batch_auto(filePath);
	
	});

	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('extension.deleteVerilogAuto', async () => {

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('There are no files open.');
		return;
	}

	// save file
	await editor.document.save();

	// get filepath
	const filePath = editor.document.fileName;

	verilog_batch_delete_auto(filePath);
	
	});

	context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() { }
