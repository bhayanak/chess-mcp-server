import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ChessClient } from './client/chess-client.js';
import type { ChessConfig } from './config.js';

import {
  playerProfileSchema,
  playerStatsSchema,
  comparePlayersSchema,
  getPlayerProfile,
  getPlayerStats,
  comparePlayers,
} from './tools/players.js';
import {
  playerGamesSchema,
  gameDetailsSchema,
  gameArchivesSchema,
  getPlayerGames,
  getGameDetails,
  getGameArchives,
} from './tools/games.js';
import { leaderboardsSchema, getLeaderboards } from './tools/leaderboards.js';
import { clubInfoSchema, clubMembersSchema, getClubInfo, getClubMembers } from './tools/clubs.js';
import { titledPlayersSchema, getTitledPlayers } from './tools/titled.js';
import { playerTournamentsSchema, getPlayerTournaments } from './tools/ratings.js';

export function createServer(config: ChessConfig): McpServer {
  const client = new ChessClient({ config });

  const server = new McpServer({
    name: 'Chess MCP Server',
    version: '0.1.0',
  });

  // 1. Player Profile
  server.tool(
    'gm_player_profile',
    'Get a Chess.com player profile including name, title, country, followers, and status',
    playerProfileSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await getPlayerProfile(client, args) }],
    }),
  );

  // 2. Player Stats
  server.tool(
    'gm_player_stats',
    'Get player ratings and statistics across all game types (rapid, blitz, bullet, daily, puzzles)',
    playerStatsSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await getPlayerStats(client, args) }],
    }),
  );

  // 3. Player Games
  server.tool(
    'gm_player_games',
    'Get recent games for a player in a given month/year with results, ratings, and accuracy',
    playerGamesSchema.shape,
    async (args) => ({
      content: [
        { type: 'text' as const, text: await getPlayerGames(client, args, config.maxGames) },
      ],
    }),
  );

  // 4. Game Details
  server.tool(
    'gm_game_details',
    'Get details for a specific Chess.com game by URL',
    gameDetailsSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await getGameDetails(client, args) }],
    }),
  );

  // 5. Game Archives
  server.tool(
    'gm_game_archives',
    'List all available monthly game archives for a player',
    gameArchivesSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await getGameArchives(client, args) }],
    }),
  );

  // 6. Leaderboards
  server.tool(
    'gm_leaderboards',
    'Get global Chess.com leaderboards by category (blitz, bullet, rapid, daily, tactics, etc.)',
    leaderboardsSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await getLeaderboards(client, args) }],
    }),
  );

  // 7. Titled Players
  server.tool(
    'gm_titled_players',
    'List all titled players by FIDE title (GM, IM, FM, WGM, etc.)',
    titledPlayersSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await getTitledPlayers(client, args) }],
    }),
  );

  // 8. Club Info
  server.tool(
    'gm_club_info',
    'Get information about a Chess.com club including members count, rating, and description',
    clubInfoSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await getClubInfo(client, args) }],
    }),
  );

  // 9. Club Members
  server.tool(
    'gm_club_members',
    'List members of a Chess.com club grouped by activity',
    clubMembersSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await getClubMembers(client, args) }],
    }),
  );

  // 10. Player Tournaments
  server.tool(
    'gm_player_tournaments',
    'Get tournament history for a player including results and placements',
    playerTournamentsSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await getPlayerTournaments(client, args) }],
    }),
  );

  // 11. Compare Players
  server.tool(
    'gm_compare_players',
    'Compare two Chess.com players side by side — ratings, win rates, total games, country',
    comparePlayersSchema.shape,
    async (args) => ({
      content: [{ type: 'text' as const, text: await comparePlayers(client, args) }],
    }),
  );

  // 12. Random Puzzle
  server.tool(
    'gm_random_puzzle',
    'Get the daily chess puzzle from Chess.com with FEN and PGN',
    {},
    async () => {
      const puzzle = await client.getDailyPuzzle();
      const text = [
        `🧩 Daily Puzzle: ${puzzle.title}`,
        '',
        `FEN: ${puzzle.fen}`,
        '',
        `PGN:`,
        puzzle.pgn,
        '',
        `URL: ${puzzle.url}`,
        `Image: ${puzzle.image}`,
      ].join('\n');
      return { content: [{ type: 'text' as const, text }] };
    },
  );

  return server;
}
