export function formatTimestamp(epoch: number): string {
  if (!epoch) return 'N/A';
  return new Date(epoch * 1000).toISOString().split('T')[0];
}

export function formatTimeAgo(epoch: number): string {
  if (!epoch) return 'N/A';
  const now = Math.floor(Date.now() / 1000);
  const diff = now - epoch;

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return formatTimestamp(epoch);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(0)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatWinRate(wins: number, losses: number, draws: number): string {
  const total = wins + losses + draws;
  if (total === 0) return 'N/A';
  return `${((wins / total) * 100).toFixed(1)}%`;
}

export function padRight(str: string, len: number): string {
  return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

export function padLeft(str: string, len: number): string {
  return str.length >= len ? str : ' '.repeat(len - str.length) + str;
}

export function countryCodeFromUrl(url: string): string {
  const match = url.match(/\/country\/(\w+)/);
  return match ? match[1] : 'Unknown';
}

export function resultEmoji(result: string): string {
  switch (result) {
    case 'win':
      return '✅';
    case 'checkmated':
    case 'resigned':
    case 'timeout':
    case 'abandoned':
      return '❌';
    case 'stalemate':
    case 'agreed':
    case 'repetition':
    case 'insufficient':
    case 'timevsinsufficient':
    case '50move':
      return '🤝';
    default:
      return '⬜';
  }
}

export function gameResultText(result: string): string {
  const map: Record<string, string> = {
    win: 'Won',
    checkmated: 'Checkmated',
    resigned: 'Resigned',
    timeout: 'Timeout',
    abandoned: 'Abandoned',
    stalemate: 'Stalemate',
    agreed: 'Draw (agreed)',
    repetition: 'Draw (repetition)',
    insufficient: 'Draw (insufficient)',
    timevsinsufficient: 'Draw (time vs insufficient)',
    '50move': 'Draw (50-move)',
    kingofthehill: 'King of the Hill',
    threecheck: 'Three-check',
    bughouse: 'Bughouse partner lost',
  };
  return map[result] ?? result;
}
