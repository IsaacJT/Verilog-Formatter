'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child from 'child_process';
import * as temp from 'temp';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.languages.registerDocumentFormattingEditProvider({ scheme: "file", language: "verilog" }, {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			let result: vscode.TextEdit[] = [];
			temp.track();
			try {
				result = runFormatter(document);
			} catch (err) {
				console.log(err);
			}
			return result;
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

function runFormatter(document: vscode.TextDocument): vscode.TextEdit[] {
	const iStylePath = <string>vscode.workspace.getConfiguration().get('verilog-formatter.istyle.path');
	const iStyleExtraArgs = <string>vscode.workspace.getConfiguration().get('verilog-formatter.istyle.args');
	var args: string[] = [
		"-n", // Do not create a .orig file
	];
	const style = getFormattingStyleArg();
	if (style.length !== 0) {
		args.push(style);
	}
	if (iStyleExtraArgs.length !== 0) {
		args.push(iStyleExtraArgs);
	}
	var tempfile: string = createTempFileOfDocument(document);
	args.push(tempfile);
	console.log(`Executing command: "${iStylePath} ${args.join(" ")}"`);
	child.execFileSync(iStylePath, args, {});
	return determineEdits(document, tempfile);
}

function getFormattingStyleArg(): string {
	const style = <string>vscode.workspace.getConfiguration().get('verilog-formatter.istyle.style');
	const mapStyle = styleMap[style];
	if (mapStyle !== undefined && mapStyle.length !== 0) {
		return `--style = ${mapStyle}`;
	} else {
		return "";
	}
}

function createTempFileOfDocument(document: vscode.TextDocument): string {
	const content = document.getText();
	const tempfile = temp.openSync();
	if (tempfile === undefined) {
		throw "Unable to create temporary file";
	}
	fs.writeSync(tempfile.fd, content);
	fs.closeSync(tempfile.fd);
	return tempfile.path;
}

function determineEdits(document: vscode.TextDocument, tempfile: string): vscode.TextEdit[] {
	const origContent = document.getText();
	const wholeFile = new vscode.Range(document.positionAt(0),
		document.positionAt(origContent.length));
	const formatted = fs.readFileSync(tempfile, { encoding: "utf8" });
	return [
		vscode.TextEdit.replace(wholeFile, formatted),
	];
}
