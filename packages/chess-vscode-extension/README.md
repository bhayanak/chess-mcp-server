# Chess MCP — VS Code Extension

A VS Code extension that integrates the Chess MCP Server, providing Chess.com data to AI assistants (GitHub Copilot, Claude, etc.) directly in your editor.

## Features

- Registers the Chess MCP server in VS Code's MCP server list
- Start/Stop/Show Output controls from the MCP servers panel
- Configurable settings via VS Code Settings UI
- Automatic server restart on settings change

## Configuration

Open VS Code Settings (`Cmd+,`) and search for "Chess MCP":

| Setting | Default | Description |
|---------|---------|-------------|
| `chessMcp.baseUrl` | `https://api.chess.com` | Chess.com API base URL |
| `chessMcp.maxGames` | `50` | Maximum games returned per query |
| `chessMcp.timeoutMs` | `15000` | API request timeout in milliseconds |
| `chessMcp.userAgent` | `Chess-MCP/0.1.0` | Custom User-Agent header |

## Usage

1. Install the extension
2. Open the MCP Servers panel in VS Code
3. Find "Chess MCP Server" in the list
4. Start the server
5. Use AI chat to query Chess.com data

### Example Prompts

- "Show me Magnus Carlsen's profile"
- "What are Hikaru's blitz stats?"
- "Compare MagnusCarlsen and Hikaru"
- "Show me today's chess puzzle"
- "List the top blitz players"

## Troubleshooting

- **Server not starting**: Check VS Code Output panel → "Chess MCP Server"
- **Settings not applying**: Restart the MCP server after changing settings
- **API errors**: Chess.com has rate limits; wait and retry

## License

[MIT](LICENSE)
