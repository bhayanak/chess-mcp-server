import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('Config', () => {
  const origEnv = { ...process.env };

  beforeEach(() => {
    // Clean env
    delete process.env.CHESS_BASE_URL;
    delete process.env.CHESS_MAX_GAMES;
    delete process.env.CHESS_TIMEOUT_MS;
    delete process.env.CHESS_USER_AGENT;
  });

  afterEach(() => {
    process.env = { ...origEnv };
  });

  it('should return defaults when no env vars set', () => {
    const config = loadConfig();
    expect(config.baseUrl).toBe('https://api.chess.com');
    expect(config.maxGames).toBe(50);
    expect(config.timeoutMs).toBe(15000);
    expect(config.userAgent).toBe('Chess-MCP/0.1.0');
  });

  it('should read from environment variables', () => {
    process.env.CHESS_BASE_URL = 'https://custom.api.com';
    process.env.CHESS_MAX_GAMES = '100';
    process.env.CHESS_TIMEOUT_MS = '30000';
    process.env.CHESS_USER_AGENT = 'Custom/1.0';

    const config = loadConfig();
    expect(config.baseUrl).toBe('https://custom.api.com');
    expect(config.maxGames).toBe(100);
    expect(config.timeoutMs).toBe(30000);
    expect(config.userAgent).toBe('Custom/1.0');
  });
});
