const vscode = require('vscode');

function okToAddLog(line, nextLine) {
	return (
		emptyLineBeforeNonEmptyLine(line, nextLine) ||
		(validLastChar(line) && !isReturn(line) && !withinObjectOrFnChain(nextLine))
	);
}

function emptyLineBeforeNonEmptyLine(line, nextLine) {
	return !line && !!nextLine;
}

function validLastChar(line) {
	const lastChar = line[line.length - 1];
	return [';', ')', '{', '}'].includes(lastChar);
}

function isReturn(line) {
	return line.startsWith('return');
}

function withinObjectOrFnChain(nextLine) {
	const nextLineFirstChar = nextLine[0];
	const nextLineLastChar = nextLine[nextLine.length - 1];
	return nextLineLastChar === ',' || nextLineFirstChar === '.';
}

function activate(context) {
	const disposable = vscode.commands.registerCommand('extension.addNumberLogs', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const document = editor.document;
		const selection = editor.selection;
		const text = document.getText(selection);

		let logNumber = 1;
		const newText = text.split('\n').reduce((newString, line, idx, linesArray) => {
			const trimmedLine = line.trim();
			const trimmedNextLine = (linesArray[idx + 1] || '').trim();
      if (okToAddLog(trimmedLine, trimmedNextLine)) return `${newString}${line}\n${`console.log(${logNumber++})`}\n`;
			return `${newString}${line}\n`
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
