import { describe, it, expect } from 'vitest';
import {
  formatTimestamp,
  formatTimeAgo,
  formatNumber,
  formatWinRate,
  padRight,
  padLeft,
  countryCodeFromUrl,
  resultEmoji,
  gameResultText,
} from '../src/utils/formatter.js';
import { extractHeaders, extractMoves, formatPgnSummary } from '../src/utils/pgn.js';

describe('Formatter Utils', () => {
  describe('formatTimestamp', () => {
    it('should format epoch to date string', () => {
      expect(formatTimestamp(1700000000)).toBe('2023-11-14');
    });

    it('should return N/A for zero', () => {
      expect(formatTimestamp(0)).toBe('N/A');
    });
  });

  describe('formatTimeAgo', () => {
    it('should return N/A for zero', () => {
      expect(formatTimeAgo(0)).toBe('N/A');
    });

    it('should handle just now', () => {
      const now = Math.floor(Date.now() / 1000);
      expect(formatTimeAgo(now - 10)).toBe('just now');
    });

    it('should handle minutes ago', () => {
      const now = Math.floor(Date.now() / 1000);
      expect(formatTimeAgo(now - 300)).toBe('5 minutes ago');
    });

    it('should handle hours ago', () => {
      const now = Math.floor(Date.now() / 1000);
      expect(formatTimeAgo(now - 7200)).toBe('2 hours ago');
    });

    it('should handle days ago', () => {
      const now = Math.floor(Date.now() / 1000);
      expect(formatTimeAgo(now - 86400 * 5)).toBe('5 days ago');
    });

    it('should fall back to date for old timestamps', () => {
      expect(formatTimeAgo(1500000000)).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('formatNumber', () => {
    it('should format millions', () => {
      expect(formatNumber(1_500_000)).toBe('1.5M');
    });

    it('should format thousands', () => {
      const result = formatNumber(1_500);
      expect(result).toContain('K');
    });

    it('should return small numbers as-is', () => {
      expect(formatNumber(42)).toBe('42');
    });
  });

  describe('formatWinRate', () => {
    it('should calculate win rate', () => {
      expect(formatWinRate(80, 10, 10)).toBe('80.0%');
    });

    it('should return N/A for zero games', () => {
      expect(formatWinRate(0, 0, 0)).toBe('N/A');
    });
  });

  describe('padRight', () => {
    it('should pad string to target length', () => {
      expect(padRight('hi', 5)).toBe('hi   ');
    });

    it('should not truncate longer strings', () => {
      expect(padRight('hello world', 5)).toBe('hello world');
    });
  });

  describe('padLeft', () => {
    it('should pad string to target length', () => {
      expect(padLeft('42', 5)).toBe('   42');
    });

    it('should not truncate longer strings', () => {
      expect(padLeft('hello world', 5)).toBe('hello world');
    });
  });

  describe('countryCodeFromUrl', () => {
    it('should extract country code', () => {
      expect(countryCodeFromUrl('https://api.chess.com/pub/country/NO')).toBe('NO');
    });

    it('should return Unknown for invalid URL', () => {
      expect(countryCodeFromUrl('invalid')).toBe('Unknown');
    });
  });

  describe('resultEmoji', () => {
    it('should return ✅ for win', () => {
      expect(resultEmoji('win')).toBe('✅');
    });

    it('should return ❌ for losses', () => {
      expect(resultEmoji('checkmated')).toBe('❌');
      expect(resultEmoji('resigned')).toBe('❌');
      expect(resultEmoji('timeout')).toBe('❌');
      expect(resultEmoji('abandoned')).toBe('❌');
    });

    it('should return 🤝 for draws', () => {
      expect(resultEmoji('stalemate')).toBe('🤝');
      expect(resultEmoji('agreed')).toBe('🤝');
      expect(resultEmoji('repetition')).toBe('🤝');
      expect(resultEmoji('insufficient')).toBe('🤝');
      expect(resultEmoji('timevsinsufficient')).toBe('🤝');
      expect(resultEmoji('50move')).toBe('🤝');
    });

    it('should return ⬜ for unknown results', () => {
      expect(resultEmoji('unknown')).toBe('⬜');
    });
  });

  describe('gameResultText', () => {
    it('should map known results', () => {
      expect(gameResultText('win')).toBe('Won');
      expect(gameResultText('checkmated')).toBe('Checkmated');
      expect(gameResultText('resigned')).toBe('Resigned');
      expect(gameResultText('timeout')).toBe('Timeout');
      expect(gameResultText('stalemate')).toBe('Stalemate');
      expect(gameResultText('agreed')).toBe('Draw (agreed)');
    });

    it('should return raw value for unknown results', () => {
      expect(gameResultText('custom')).toBe('custom');
    });
  });
});

describe('PGN Utils', () => {
  const samplePgn = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.01.15"]
[White "MagnusCarlsen"]
[Black "opponent1"]
[Result "1-0"]
[WhiteElo "3320"]
[BlackElo "3100"]
[TimeControl "180"]
[ECO "B90"]
[ECOUrl "https://www.chess.com/openings/Sicilian-Defense-Najdorf"]
[Termination "MagnusCarlsen won by checkmate"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 1-0`;

  describe('extractHeaders', () => {
    it('should extract all PGN headers', () => {
      const headers = extractHeaders(samplePgn);
      expect(headers.Event).toBe('Live Chess');
      expect(headers.White).toBe('MagnusCarlsen');
      expect(headers.Black).toBe('opponent1');
      expect(headers.Result).toBe('1-0');
      expect(headers.WhiteElo).toBe('3320');
      expect(headers.ECO).toBe('B90');
    });

    it('should return empty object for no headers', () => {
      expect(extractHeaders('1. e4 e5')).toEqual({});
    });
  });

  describe('extractMoves', () => {
    it('should extract move text', () => {
      const moves = extractMoves(samplePgn);
      expect(moves).toContain('1. e4 c5');
      expect(moves).not.toContain('[Event');
    });

    it('should handle PGN with no moves', () => {
      expect(extractMoves('[Event "Test"]\n')).toBe('');
    });
  });

  describe('formatPgnSummary', () => {
    it('should format a complete PGN summary', () => {
      const summary = formatPgnSummary(samplePgn);
      expect(summary).toContain('Event: Live Chess');
      expect(summary).toContain('White: MagnusCarlsen (3320)');
      expect(summary).toContain('Black: opponent1 (3100)');
      expect(summary).toContain('Result: 1-0');
      expect(summary).toContain('Opening (ECO): B90');
      expect(summary).toContain('Sicilian Defense Najdorf');
      expect(summary).toContain('Termination');
    });

    it('should handle minimal PGN', () => {
      const minimal = '[Result "1/2-1/2"]';
      const summary = formatPgnSummary(minimal);
      expect(summary).toContain('Result: 1/2-1/2');
    });

    it('should handle PGN without ECOUrl', () => {
      const noEco = '[Event "Test"]\n[White "A"]\n[Black "B"]\n[Result "1-0"]';
      const summary = formatPgnSummary(noEco);
      expect(summary).toContain('Event: Test');
      expect(summary).not.toContain('Opening:');
    });
  });
});
