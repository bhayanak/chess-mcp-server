import { z } from 'zod';
import type { ChessClient } from '../client/chess-client.js';

export const titledPlayersSchema = z.object({
  title: z
    .enum(['GM', 'WGM', 'IM', 'WIM', 'FM', 'WFM', 'NM', 'WNM', 'CM', 'WCM'])
    .describe('FIDE title'),
});

export async function getTitledPlayers(
  client: ChessClient,
  args: z.infer<typeof titledPlayersSchema>,
): Promise<string> {
  const data = await client.getTitledPlayers(args.title);
  const players = data.players;

  const lines = [`🎖️ Titled Players: ${args.title}`, `Total: ${players.length}`, ''];

  const shown = players.slice(0, 50);
  const columns = 3;
  const colWidth = 25;

  for (let i = 0; i < shown.length; i += columns) {
    const row = shown.slice(i, i + columns);
    lines.push(row.map((p) => p.padEnd(colWidth)).join(''));
  }

  if (players.length > 50) {
    lines.push('');
    lines.push(`... and ${players.length - 50} more ${args.title} players`);
  }

  return lines.join('\n');
}
