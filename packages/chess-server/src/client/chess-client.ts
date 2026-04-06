import type { ChessConfig } from '../config.js';

export interface ChessClientOptions {
  config: ChessConfig;
}

export class ChessClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly userAgent: string;

  constructor(options: ChessClientOptions) {
    this.baseUrl = options.config.baseUrl.replace(/\/+$/, '');
    this.timeoutMs = options.config.timeoutMs;
    this.userAgent = options.config.userAgent;
  }

  async get<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ChessApiError(`Not found: ${path}`, 404);
        }
        if (response.status === 429) {
          throw new ChessApiError('Rate limited by Chess.com. Please wait and try again.', 429);
        }
        throw new ChessApiError(
          `Chess.com API error: ${response.status} ${response.statusText}`,
          response.status,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ChessApiError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ChessApiError(`Request timed out after ${this.timeoutMs}ms`, 408);
      }
      throw new ChessApiError(
        `Network error: ${error instanceof Error ? error.message : String(error)}`,
        0,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  // Player endpoints
  async getPlayerProfile(username: string) {
    return this.get<PlayerProfile>(`/pub/player/${encodeURIComponent(username.toLowerCase())}`);
  }

  async getPlayerStats(username: string) {
    return this.get<PlayerStats>(`/pub/player/${encodeURIComponent(username.toLowerCase())}/stats`);
  }

  async getPlayerGames(username: string, year: number, month: number) {
    const mm = String(month).padStart(2, '0');
    return this.get<PlayerGames>(
      `/pub/player/${encodeURIComponent(username.toLowerCase())}/games/${year}/${mm}`,
    );
  }

  async getPlayerGameArchives(username: string) {
    return this.get<GameArchives>(
      `/pub/player/${encodeURIComponent(username.toLowerCase())}/games/archives`,
    );
  }

  async getPlayerTournaments(username: string) {
    return this.get<PlayerTournaments>(
      `/pub/player/${encodeURIComponent(username.toLowerCase())}/tournaments`,
    );
  }

  // Leaderboards
  async getLeaderboards() {
    return this.get<Leaderboards>('/pub/leaderboards');
  }

  // Titled players
  async getTitledPlayers(title: string) {
    return this.get<TitledPlayers>(`/pub/titled/${encodeURIComponent(title)}`);
  }

  // Clubs
  async getClub(clubId: string) {
    return this.get<ClubInfo>(`/pub/club/${encodeURIComponent(clubId)}`);
  }

  async getClubMembers(clubId: string) {
    return this.get<ClubMembers>(`/pub/club/${encodeURIComponent(clubId)}/members`);
  }

  // Puzzles
  async getDailyPuzzle() {
    return this.get<DailyPuzzle>('/pub/puzzle');
  }

  async getRandomPuzzle() {
    return this.get<DailyPuzzle>('/pub/puzzle/random');
  }
}

export class ChessApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ChessApiError';
  }
}

// API response types
export interface PlayerProfile {
  '@id': string;
  url: string;
  username: string;
  player_id: number;
  title?: string;
  status: string;
  name?: string;
  avatar?: string;
  location?: string;
  country: string;
  joined: number;
  last_online: number;
  followers: number;
  is_streamer: boolean;
  verified: boolean;
}

export interface RatingCategory {
  last?: { rating: number; date: number; rd: number };
  best?: { rating: number; date: number; game?: string };
  record?: { win: number; loss: number; draw: number };
}

export interface PuzzleRating {
  last?: { rating: number; date: number; rd: number };
  best?: { rating: number; date: number };
}

export interface PlayerStats {
  chess_daily?: RatingCategory;
  chess_rapid?: RatingCategory;
  chess_blitz?: RatingCategory;
  chess_bullet?: RatingCategory;
  tactics?: PuzzleRating;
  puzzle_rush?: { best?: { score: number } };
  fide?: number;
}

export interface GameInfo {
  url: string;
  pgn?: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  accuracies?: { white: number; black: number };
  tcn?: string;
  uuid?: string;
  initial_setup?: string;
  fen?: string;
  time_class: string;
  rules: string;
  white: {
    rating: number;
    result: string;
    '@id': string;
    username: string;
    uuid?: string;
  };
  black: {
    rating: number;
    result: string;
    '@id': string;
    username: string;
    uuid?: string;
  };
}

export interface PlayerGames {
  games: GameInfo[];
}

export interface GameArchives {
  archives: string[];
}

export interface PlayerTournaments {
  finished: TournamentEntry[];
  in_progress: TournamentEntry[];
  registered: TournamentEntry[];
}

export interface TournamentEntry {
  url: string;
  '@id': string;
  wins: number;
  losses: number;
  draws: number;
  points_awarded?: number;
  placement?: number;
  status: string;
  total_players?: number;
}

export interface LeaderboardEntry {
  player_id: number;
  '@id': string;
  url: string;
  username: string;
  score: number;
  rank: number;
  title?: string;
  name?: string;
  status?: string;
  avatar?: string;
  trend_score?: { direction: number; delta: number };
  trend_rank?: { direction: number; delta: number };
  country?: string;
  flair_code?: string;
  win_count?: number;
  loss_count?: number;
  draw_count?: number;
}

export interface Leaderboards {
  daily: LeaderboardEntry[];
  daily960: LeaderboardEntry[];
  live_rapid: LeaderboardEntry[];
  live_blitz: LeaderboardEntry[];
  live_bullet: LeaderboardEntry[];
  live_bughouse: LeaderboardEntry[];
  live_blitz960: LeaderboardEntry[];
  live_threecheck: LeaderboardEntry[];
  live_crazyhouse: LeaderboardEntry[];
  live_kingofthehill: LeaderboardEntry[];
  tactics: LeaderboardEntry[];
  rush: LeaderboardEntry[];
  battle: LeaderboardEntry[];
}

export interface TitledPlayers {
  players: string[];
}

export interface ClubInfo {
  '@id': string;
  name: string;
  club_id: number;
  country?: string;
  average_daily_rating: number;
  members_count: number;
  created: number;
  last_activity: number;
  admin: string[];
  visibility: string;
  join_request: string;
  icon?: string;
  description?: string;
  url: string;
}

export interface ClubMember {
  username: string;
  joined: number;
}

export interface ClubMembers {
  weekly: ClubMember[];
  monthly: ClubMember[];
  all_time: ClubMember[];
}

export interface DailyPuzzle {
  title: string;
  url: string;
  publish_time: number;
  fen: string;
  pgn: string;
  image: string;
}
