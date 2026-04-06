import { z } from 'zod';
import type { ChessClient } from '../client/chess-client.js';
import { formatTimestamp, resultEmoji, gameResultText } from '../utils/formatter.js';

export const playerGamesSchema = z.object({
  username: z.string().describe('Chess.com username'),
  year: z.number().optional().describe('Year (default: current)'),
  month: z.number().min(1).max(12).optional().describe('Month 1-12 (default: current)'),
  limit: z.number().min(1).max(100).optional().default(10).describe('Max games to return'),
});

export const gameDetailsSchema = z.object({
  gameUrl: z.string().describe('Chess.com game URL'),
});

export const gameArchivesSchema = z.object({
  username: z.string().describe('Chess.com username'),
});

export async function getPlayerGames(
  client: ChessClient,
  args: z.infer<typeof playerGamesSchema>,
  maxGames: number,
): Promise<string> {
  const now = new Date();
  const year = args.year ?? now.getFullYear();
  const month = args.month ?? now.getMonth() + 1;
  const limit = Math.min(args.limit ?? 10, maxGames);

  const data = await client.getPlayerGames(args.username, year, month);
  const games = data.games.slice(-limit).reverse();

  if (games.length === 0) {
    return `No games found for ${args.username} in ${year}/${String(month).padStart(2, '0')}.`;
  }

  const lines = [
    `♟️ Recent Games: ${args.username} (${year}/${String(month).padStart(2, '0')})`,
    `Showing ${games.length} of ${data.games.length} games`,
    '',
  ];

  for (const game of games) {
    const isWhite = game.white.username.toLowerCase() === args.username.toLowerCase();
    const playerSide = isWhite ? 'white' : 'black';
    const playerData = isWhite ? game.white : game.black;
    const opponentData = isWhite ? game.black : game.white;

    const emoji = resultEmoji(playerData.result);
    const result = gameResultText(playerData.result);

    lines.push(`${emoji} vs ${opponentData.username} (${opponentData.rating}) — ${result}`);
    lines.push(
      `   ${game.time_class} | ${playerSide} (${playerData.rating}) | ${formatTimestamp(game.end_time)}`,
    );
    if (game.accuracies) {
      lines.push(
        `   Accuracy: White ${game.accuracies.white.toFixed(1)}% / Black ${game.accuracies.black.toFixed(1)}%`,
      );
    }
    lines.push(`   ${game.url}`);
    lines.push('');
  }

  return lines.join('\n');
}

export async function getGameDetails(
  _client: ChessClient,
  args: z.infer<typeof gameDetailsSchema>,
): Promise<string> {
  // Extract username, year, month from game URL
  // URL format: https://www.chess.com/game/live/12345 or similar
  // We need to search through archives — for now we return the URL info
  // The game URL contains the game data — we parse it from search
  const urlMatch = args.gameUrl.match(/chess\.com\/(?:game\/)?(?:live|daily)\/(\d+)/);

  if (!urlMatch) {
    return `Could not parse game URL: ${args.gameUrl}\nExpected format: https://www.chess.com/game/live/12345`;
  }

  return [
    `🔍 Game Details`,
    '',
    `Game URL: ${args.gameUrl}`,
    `Game ID: ${urlMatch[1]}`,
    '',
    "Note: To get full game details with PGN, use gm_player_games with the player's username and the month/year of the game.",
  ].join('\n');
}

export async function getGameArchives(
  client: ChessClient,
  args: z.infer<typeof gameArchivesSchema>,
): Promise<string> {
  const data = await client.getPlayerGameArchives(args.username);
  const archives = data.archives;

  if (archives.length === 0) {
    return `No game archives found for ${args.username}.`;
  }

  const lines = [
    `📁 Game Archives: ${args.username}`,
    `Total months with games: ${archives.length}`,
    '',
    'Available archives (most recent first):',
  ];

  const recent = archives.slice(-24).reverse();
  for (const url of recent) {
    const match = url.match(/\/games\/(\d{4})\/(\d{2})$/);
    if (match) {
      lines.push(`  ${match[1]}-${match[2]}`);
    }
  }

  if (archives.length > 24) {
    lines.push(`  ... and ${archives.length - 24} more months`);
  }

  return lines.join('\n');
}
