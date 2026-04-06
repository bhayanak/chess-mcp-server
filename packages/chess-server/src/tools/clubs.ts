import { z } from 'zod';
import type { ChessClient } from '../client/chess-client.js';
import { formatTimestamp } from '../utils/formatter.js';

export const clubInfoSchema = z.object({
  clubId: z.string().describe("Club URL name (e.g., 'chess-com-developer-community')"),
});

export const clubMembersSchema = z.object({
  clubId: z.string().describe('Club URL name'),
});

export async function getClubInfo(
  client: ChessClient,
  args: z.infer<typeof clubInfoSchema>,
): Promise<string> {
  const club = await client.getClub(args.clubId);

  const lines = [
    `🏠 Club: ${club.name}`,
    '',
    `Members:        ${club.members_count.toLocaleString()}`,
    `Avg Daily Rating: ${club.average_daily_rating}`,
    `Created:        ${formatTimestamp(club.created)}`,
    `Last Activity:  ${formatTimestamp(club.last_activity)}`,
    `Visibility:     ${club.visibility}`,
    `Join Policy:    ${club.join_request}`,
  ];

  if (club.description) {
    lines.push('');
    lines.push(`Description: ${club.description.slice(0, 300)}`);
  }

  lines.push('');
  lines.push(`URL: ${club.url}`);

  return lines.join('\n');
}

export async function getClubMembers(
  client: ChessClient,
  args: z.infer<typeof clubMembersSchema>,
): Promise<string> {
  const data = await client.getClubMembers(args.clubId);

  const lines = [`👥 Club Members: ${args.clubId}`, ''];

  const sections = [
    { label: 'Weekly Active', members: data.weekly },
    { label: 'Monthly Active', members: data.monthly },
    { label: 'All Time', members: data.all_time },
  ];

  for (const section of sections) {
    lines.push(`${section.label} (${section.members.length}):`);
    const shown = section.members.slice(0, 20);
    for (const m of shown) {
      lines.push(`  ${m.username} (joined: ${formatTimestamp(m.joined)})`);
    }
    if (section.members.length > 20) {
      lines.push(`  ... and ${section.members.length - 20} more`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
