import { z } from 'zod';
import type { ChessClient } from '../client/chess-client.js';

export const leaderboardsSchema = z.object({
  category: z
    .enum(['daily', 'rapid', 'blitz', 'bullet', 'bughouse', 'chess960', 'tactics'])
    .optional()
    .default('blitz')
    .describe('Leaderboard category'),
});

const categoryApiMap: Record<string, string> = {
  daily: 'daily',
  rapid: 'live_rapid',
  blitz: 'live_blitz',
  bullet: 'live_bullet',
  bughouse: 'live_bughouse',
  chess960: 'live_blitz960',
  tactics: 'tactics',
};

export async function getLeaderboards(
  client: ChessClient,
  args: z.infer<typeof leaderboardsSchema>,
): Promise<string> {
  const data = await client.getLeaderboards();
  const key = categoryApiMap[args.category] ?? 'live_blitz';
  const entries = (data as unknown as Record<string, unknown>)[key] as
    | Array<{
        rank: number;
        username: string;
        title?: string;
        score: number;
        win_count?: number;
        loss_count?: number;
        draw_count?: number;
      }>
    | undefined;

  if (!entries || entries.length === 0) {
    return `No leaderboard data for category: ${args.category}`;
  }

  const lines = [
    `🏆 Leaderboard: ${args.category.charAt(0).toUpperCase() + args.category.slice(1)}`,
    '',
    `${'#'.padEnd(5)}${'Player'.padEnd(22)}${'Title'.padEnd(6)}${'Rating'.padEnd(10)}${'W/L/D'}`,
    '━'.repeat(55),
  ];

  const top = entries.slice(0, 25);
  for (const entry of top) {
    const wld =
      entry.win_count !== undefined
        ? `${entry.win_count}/${entry.loss_count ?? 0}/${entry.draw_count ?? 0}`
        : '—';
    lines.push(
      `${String(entry.rank).padEnd(5)}${entry.username.padEnd(22)}${(entry.title ?? '').padEnd(6)}${String(entry.score).padEnd(10)}${wld}`,
    );
  }

  return lines.join('\n');
}
