import type {
  PlayerProfile,
  PlayerStats,
  PlayerGames,
  GameArchives,
  PlayerTournaments,
  Leaderboards,
  TitledPlayers,
  ClubInfo,
  ClubMembers,
  DailyPuzzle,
} from '../src/client/chess-client.js';

export const mockProfile: PlayerProfile = {
  '@id': 'https://api.chess.com/pub/player/magnuscarlsen',
  url: 'https://www.chess.com/member/MagnusCarlsen',
  username: 'MagnusCarlsen',
  player_id: 12345,
  title: 'GM',
  status: 'premium',
  name: 'Magnus Carlsen',
  avatar: 'https://example.com/avatar.jpg',
  country: 'https://api.chess.com/pub/country/NO',
  joined: 1358121600,
  last_online: 1700000000,
  followers: 1234567,
  is_streamer: false,
  verified: true,
};

export const mockProfile2: PlayerProfile = {
  '@id': 'https://api.chess.com/pub/player/hikaru',
  url: 'https://www.chess.com/member/Hikaru',
  username: 'Hikaru',
  player_id: 67890,
  title: 'GM',
  status: 'premium',
  name: 'Hikaru Nakamura',
  country: 'https://api.chess.com/pub/country/US',
  joined: 1300000000,
  last_online: 1700000000,
  followers: 987654,
  is_streamer: true,
  verified: true,
};

export const mockStats: PlayerStats = {
  chess_rapid: {
    last: { rating: 2830, date: 1700000000, rd: 30 },
    best: { rating: 2862, date: 1690000000 },
    record: { win: 1245, loss: 89, draw: 156 },
  },
  chess_blitz: {
    last: { rating: 3320, date: 1700000000, rd: 25 },
    best: { rating: 3350, date: 1695000000 },
    record: { win: 8934, loss: 412, draw: 823 },
  },
  chess_bullet: {
    last: { rating: 3280, date: 1700000000, rd: 28 },
    best: { rating: 3312, date: 1698000000 },
    record: { win: 5621, loss: 302, draw: 445 },
  },
  chess_daily: {
    last: { rating: 2875, date: 1700000000, rd: 40 },
    best: { rating: 2900, date: 1685000000 },
    record: { win: 234, loss: 12, draw: 45 },
  },
  tactics: {
    last: { rating: 3150, date: 1700000000, rd: 20 },
    best: { rating: 3200, date: 1692000000 },
  },
  puzzle_rush: {
    best: { score: 42 },
  },
  fide: 2830,
};

export const mockStats2: PlayerStats = {
  chess_rapid: {
    last: { rating: 2820, date: 1700000000, rd: 32 },
    best: { rating: 2850, date: 1690000000 },
    record: { win: 1100, loss: 95, draw: 140 },
  },
  chess_blitz: {
    last: { rating: 3310, date: 1700000000, rd: 22 },
    best: { rating: 3340, date: 1694000000 },
    record: { win: 9500, loss: 500, draw: 900 },
  },
  chess_bullet: {
    last: { rating: 3290, date: 1700000000, rd: 26 },
    best: { rating: 3320, date: 1697000000 },
    record: { win: 6000, loss: 350, draw: 500 },
  },
  chess_daily: {
    last: { rating: 2800, date: 1700000000, rd: 45 },
    best: { rating: 2850, date: 1684000000 },
    record: { win: 200, loss: 15, draw: 38 },
  },
  tactics: {
    last: { rating: 3000, date: 1700000000, rd: 25 },
    best: { rating: 3100, date: 1691000000 },
  },
};

export const mockGames: PlayerGames = {
  games: [
    {
      url: 'https://www.chess.com/game/live/12345',
      pgn: `[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2024.01.15"]\n[White "MagnusCarlsen"]\n[Black "opponent1"]\n[Result "1-0"]\n[WhiteElo "3320"]\n[BlackElo "3100"]\n[TimeControl "180"]\n[ECO "B90"]\n[ECOUrl "https://www.chess.com/openings/Sicilian-Defense-Najdorf"]\n[Termination "MagnusCarlsen won by checkmate"]\n\n1. e4 c5 2. Nf3 d6 1-0`,
      time_control: '180',
      end_time: 1705334400,
      rated: true,
      accuracies: { white: 95.2, black: 88.1 },
      time_class: 'blitz',
      rules: 'chess',
      white: {
        rating: 3320,
        result: 'win',
        '@id': 'https://api.chess.com/pub/player/magnuscarlsen',
        username: 'MagnusCarlsen',
      },
      black: {
        rating: 3100,
        result: 'checkmated',
        '@id': 'https://api.chess.com/pub/player/opponent1',
        username: 'opponent1',
      },
    },
    {
      url: 'https://www.chess.com/game/live/12346',
      time_control: '60',
      end_time: 1705334500,
      rated: true,
      time_class: 'bullet',
      rules: 'chess',
      white: {
        rating: 3100,
        result: 'timeout',
        '@id': 'https://api.chess.com/pub/player/opponent2',
        username: 'opponent2',
      },
      black: {
        rating: 3280,
        result: 'win',
        '@id': 'https://api.chess.com/pub/player/magnuscarlsen',
        username: 'MagnusCarlsen',
      },
    },
    {
      url: 'https://www.chess.com/game/live/12347',
      time_control: '180',
      end_time: 1705334600,
      rated: true,
      time_class: 'blitz',
      rules: 'chess',
      white: {
        rating: 3320,
        result: 'stalemate',
        '@id': 'https://api.chess.com/pub/player/magnuscarlsen',
        username: 'MagnusCarlsen',
      },
      black: {
        rating: 3200,
        result: 'stalemate',
        '@id': 'https://api.chess.com/pub/player/opponent3',
        username: 'opponent3',
      },
    },
  ],
};

export const mockArchives: GameArchives = {
  archives: [
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/01',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/02',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/03',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/04',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/05',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/06',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/07',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/08',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/09',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/10',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/11',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2023/12',
    'https://api.chess.com/pub/player/magnuscarlsen/games/2024/01',
  ],
};

export const mockTournaments: PlayerTournaments = {
  finished: [
    {
      url: 'https://www.chess.com/tournament/speed-chess-2024',
      '@id': 'https://api.chess.com/pub/tournament/speed-chess-2024',
      wins: 8,
      losses: 2,
      draws: 1,
      points_awarded: 10,
      placement: 1,
      status: 'winner',
      total_players: 32,
    },
    {
      url: 'https://www.chess.com/tournament/titled-tuesday-2024',
      '@id': 'https://api.chess.com/pub/tournament/titled-tuesday-2024',
      wins: 6,
      losses: 1,
      draws: 2,
      placement: 3,
      status: 'eliminated',
      total_players: 64,
    },
  ],
  in_progress: [
    {
      url: 'https://www.chess.com/tournament/pro-chess-league',
      '@id': 'https://api.chess.com/pub/tournament/pro-chess-league',
      wins: 3,
      losses: 0,
      draws: 1,
      status: 'active',
    },
  ],
  registered: [],
};

export const mockLeaderboards: Leaderboards = {
  daily: [],
  daily960: [],
  live_rapid: [],
  live_blitz: [
    {
      player_id: 1,
      '@id': 'https://api.chess.com/pub/player/magnuscarlsen',
      url: 'https://www.chess.com/member/MagnusCarlsen',
      username: 'MagnusCarlsen',
      score: 3320,
      rank: 1,
      title: 'GM',
      name: 'Magnus Carlsen',
      win_count: 8934,
      loss_count: 412,
      draw_count: 823,
    },
    {
      player_id: 2,
      '@id': 'https://api.chess.com/pub/player/hikaru',
      url: 'https://www.chess.com/member/Hikaru',
      username: 'Hikaru',
      score: 3310,
      rank: 2,
      title: 'GM',
      name: 'Hikaru Nakamura',
      win_count: 9500,
      loss_count: 500,
      draw_count: 900,
    },
  ],
  live_bullet: [],
  live_bughouse: [],
  live_blitz960: [],
  live_threecheck: [],
  live_crazyhouse: [],
  live_kingofthehill: [],
  tactics: [
    {
      player_id: 10,
      '@id': 'https://api.chess.com/pub/player/puzzlemaster',
      url: 'https://www.chess.com/member/puzzlemaster',
      username: 'puzzlemaster',
      score: 3500,
      rank: 1,
    },
  ],
  rush: [],
  battle: [],
};

export const mockTitledPlayers: TitledPlayers = {
  players: ['MagnusCarlsen', 'Hikaru', 'FabianoCaruana', 'DingLiren', 'Firouzja2003'],
};

export const mockClub: ClubInfo = {
  '@id': 'https://api.chess.com/pub/club/chess-com-developer-community',
  name: 'Chess.com Developer Community',
  club_id: 999,
  average_daily_rating: 1500,
  members_count: 2500,
  created: 1400000000,
  last_activity: 1700000000,
  admin: ['admin1', 'admin2'],
  visibility: 'public',
  join_request: 'https://www.chess.com/club/chess-com-developer-community/join',
  description: 'A community for Chess.com API developers and enthusiasts.',
  url: 'https://www.chess.com/club/chess-com-developer-community',
};

export const mockClubMembers: ClubMembers = {
  weekly: [
    { username: 'active1', joined: 1690000000 },
    { username: 'active2', joined: 1695000000 },
  ],
  monthly: [{ username: 'monthly1', joined: 1680000000 }],
  all_time: [
    { username: 'veteran1', joined: 1400000000 },
    { username: 'veteran2', joined: 1450000000 },
  ],
};

export const mockPuzzle: DailyPuzzle = {
  title: 'Knight Fork Tactics',
  url: 'https://www.chess.com/puzzles/problem/12345',
  publish_time: 1700000000,
  fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
  pgn: '[Event "?"]\n[Result "1-0"]\n\n1. Qxf7# 1-0',
  image:
    'https://www.chess.com/dynboard?fen=r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR',
};
