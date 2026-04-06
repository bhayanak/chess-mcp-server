import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChessClient } from '../src/client/chess-client.js';
import { getPlayerTournaments } from '../src/tools/ratings.js';
import { getLeaderboards } from '../src/tools/leaderboards.js';
import { getTitledPlayers } from '../src/tools/titled.js';
import { getClubInfo, getClubMembers } from '../src/tools/clubs.js';
import {
  mockTournaments,
  mockLeaderboards,
  mockTitledPlayers,
  mockClub,
  mockClubMembers,
} from './fixtures/index.js';
import type { ChessConfig } from '../src/config.js';

const config: ChessConfig = {
  baseUrl: 'https://api.chess.com',
  maxGames: 50,
  timeoutMs: 15000,
  userAgent: 'Test/0.1.0',
};

describe('Tournament Tools', () => {
  let client: ChessClient;

  beforeEach(() => {
    client = new ChessClient({ config });
    vi.restoreAllMocks();
  });

  describe('getPlayerTournaments', () => {
    it('should format tournament history', async () => {
      vi.spyOn(client, 'getPlayerTournaments').mockResolvedValue(mockTournaments);

      const result = await getPlayerTournaments(client, { username: 'MagnusCarlsen' });

      expect(result).toContain('🏅 Tournaments: MagnusCarlsen');
      expect(result).toContain('Finished: 2');
      expect(result).toContain('In Progress: 1');
      expect(result).toContain('8/2/1');
      expect(result).toContain('1/32');
    });

    it('should handle empty tournament lists', async () => {
      vi.spyOn(client, 'getPlayerTournaments').mockResolvedValue({
        finished: [],
        in_progress: [],
        registered: [],
      });

      const result = await getPlayerTournaments(client, { username: 'test' });
      expect(result).toContain('Finished: 0');
    });

    it('should show in-progress tournaments', async () => {
      vi.spyOn(client, 'getPlayerTournaments').mockResolvedValue(mockTournaments);

      const result = await getPlayerTournaments(client, { username: 'test' });
      expect(result).toContain('In Progress');
      expect(result).toContain('pro-chess-league');
    });
  });
});

describe('Leaderboard Tools', () => {
  let client: ChessClient;

  beforeEach(() => {
    client = new ChessClient({ config });
    vi.restoreAllMocks();
  });

  describe('getLeaderboards', () => {
    it('should format blitz leaderboard', async () => {
      vi.spyOn(client, 'getLeaderboards').mockResolvedValue(mockLeaderboards);

      const result = await getLeaderboards(client, { category: 'blitz' });

      expect(result).toContain('🏆 Leaderboard: Blitz');
      expect(result).toContain('MagnusCarlsen');
      expect(result).toContain('Hikaru');
      expect(result).toContain('3320');
      expect(result).toContain('GM');
    });

    it('should handle tactics category', async () => {
      vi.spyOn(client, 'getLeaderboards').mockResolvedValue(mockLeaderboards);

      const result = await getLeaderboards(client, { category: 'tactics' });

      expect(result).toContain('Tactics');
      expect(result).toContain('puzzlemaster');
    });

    it('should handle empty leaderboard', async () => {
      vi.spyOn(client, 'getLeaderboards').mockResolvedValue(mockLeaderboards);

      const result = await getLeaderboards(client, { category: 'daily' });
      expect(result).toContain('No leaderboard data');
    });

    it('should default to blitz', async () => {
      vi.spyOn(client, 'getLeaderboards').mockResolvedValue(mockLeaderboards);

      const result = await getLeaderboards(client, { category: 'blitz' });
      expect(result).toContain('Blitz');
    });
  });
});

describe('Titled Player Tools', () => {
  let client: ChessClient;

  beforeEach(() => {
    client = new ChessClient({ config });
    vi.restoreAllMocks();
  });

  describe('getTitledPlayers', () => {
    it('should list titled players', async () => {
      vi.spyOn(client, 'getTitledPlayers').mockResolvedValue(mockTitledPlayers);

      const result = await getTitledPlayers(client, { title: 'GM' });

      expect(result).toContain('🎖️ Titled Players: GM');
      expect(result).toContain('Total: 5');
      expect(result).toContain('MagnusCarlsen');
      expect(result).toContain('Hikaru');
    });

    it('should handle many players with truncation', async () => {
      const manyPlayers = {
        players: Array.from({ length: 60 }, (_, i) => `player${i}`),
      };
      vi.spyOn(client, 'getTitledPlayers').mockResolvedValue(manyPlayers);

      const result = await getTitledPlayers(client, { title: 'GM' });

      expect(result).toContain('Total: 60');
      expect(result).toContain('and 10 more GM players');
    });
  });
});

describe('Club Tools', () => {
  let client: ChessClient;

  beforeEach(() => {
    client = new ChessClient({ config });
    vi.restoreAllMocks();
  });

  describe('getClubInfo', () => {
    it('should format club information', async () => {
      vi.spyOn(client, 'getClub').mockResolvedValue(mockClub);

      const result = await getClubInfo(client, { clubId: 'chess-com-developer-community' });

      expect(result).toContain('🏠 Club: Chess.com Developer Community');
      expect(result).toContain('2,500');
      expect(result).toContain('1500');
      expect(result).toContain('public');
      expect(result).toContain('community for Chess.com API');
    });

    it('should handle club without description', async () => {
      vi.spyOn(client, 'getClub').mockResolvedValue({ ...mockClub, description: undefined });

      const result = await getClubInfo(client, { clubId: 'test' });
      expect(result).not.toContain('Description');
    });
  });

  describe('getClubMembers', () => {
    it('should list members by activity level', async () => {
      vi.spyOn(client, 'getClubMembers').mockResolvedValue(mockClubMembers);

      const result = await getClubMembers(client, { clubId: 'test-club' });

      expect(result).toContain('👥 Club Members: test-club');
      expect(result).toContain('Weekly Active (2)');
      expect(result).toContain('Monthly Active (1)');
      expect(result).toContain('All Time (2)');
      expect(result).toContain('active1');
      expect(result).toContain('veteran1');
    });

    it('should truncate long member lists', async () => {
      const manyMembers = {
        weekly: Array.from({ length: 25 }, (_, i) => ({
          username: `user${i}`,
          joined: 1700000000,
        })),
        monthly: [],
        all_time: [],
      };
      vi.spyOn(client, 'getClubMembers').mockResolvedValue(manyMembers);

      const result = await getClubMembers(client, { clubId: 'big-club' });
      expect(result).toContain('and 5 more');
    });
  });
});
