<div align="center">

<img src="logo.png" alt="Chess MCP Server Logo" width="180"/>

# @fazorboy/chess-mcp-server

The core MCP server package that wraps the Chess.com Published Data API.

[![npm](https://img.shields.io/npm/v/@fazorboy/chess-mcp-server)](https://www.npmjs.com/package/@fazorboy/chess-mcp-server)

</div>

## Installation

```bash
npm install -g @fazorboy/chess-mcp-server
```

Or run directly:

```bash
npx @fazorboy/chess-mcp-server
```

## Setup

### VS Code / GitHub Copilot

Add the following to your VS Code `settings.json` (`Cmd+Shift+P` → "Preferences: Open User Settings (JSON)"):

```json
{
  "mcp": {
    "servers": {
      "chess-mcp": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@fazorboy/chess-mcp-server"],
        "env": {
          "CHESS_MAX_GAMES": "50",
          "CHESS_TIMEOUT_MS": "15000"
        }
      }
    }
  }
}
```

> **Tip**: Or install the [Chess MCP VS Code Extension](../chess-vscode-extension/README.md) for zero-config setup.

### Claude Desktop

Add the following to your Claude Desktop config file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "chess-mcp": {
      "command": "npx",
      "args": ["-y", "@fazorboy/chess-mcp-server"],
      "env": {
        "CHESS_MAX_GAMES": "50",
        "CHESS_TIMEOUT_MS": "15000"
      }
    }
  }
}
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CHESS_BASE_URL` | `https://api.chess.com` | Chess.com API base URL |
| `CHESS_MAX_GAMES` | `50` | Maximum games returned per query |
| `CHESS_TIMEOUT_MS` | `15000` | Request timeout in milliseconds |
| `CHESS_USER_AGENT` | `Chess-MCP/0.1.0` | User-Agent header for API requests |

## Tools Reference

### `gm_player_profile`
Get a Chess.com player profile.

**Input**: `{ username: string }`

### `gm_player_stats`
Get player ratings and statistics across all game types.

**Input**: `{ username: string }`

### `gm_player_games`
Get recent games for a player.

**Input**: `{ username: string, year?: number, month?: number, limit?: number }`

### `gm_game_details`
Get details for a specific Chess.com game.

**Input**: `{ gameUrl: string }`

### `gm_game_archives`
List all available monthly game archives.

**Input**: `{ username: string }`

### `gm_leaderboards`
Get global Chess.com leaderboards.

**Input**: `{ category?: "daily" | "rapid" | "blitz" | "bullet" | "bughouse" | "chess960" | "tactics" }`

### `gm_titled_players`
List titled players by FIDE title.

**Input**: `{ title: "GM" | "WGM" | "IM" | "WIM" | "FM" | "WFM" | "NM" | "WNM" | "CM" | "WCM" }`

### `gm_club_info`
Get information about a Chess.com club.

**Input**: `{ clubId: string }`

### `gm_club_members`
List members of a Chess.com club.

**Input**: `{ clubId: string }`

### `gm_player_tournaments`
Get tournament history for a player.

**Input**: `{ username: string }`

### `gm_compare_players`
Compare two Chess.com players.

**Input**: `{ player1: string, player2: string }`

### `gm_random_puzzle`
Get the daily chess puzzle.

**Input**: *(none)*

## API Mapping

| Tool | Chess.com API Endpoint |
|------|----------------------|
| `gm_player_profile` | `GET /pub/player/{username}` |
| `gm_player_stats` | `GET /pub/player/{username}/stats` |
| `gm_player_games` | `GET /pub/player/{username}/games/{YYYY}/{MM}` |
| `gm_game_archives` | `GET /pub/player/{username}/games/archives` |
| `gm_leaderboards` | `GET /pub/leaderboards` |
| `gm_titled_players` | `GET /pub/titled/{title}` |
| `gm_club_info` | `GET /pub/club/{club-id}` |
| `gm_club_members` | `GET /pub/club/{club-id}/members` |
| `gm_player_tournaments` | `GET /pub/player/{username}/tournaments` |
| `gm_random_puzzle` | `GET /pub/puzzle` |

## Example Prompts

- "Show me Magnus Carlsen's chess profile"
- "What are Hikaru's blitz stats in chess?"
- "Compare MagnusCarlsen and Hikaru chess profiles"
- "Show me today's chess puzzle"
- "List the top blitz players in chess"

## License

MIT
