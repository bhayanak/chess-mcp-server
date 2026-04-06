import { z } from 'zod';
import type { ChessClient } from '../client/chess-client.js';
import { formatTimestamp, formatTimeAgo, countryCodeFromUrl } from '../utils/formatter.js';

export const playerProfileSchema = z.object({
  username: z.string().describe('Chess.com username'),
});

export const playerStatsSchema = z.object({
  username: z.string().describe('Chess.com username'),
});

export const comparePlayersSchema = z.object({
  player1: z.string().describe('First player username'),
  player2: z.string().describe('Second player username'),
});

export async function getPlayerProfile(
  client: ChessClient,
  args: z.infer<typeof playerProfileSchema>,
): Promise<string> {
  const profile = await client.getPlayerProfile(args.username);
  const country = countryCodeFromUrl(profile.country);

  const lines = [
    `♔ Player Profile: ${profile.username}`,
    '',
    `Name:        ${profile.name ?? 'N/A'}`,
    `Title:       ${profile.title ?? 'None'}`,
    `Country:     ${country}`,
    `Followers:   ${profile.followers.toLocaleString()}`,
    `Joined:      ${formatTimestamp(profile.joined)}`,
    `Last Online: ${formatTimeAgo(profile.last_online)}`,
    `Status:      ${profile.status}`,
    `Streamer:    ${profile.is_streamer ? 'Yes' : 'No'}`,
    '',
    `Profile: ${profile.url}`,
  ];

  return lines.join('\n');
}

export async function getPlayerStats(
  client: ChessClient,
  args: z.infer<typeof playerStatsSchema>,
): Promise<string> {
  const stats = await client.getPlayerStats(args.username);

  const categories = [
    { name: 'Rapid', data: stats.chess_rapid },
    { name: 'Blitz', data: stats.chess_blitz },
    { name: 'Bullet', data: stats.chess_bullet },
    { name: 'Daily', data: stats.chess_daily },
  ];

  const lines = [
    `📊 Stats for ${args.username}`,
    '',
    'Category       Current    Best       W/L/D          Win%',
    '━'.repeat(60),
  ];

  let totalGames = 0;

  for (const cat of categories) {
    const current = cat.data?.last?.rating?.toString() ?? '—';
    const best = cat.data?.best?.rating?.toString() ?? '—';
    const record = cat.data?.record;
    const wld = record ? `${record.win}/${record.loss}/${record.draw}` : '—';
    const winPct =
      record && record.win + record.loss + record.draw > 0
        ? `${((record.win / (record.win + record.loss + record.draw)) * 100).toFixed(1)}%`
        : '—';

    if (record) {
      totalGames += record.win + record.loss + record.draw;
    }

    lines.push(
      `${cat.name.padEnd(15)}${current.padEnd(11)}${best.padEnd(11)}${wld.padEnd(15)}${winPct}`,
    );
  }

  // Puzzles
  const puzzleCurrent = stats.tactics?.last?.rating?.toString() ?? '—';
  const puzzleBest = stats.tactics?.best?.rating?.toString() ?? '—';
  lines.push(
    `${'Puzzles'.padEnd(15)}${puzzleCurrent.padEnd(11)}${puzzleBest.padEnd(11)}${'—'.padEnd(15)}—`,
  );

  lines.push('');
  lines.push(`Total Games: ${totalGames.toLocaleString()}`);
  if (stats.fide) lines.push(`FIDE Rating: ${stats.fide}`);
  if (stats.puzzle_rush?.best?.score) {
    lines.push(`Puzzle Rush Best: ${stats.puzzle_rush.best.score}`);
  }

  return lines.join('\n');
}

export async function comparePlayers(
  client: ChessClient,
  args: z.infer<typeof comparePlayersSchema>,
): Promise<string> {
  const [profile1, profile2, stats1, stats2] = await Promise.all([
    client.getPlayerProfile(args.player1),
    client.getPlayerProfile(args.player2),
    client.getPlayerStats(args.player1),
    client.getPlayerStats(args.player2),
  ]);

  const p1 = profile1.username;
  const p2 = profile2.username;

  const lines = [
    `⚔️ Player Comparison`,
    '',
    `${''.padEnd(20)}${p1.padEnd(18)}${p2}`,
    '━'.repeat(56),
    `${'Title'.padEnd(20)}${(profile1.title ?? 'None').padEnd(18)}${profile2.title ?? 'None'}`,
    `${'Blitz'.padEnd(20)}${(stats1.chess_blitz?.last?.rating?.toString() ?? '—').padEnd(18)}${stats2.chess_blitz?.last?.rating?.toString() ?? '—'}`,
    `${'Bullet'.padEnd(20)}${(stats1.chess_bullet?.last?.rating?.toString() ?? '—').padEnd(18)}${stats2.chess_bullet?.last?.rating?.toString() ?? '—'}`,
    `${'Rapid'.padEnd(20)}${(stats1.chess_rapid?.last?.rating?.toString() ?? '—').padEnd(18)}${stats2.chess_rapid?.last?.rating?.toString() ?? '—'}`,
    `${'Daily'.padEnd(20)}${(stats1.chess_daily?.last?.rating?.toString() ?? '—').padEnd(18)}${stats2.chess_daily?.last?.rating?.toString() ?? '—'}`,
  ];

  const wld1 = stats1.chess_blitz?.record;
  const wld2 = stats2.chess_blitz?.record;
  const wr1 =
    wld1 && wld1.win + wld1.loss + wld1.draw > 0
      ? `${((wld1.win / (wld1.win + wld1.loss + wld1.draw)) * 100).toFixed(1)}%`
      : '—';
  const wr2 =
    wld2 && wld2.win + wld2.loss + wld2.draw > 0
      ? `${((wld2.win / (wld2.win + wld2.loss + wld2.draw)) * 100).toFixed(1)}%`
      : '—';
  lines.push(`${'Win Rate (Blitz)'.padEnd(20)}${wr1.padEnd(18)}${wr2}`);

  const total1 = ['chess_rapid', 'chess_blitz', 'chess_bullet', 'chess_daily'].reduce((sum, k) => {
    const r = (stats1 as Record<string, unknown>)[k] as
      | { record?: { win: number; loss: number; draw: number } }
      | undefined;
    return sum + (r?.record ? r.record.win + r.record.loss + r.record.draw : 0);
  }, 0);
  const total2 = ['chess_rapid', 'chess_blitz', 'chess_bullet', 'chess_daily'].reduce((sum, k) => {
    const r = (stats2 as Record<string, unknown>)[k] as
      | { record?: { win: number; loss: number; draw: number } }
      | undefined;
    return sum + (r?.record ? r.record.win + r.record.loss + r.record.draw : 0);
  }, 0);

  lines.push(
    `${'Total Games'.padEnd(20)}${total1.toLocaleString().padEnd(18)}${total2.toLocaleString()}`,
  );
  lines.push(
    `${'Country'.padEnd(20)}${countryCodeFromUrl(profile1.country).padEnd(18)}${countryCodeFromUrl(profile2.country)}`,
  );
  lines.push(
    `${'Followers'.padEnd(20)}${profile1.followers.toLocaleString().padEnd(18)}${profile2.followers.toLocaleString()}`,
  );

  return lines.join('\n');
}
