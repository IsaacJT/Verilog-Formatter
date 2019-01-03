'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.languages.registerDocumentFormattingEditProvider({ scheme: "file", language: "verilog"}, {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			runFormatter();
			return [];
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }

const styleMap: { [style: string]: string } = {
	"Indent only": "",
	"K&R": "kr",
	"GNU": "gnu",
	"ANSI": "ansi"
};

function runFormatter() {
	const iStylePath = <string>vscode.workspace.getConfiguration().get('verilog-formatter.istyle.path');
	const iStyleExtraArgs = <string>vscode.workspace.getConfiguration().get('verilog-formatter.istyle.args');
	const style = <string>vscode.workspace.getConfiguration().get('verilog-formatter.istyle.style');
	const mapStyle = styleMap[style];
	if (mapStyle === undefined) {
		return;
	}
	var args: string[] = [];
	if (mapStyle.length !== 0) {
		args.push(`--style=${mapStyle}`);
	}
	if (iStyleExtraArgs.length !== 0) {
		args.push(iStyleExtraArgs);
	}
	const proc: child.ChildProcess = child.execFile(iStylePath, args, {}, (error: Error | null, stdout: string, stderr: string) => {
		if (error) {
			throw error;
		}
		console.log(stdout);
	});
}
