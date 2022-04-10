import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path'
import { getContainer } from './Boilerplate/container';
import { getContext } from './Boilerplate/context';
import { getView } from './Boilerplate/view';
import { exit } from 'process';

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function activate(context: vscode.ExtensionContext) {
	const fsPromises = fs.promises;
	const disposable = vscode.commands.registerCommand('rcvp.rcvp', async () => {
		if (vscode.workspace.workspaceFolders !== undefined) {
			const wf = vscode.workspace.workspaceFolders[0].uri;
			const componentName = await vscode.window.showInputBox({ placeHolder: 'Name of your component' });
			if (componentName) {
				const name = capitalizeFirstLetter(componentName);
				const exists = await fsPromises.stat(path.join(wf.path, name)).then((data) => data).catch((err) => console.log(""));
				if (!exists) {
					fsPromises.mkdir(path.join(wf.path, name)).then(() => {
						fsPromises.mkdir(path.join(wf.path + "/" + name, "utils")).then(() => {
							fsPromises.writeFile(path.join(wf.path + "/" + name + "/" + "utils", `context.ts`), getContext(name));
						}).catch((err) => vscode.window.showErrorMessage(err + ""));


						fs.writeFile(path.join(wf.path + "/" + name, `${name}.container.tsx`), getContainer(name), (err) => {
							if (err) {
								return vscode.window.showErrorMessage(err + "");
							}
						});

						fs.writeFile(path.join(wf.path + "/" + name, `${name}.view.tsx`), getView(name), (err) => {
							if (err) {
								return vscode.window.showErrorMessage(err + "");
							}
						});

						fs.writeFile(path.join(wf.path + "/" + name, `index.ts`), `export { default as ${name} } from "./${name}.container";`, (err) => {
							if (err) {
								return vscode.window.showErrorMessage(err + "");
							}
						});

					}).catch((err) => vscode.window.showErrorMessage(err + ""));
					vscode.window.showInformationMessage("Pattern Created Successfully")
				}
				else {
					return vscode.window.showErrorMessage(`${name} already exists in root directory`);
				}
			}
		}
		else {
			const message = "Working folder not found, open a folder an try again";
			vscode.window.showErrorMessage(message);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }