import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChessClient } from '../src/client/chess-client.js';
import { getPlayerGames, getGameDetails, getGameArchives } from '../src/tools/games.js';
import { mockGames, mockArchives } from './fixtures/index.js';
import type { ChessConfig } from '../src/config.js';

const config: ChessConfig = {
  baseUrl: 'https://api.chess.com',
  maxGames: 50,
  timeoutMs: 15000,
  userAgent: 'Test/0.1.0',
};

describe('Game Tools', () => {
  let client: ChessClient;

  beforeEach(() => {
    client = new ChessClient({ config });
    vi.restoreAllMocks();
  });

  describe('getPlayerGames', () => {
    it('should return formatted games list', async () => {
      vi.spyOn(client, 'getPlayerGames').mockResolvedValue(mockGames);

      const result = await getPlayerGames(
        client,
        { username: 'MagnusCarlsen', year: 2024, month: 1, limit: 10 },
        50,
      );

      expect(result).toContain('♟️ Recent Games: MagnusCarlsen');
      expect(result).toContain('2024/01');
      expect(result).toContain('opponent1');
      expect(result).toContain('Won');
      expect(result).toContain('3320');
      expect(result).toContain('Accuracy');
      expect(result).toContain('95.2');
    });

    it('should show correct emoji for different results', async () => {
      vi.spyOn(client, 'getPlayerGames').mockResolvedValue(mockGames);

      const result = await getPlayerGames(
        client,
        { username: 'MagnusCarlsen', year: 2024, month: 1, limit: 10 },
        50,
      );

      expect(result).toContain('✅'); // win
      expect(result).toContain('🤝'); // stalemate
    });

    it('should handle player as black', async () => {
      vi.spyOn(client, 'getPlayerGames').mockResolvedValue(mockGames);

      const result = await getPlayerGames(
        client,
        { username: 'MagnusCarlsen', year: 2024, month: 1, limit: 10 },
        50,
      );

      expect(result).toContain('black');
      expect(result).toContain('opponent2');
    });

    it('should return empty message when no games', async () => {
      vi.spyOn(client, 'getPlayerGames').mockResolvedValue({ games: [] });

      const result = await getPlayerGames(
        client,
        { username: 'newplayer', year: 2024, month: 1, limit: 10 },
        50,
      );

      expect(result).toContain('No games found');
    });

    it('should respect maxGames limit', async () => {
      vi.spyOn(client, 'getPlayerGames').mockResolvedValue(mockGames);

      const result = await getPlayerGames(
        client,
        { username: 'MagnusCarlsen', year: 2024, month: 1, limit: 1 },
        50,
      );

      expect(result).toContain('Showing 1 of 3');
    });

    it('should use current date when year/month not specified', async () => {
      vi.spyOn(client, 'getPlayerGames').mockResolvedValue(mockGames);

      const now = new Date();
      await getPlayerGames(client, { username: 'test' }, 50);

      expect(client.getPlayerGames).toHaveBeenCalledWith(
        'test',
        now.getFullYear(),
        now.getMonth() + 1,
      );
    });

    it('should limit by maxGames config', async () => {
      vi.spyOn(client, 'getPlayerGames').mockResolvedValue(mockGames);

      const result = await getPlayerGames(client, { username: 'test', limit: 100 }, 2);

      expect(result).toContain('Showing 2 of 3');
    });
  });

  describe('getGameDetails', () => {
    it('should parse game URL correctly', async () => {
      const result = await getGameDetails(client, {
        gameUrl: 'https://www.chess.com/game/live/12345',
      });

      expect(result).toContain('Game Details');
      expect(result).toContain('12345');
    });

    it('should handle daily game URLs', async () => {
      const result = await getGameDetails(client, {
        gameUrl: 'https://www.chess.com/game/daily/67890',
      });

      expect(result).toContain('67890');
    });

    it('should show error for invalid URL', async () => {
      const result = await getGameDetails(client, {
        gameUrl: 'https://www.chess.com/invalid/path',
      });

      expect(result).toContain('Could not parse game URL');
    });
  });

  describe('getGameArchives', () => {
    it('should list available archives', async () => {
      vi.spyOn(client, 'getPlayerGameArchives').mockResolvedValue(mockArchives);

      const result = await getGameArchives(client, { username: 'MagnusCarlsen' });

      expect(result).toContain('📁 Game Archives: MagnusCarlsen');
      expect(result).toContain('13');
      expect(result).toContain('2024-01');
      expect(result).toContain('2023-12');
    });

    it('should handle empty archives', async () => {
      vi.spyOn(client, 'getPlayerGameArchives').mockResolvedValue({ archives: [] });

      const result = await getGameArchives(client, { username: 'newplayer' });
      expect(result).toContain('No game archives found');
    });

    it('should show truncation message for many archives', async () => {
      const manyArchives = {
        archives: Array.from({ length: 30 }, (_, i) => {
          const year = 2020 + Math.floor(i / 12);
          const month = String((i % 12) + 1).padStart(2, '0');
          return `https://api.chess.com/pub/player/test/games/${year}/${month}`;
        }),
      };
      vi.spyOn(client, 'getPlayerGameArchives').mockResolvedValue(manyArchives);

      const result = await getGameArchives(client, { username: 'test' });
      expect(result).toContain('and 6 more months');
    });
  });
});
