export interface ChessConfig {
  baseUrl: string;
  maxGames: number;
  timeoutMs: number;
  userAgent: string;
}

export function loadConfig(): ChessConfig {
  return {
    baseUrl: process.env.CHESS_BASE_URL ?? 'https://api.chess.com',
    maxGames: parseInt(process.env.CHESS_MAX_GAMES ?? '50', 10),
    timeoutMs: parseInt(process.env.CHESS_TIMEOUT_MS ?? '15000', 10),
    userAgent: process.env.CHESS_USER_AGENT ?? 'Chess-MCP/0.1.0',
  };
}
