import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext): void {
  const serverPath = path.join(context.extensionPath, 'dist', 'server.js');

  function buildEnv(): Record<string, string> {
    const config = vscode.workspace.getConfiguration('chessMcp');
    const env: Record<string, string> = {};
    const baseUrl = config.get<string>('baseUrl');
    if (baseUrl) env['CHESS_BASE_URL'] = baseUrl;
    const maxGames = config.get<number>('maxGames');
    if (maxGames !== undefined) env['CHESS_MAX_GAMES'] = String(maxGames);
    const timeoutMs = config.get<number>('timeoutMs');
    if (timeoutMs !== undefined) env['CHESS_TIMEOUT_MS'] = String(timeoutMs);
    const userAgent = config.get<string>('userAgent');
    if (userAgent) env['CHESS_USER_AGENT'] = userAgent;
    return env;
  }

  const provider = vscode.lm.registerMcpServerDefinitionProvider('chess-mcp-servers', {
    provideMcpServerDefinitions() {
      return [
        new vscode.McpStdioServerDefinition(
          'Chess MCP Server',
          'node',
          [serverPath],
          buildEnv(),
          '0.1.0',
        ),
      ];
    },
  });

  context.subscriptions.push(provider);

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
