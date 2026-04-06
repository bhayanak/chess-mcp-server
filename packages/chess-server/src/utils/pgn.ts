export function extractHeaders(pgn: string): Record<string, string> {
  const headers: Record<string, string> = {};
  const regex = /\[(\w+)\s+"([^"]*)"\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(pgn)) !== null) {
    headers[match[1]] = match[2];
  }
  return headers;
}

export function extractMoves(pgn: string): string {
  const lines = pgn.split('\n');
  const moveLines = lines.filter((l) => l.trim() && !l.startsWith('['));
  return moveLines.join(' ').trim();
}

export function formatPgnSummary(pgn: string): string {
  const headers = extractHeaders(pgn);
  const parts: string[] = [];

  if (headers.Event) parts.push(`Event: ${headers.Event}`);
  if (headers.White && headers.Black) {
    parts.push(`White: ${headers.White}${headers.WhiteElo ? ` (${headers.WhiteElo})` : ''}`);
    parts.push(`Black: ${headers.Black}${headers.BlackElo ? ` (${headers.BlackElo})` : ''}`);
  }
  if (headers.Result) parts.push(`Result: ${headers.Result}`);
  if (headers.Date) parts.push(`Date: ${headers.Date}`);
  if (headers.TimeControl) parts.push(`Time Control: ${headers.TimeControl}`);
  if (headers.ECO) parts.push(`Opening (ECO): ${headers.ECO}`);
  if (headers.ECOUrl) {
    const opening = headers.ECOUrl.split('/').pop()?.replace(/-/g, ' ');
    if (opening) parts.push(`Opening: ${opening}`);
  }
  if (headers.Termination) parts.push(`Termination: ${headers.Termination}`);

  return parts.join('\n');
}
