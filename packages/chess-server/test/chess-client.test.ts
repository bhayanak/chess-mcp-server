import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChessClient, ChessApiError } from '../src/client/chess-client.js';
import type { ChessConfig } from '../src/config.js';

const defaultConfig: ChessConfig = {
  baseUrl: 'https://api.chess.com',
  maxGames: 50,
  timeoutMs: 15000,
  userAgent: 'Chess-MCP-Test/0.1.0',
};

describe('ChessClient', () => {
  let client: ChessClient;

  beforeEach(() => {
    client = new ChessClient({ config: defaultConfig });
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should strip trailing slashes from baseUrl', () => {
      const c = new ChessClient({
        config: { ...defaultConfig, baseUrl: 'https://api.chess.com///' },
      });
      expect(c).toBeDefined();
    });
  });

  describe('get', () => {
    it('should make a GET request and return JSON', async () => {
      const mockData = { username: 'test' };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockData), { status: 200 }),
      );

      const result = await client.get('/pub/player/test');
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/player/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'User-Agent': 'Chess-MCP-Test/0.1.0',
          }),
        }),
      );
    });

    it('should throw ChessApiError on 404', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Not Found', { status: 404 }));

      await expect(client.get('/pub/player/nonexistent')).rejects.toThrow(ChessApiError);
      await expect(client.get('/pub/player/nonexistent')).rejects.toThrow('Not found');
    });

    it('should throw ChessApiError on 429 rate limit', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Too Many Requests', { status: 429 }),
      );

      await expect(client.get('/pub/player/test')).rejects.toThrow('Rate limited');
    });

    it('should throw ChessApiError on other HTTP errors', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Server Error', { status: 500, statusText: 'Internal Server Error' }),
      );

      await expect(client.get('/pub/player/test')).rejects.toThrow('Chess.com API error: 500');
    });

    it('should throw ChessApiError on timeout', async () => {
      const shortTimeout = new ChessClient({
        config: { ...defaultConfig, timeoutMs: 1 },
      });

      vi.spyOn(globalThis, 'fetch').mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await expect(shortTimeout.get('/pub/player/test')).rejects.toThrow(ChessApiError);
    });

    it('should throw ChessApiError on network error', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'));

      await expect(client.get('/pub/player/test')).rejects.toThrow('Network error');
    });

    it('should throw ChessApiError on non-Error rejection', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue('string error');

      await expect(client.get('/pub/player/test')).rejects.toThrow('Network error: string error');
    });
  });

  describe('API methods', () => {
    beforeEach(() => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({}), { status: 200 }),
      );
    });

    it('getPlayerProfile calls correct endpoint', async () => {
      await client.getPlayerProfile('MagnusCarlsen');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/player/magnuscarlsen',
        expect.anything(),
      );
    });

    it('getPlayerStats calls correct endpoint', async () => {
      await client.getPlayerStats('Hikaru');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/player/hikaru/stats',
        expect.anything(),
      );
    });

    it('getPlayerGames calls correct endpoint with zero-padded month', async () => {
      await client.getPlayerGames('test', 2024, 3);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/player/test/games/2024/03',
        expect.anything(),
      );
    });

    it('getPlayerGames handles double-digit months', async () => {
      await client.getPlayerGames('test', 2024, 12);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/player/test/games/2024/12',
        expect.anything(),
      );
    });

    it('getPlayerGameArchives calls correct endpoint', async () => {
      await client.getPlayerGameArchives('test');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/player/test/games/archives',
        expect.anything(),
      );
    });

    it('getPlayerTournaments calls correct endpoint', async () => {
      await client.getPlayerTournaments('test');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/player/test/tournaments',
        expect.anything(),
      );
    });

    it('getLeaderboards calls correct endpoint', async () => {
      await client.getLeaderboards();
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/leaderboards',
        expect.anything(),
      );
    });

    it('getTitledPlayers calls correct endpoint', async () => {
      await client.getTitledPlayers('GM');
      expect(fetch).toHaveBeenCalledWith('https://api.chess.com/pub/titled/GM', expect.anything());
    });

    it('getClub calls correct endpoint', async () => {
      await client.getClub('chess-com-developer-community');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/club/chess-com-developer-community',
        expect.anything(),
      );
    });

    it('getClubMembers calls correct endpoint', async () => {
      await client.getClubMembers('my-club');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/club/my-club/members',
        expect.anything(),
      );
    });

    it('getDailyPuzzle calls correct endpoint', async () => {
      await client.getDailyPuzzle();
      expect(fetch).toHaveBeenCalledWith('https://api.chess.com/pub/puzzle', expect.anything());
    });

    it('getRandomPuzzle calls correct endpoint', async () => {
      await client.getRandomPuzzle();
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/puzzle/random',
        expect.anything(),
      );
    });

    it('encodes special characters in usernames', async () => {
      await client.getPlayerProfile('user name');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.chess.com/pub/player/user%20name',
        expect.anything(),
      );
    });
  });
});

describe('ChessApiError', () => {
  it('should have correct name and statusCode', () => {
    const error = new ChessApiError('test error', 404);
    expect(error.name).toBe('ChessApiError');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('test error');
    expect(error).toBeInstanceOf(Error);
  });
});
