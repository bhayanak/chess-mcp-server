# Chess MCP Server

The core MCP server package that wraps the Chess.com Published Data API.

## Installation

```bash
npm install chess-mcp-server
```

Or run directly:

```bash
npx chess-mcp-server
```

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

## License

MIT
