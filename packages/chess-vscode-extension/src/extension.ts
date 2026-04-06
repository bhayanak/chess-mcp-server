import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  // Listen for configuration changes and prompt restart
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('chessMcp')) {
        vscode.window
          .showInformationMessage(
            'Chess MCP settings changed. Restart the MCP server for changes to take effect.',
            'Restart Server',
          )
          .then((selection) => {
            if (selection === 'Restart Server') {
              vscode.commands.executeCommand('workbench.action.chat.restartMcpServer');
            }
          });
      }
    }),
  );
}

export function deactivate(): void {
  // cleanup handled by disposables
}
