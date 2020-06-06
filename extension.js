const vscode = require('vscode');

function activate(context) {
	const disposable = vscode.commands.registerCommand('extension.addNumberLogs', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const document = editor.document;
		const selection = editor.selection;
		const text = document.getText(selection);

		let logNumber = 1;
		const newText = text.split('\n').reduce((newString, line) => {
			const trimmed = line.trim();
			const lastChar = trimmed[trimmed.length - 1];
			const isReturn = trimmed.startsWith('return');
			if (!trimmed || ![';', ')', '{', '}'].includes(lastChar) || isReturn) return `${newString}${line}\n`;

			return `${newString}${line}\n${`console.log(${logNumber++})`}\n`
		}, '');

		editor.edit(editBuilder => editBuilder.replace(selection, newText));
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
