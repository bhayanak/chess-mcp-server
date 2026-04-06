import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChessClient } from '../src/client/chess-client.js';
import { getPlayerProfile, getPlayerStats, comparePlayers } from '../src/tools/players.js';
import { mockProfile, mockProfile2, mockStats, mockStats2 } from './fixtures/index.js';
import type { ChessConfig } from '../src/config.js';

const config: ChessConfig = {
  baseUrl: 'https://api.chess.com',
  maxGames: 50,
  timeoutMs: 15000,
  userAgent: 'Test/0.1.0',
};

describe('Player Tools', () => {
  let client: ChessClient;

  beforeEach(() => {
    client = new ChessClient({ config });
    vi.restoreAllMocks();
  });

  describe('getPlayerProfile', () => {
    it('should format profile with all fields', async () => {
      vi.spyOn(client, 'getPlayerProfile').mockResolvedValue(mockProfile);

      const result = await getPlayerProfile(client, { username: 'MagnusCarlsen' });

      expect(result).toContain('♔ Player Profile: MagnusCarlsen');
      expect(result).toContain('Magnus Carlsen');
      expect(result).toContain('GM');
      expect(result).toContain('NO');
      expect(result).toContain('premium');
      expect(result).toContain('1,234,567');
      expect(result).toContain('https://www.chess.com/member/MagnusCarlsen');
    });

    it('should handle missing optional fields', async () => {
      vi.spyOn(client, 'getPlayerProfile').mockResolvedValue({
        ...mockProfile,
        name: undefined,
        title: undefined,
      });

      const result = await getPlayerProfile(client, { username: 'test' });
      expect(result).toContain('N/A');
      expect(result).toContain('None');
    });

    it('should show streamer status', async () => {
      vi.spyOn(client, 'getPlayerProfile').mockResolvedValue({
        ...mockProfile,
        is_streamer: true,
      });

      const result = await getPlayerProfile(client, { username: 'test' });
      expect(result).toContain('Streamer:    Yes');
    });
  });

  describe('getPlayerStats', () => {
    it('should format stats with all categories', async () => {
      vi.spyOn(client, 'getPlayerStats').mockResolvedValue(mockStats);

      const result = await getPlayerStats(client, { username: 'MagnusCarlsen' });

      expect(result).toContain('📊 Stats for MagnusCarlsen');
      expect(result).toContain('Rapid');
      expect(result).toContain('2830');
      expect(result).toContain('Blitz');
      expect(result).toContain('3320');
      expect(result).toContain('Bullet');
      expect(result).toContain('3280');
      expect(result).toContain('Daily');
      expect(result).toContain('2875');
      expect(result).toContain('Puzzles');
      expect(result).toContain('3150');
      expect(result).toContain('FIDE Rating: 2830');
      expect(result).toContain('Puzzle Rush Best: 42');
    });

    it('should handle empty stats', async () => {
      vi.spyOn(client, 'getPlayerStats').mockResolvedValue({});

      const result = await getPlayerStats(client, { username: 'newplayer' });
      expect(result).toContain('📊 Stats for newplayer');
      expect(result).toContain('Total Games: 0');
    });

    it('should handle stats without puzzle rush', async () => {
      vi.spyOn(client, 'getPlayerStats').mockResolvedValue({
        ...mockStats,
        puzzle_rush: undefined,
        fide: undefined,
      });

      const result = await getPlayerStats(client, { username: 'test' });
      expect(result).not.toContain('FIDE');
      expect(result).not.toContain('Puzzle Rush');
    });
  });

  describe('comparePlayers', () => {
    it('should compare two players side by side', async () => {
      vi.spyOn(client, 'getPlayerProfile')
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(mockProfile2);
      vi.spyOn(client, 'getPlayerStats')
        .mockResolvedValueOnce(mockStats)
        .mockResolvedValueOnce(mockStats2);

      const result = await comparePlayers(client, {
        player1: 'MagnusCarlsen',
        player2: 'Hikaru',
      });

      expect(result).toContain('⚔️ Player Comparison');
      expect(result).toContain('MagnusCarlsen');
      expect(result).toContain('Hikaru');
      expect(result).toContain('GM');
      expect(result).toContain('3320');
      expect(result).toContain('3310');
      expect(result).toContain('NO');
      expect(result).toContain('US');
    });

    it('should handle players without blitz records', async () => {
      vi.spyOn(client, 'getPlayerProfile')
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(mockProfile2);
      vi.spyOn(client, 'getPlayerStats')
        .mockResolvedValueOnce({ ...mockStats, chess_blitz: undefined })
        .mockResolvedValueOnce({ ...mockStats2, chess_blitz: undefined });

      const result = await comparePlayers(client, {
        player1: 'MagnusCarlsen',
        player2: 'Hikaru',
      });

      expect(result).toContain('—');
    });
  });
});
