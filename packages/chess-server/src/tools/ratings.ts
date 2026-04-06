import { z } from 'zod';
import type { ChessClient } from '../client/chess-client.js';

export const playerTournamentsSchema = z.object({
  username: z.string().describe('Chess.com username'),
});

export async function getPlayerTournaments(
  client: ChessClient,
  args: z.infer<typeof playerTournamentsSchema>,
): Promise<string> {
  const data = await client.getPlayerTournaments(args.username);

  const lines = [
    `🏅 Tournaments: ${args.username}`,
    '',
    `Finished: ${data.finished.length} | In Progress: ${data.in_progress.length} | Registered: ${data.registered.length}`,
    '',
  ];

  if (data.finished.length > 0) {
    lines.push('Recent Finished Tournaments:');
    lines.push(`${'Tournament'.padEnd(40)}${'W/L/D'.padEnd(12)}${'Placement'}`);
    lines.push('━'.repeat(65));

    const recent = data.finished.slice(-15).reverse();
    for (const t of recent) {
      const name = t.url.split('/').pop() ?? t.url;
      const wld = `${t.wins}/${t.losses}/${t.draws}`;
      const placement =
        t.placement !== undefined && t.total_players ? `${t.placement}/${t.total_players}` : '—';
      lines.push(`${name.slice(0, 38).padEnd(40)}${wld.padEnd(12)}${placement}`);
    }
  }

  if (data.in_progress.length > 0) {
    lines.push('');
    lines.push('In Progress:');
    for (const t of data.in_progress) {
      const name = t.url.split('/').pop() ?? t.url;
      lines.push(`  ${name} — W:${t.wins} L:${t.losses} D:${t.draws}`);
    }
  }

  return lines.join('\n');
}
