/**
 * Live Football Data — Demo data for the Live Hub.
 * Provides realistic match data for global live matches.
 * When an API key is configured, this is replaced by real API-Football data.
 */

export interface LiveMatch {
  id: number;
  league: {
    id: number;
    name: string;
    country: string;
    flag: string;
    logo?: string;
  };
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    logo?: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    logo?: string;
  };
  score: {
    home: number;
    away: number;
    halftime: { home: number; away: number };
  };
  status: {
    short: "1H" | "HT" | "2H" | "FT" | "NS" | "LIVE" | "ET" | "PEN" | "PST" | "CANC";
    elapsed: number | null;
    long: string;
  };
  events: LiveMatchEvent[];
  stats: LiveMatchStats | null;
  venue: string;
  date: string;
  timestamp: number;
}

export interface LiveMatchEvent {
  time: { elapsed: number; extra: number | null };
  team: "home" | "away";
  player: string;
  assist: string | null;
  type: "Goal" | "Card" | "Subst" | "Var";
  detail: string;
  comments: string | null;
}

export interface LiveMatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  fouls: { home: number; away: number };
  corners: { home: number; away: number };
  offsides: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
}

export interface LeagueGroup {
  league: LiveMatch["league"];
  matches: LiveMatch[];
}

// ─── Demo Matches ───────────────────────────────────────────────────────────

const now = Date.now();

export const demoLiveMatches: LiveMatch[] = [
  // ── Premier League ──
  {
    id: 1001,
    league: { id: 39, name: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    homeTeam: { id: 1, name: "Arsenal", shortName: "ARS" },
    awayTeam: { id: 2, name: "Chelsea", shortName: "CHE" },
    score: { home: 2, away: 1, halftime: { home: 1, away: 0 } },
    status: { short: "2H", elapsed: 67, long: "Second Half" },
    events: [
      { time: { elapsed: 14, extra: null }, team: "home", player: "B. Saka", assist: "M. Ødegaard", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 52, extra: null }, team: "away", player: "C. Palmer", assist: "R. Sterling", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 58, extra: null }, team: "home", player: "K. Havertz", assist: "B. Saka", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 45, extra: null }, team: "away", player: "E. Fernández", assist: null, type: "Card", detail: "Yellow Card", comments: "Foul" },
    ],
    stats: {
      possession: { home: 58, away: 42 }, shots: { home: 14, away: 8 }, shotsOnTarget: { home: 6, away: 3 },
      passes: { home: 456, away: 312 }, passAccuracy: { home: 89, away: 83 }, fouls: { home: 9, away: 12 },
      corners: { home: 5, away: 3 }, offsides: { home: 2, away: 1 }, yellowCards: { home: 1, away: 2 }, redCards: { home: 0, away: 0 },
    },
    venue: "Emirates Stadium", date: new Date(now).toISOString(), timestamp: now,
  },
  {
    id: 1002,
    league: { id: 39, name: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    homeTeam: { id: 3, name: "Liverpool", shortName: "LIV" },
    awayTeam: { id: 4, name: "Manchester City", shortName: "MCI" },
    score: { home: 1, away: 1, halftime: { home: 0, away: 1 } },
    status: { short: "2H", elapsed: 72, long: "Second Half" },
    events: [
      { time: { elapsed: 23, extra: null }, team: "away", player: "E. Haaland", assist: "K. De Bruyne", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 55, extra: null }, team: "home", player: "M. Salah", assist: "T. Alexander-Arnold", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 62, extra: null }, team: "home", player: "V. van Dijk", assist: null, type: "Card", detail: "Yellow Card", comments: "Dangerous play" },
    ],
    stats: {
      possession: { home: 45, away: 55 }, shots: { home: 10, away: 13 }, shotsOnTarget: { home: 4, away: 5 },
      passes: { home: 367, away: 441 }, passAccuracy: { home: 85, away: 91 }, fouls: { home: 11, away: 8 },
      corners: { home: 4, away: 6 }, offsides: { home: 3, away: 2 }, yellowCards: { home: 2, away: 1 }, redCards: { home: 0, away: 0 },
    },
    venue: "Anfield", date: new Date(now).toISOString(), timestamp: now,
  },

  // ── La Liga ──
  {
    id: 2001,
    league: { id: 140, name: "La Liga", country: "Spain", flag: "🇪🇸" },
    homeTeam: { id: 10, name: "Real Madrid", shortName: "RMA" },
    awayTeam: { id: 11, name: "FC Barcelona", shortName: "FCB" },
    score: { home: 3, away: 2, halftime: { home: 1, away: 2 } },
    status: { short: "2H", elapsed: 81, long: "Second Half" },
    events: [
      { time: { elapsed: 12, extra: null }, team: "away", player: "R. Lewandowski", assist: "Pedri", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 28, extra: null }, team: "home", player: "V. Júnior", assist: "J. Bellingham", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 38, extra: null }, team: "away", player: "L. Yamal", assist: "R. Araújo", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 56, extra: null }, team: "home", player: "J. Bellingham", assist: "V. Júnior", type: "Goal", detail: "Header", comments: null },
      { time: { elapsed: 74, extra: null }, team: "home", player: "K. Mbappé", assist: "L. Modrić", type: "Goal", detail: "Normal Goal", comments: null },
    ],
    stats: {
      possession: { home: 52, away: 48 }, shots: { home: 18, away: 12 }, shotsOnTarget: { home: 8, away: 5 },
      passes: { home: 521, away: 489 }, passAccuracy: { home: 88, away: 90 }, fouls: { home: 14, away: 16 },
      corners: { home: 7, away: 4 }, offsides: { home: 3, away: 2 }, yellowCards: { home: 3, away: 2 }, redCards: { home: 0, away: 0 },
    },
    venue: "Santiago Bernabéu", date: new Date(now).toISOString(), timestamp: now,
  },
  {
    id: 2002,
    league: { id: 140, name: "La Liga", country: "Spain", flag: "🇪🇸" },
    homeTeam: { id: 12, name: "Atlético Madrid", shortName: "ATM" },
    awayTeam: { id: 13, name: "Real Sociedad", shortName: "RSO" },
    score: { home: 1, away: 0, halftime: { home: 1, away: 0 } },
    status: { short: "HT", elapsed: 45, long: "Half Time" },
    events: [
      { time: { elapsed: 31, extra: null }, team: "home", player: "A. Griezmann", assist: "J. Álvarez", type: "Goal", detail: "Normal Goal", comments: null },
    ],
    stats: {
      possession: { home: 54, away: 46 }, shots: { home: 7, away: 4 }, shotsOnTarget: { home: 3, away: 1 },
      passes: { home: 278, away: 234 }, passAccuracy: { home: 86, away: 82 }, fouls: { home: 7, away: 9 },
      corners: { home: 3, away: 2 }, offsides: { home: 1, away: 0 }, yellowCards: { home: 1, away: 1 }, redCards: { home: 0, away: 0 },
    },
    venue: "Cívitas Metropolitano", date: new Date(now).toISOString(), timestamp: now,
  },

  // ── Serie A ──
  {
    id: 3001,
    league: { id: 135, name: "Serie A", country: "Italy", flag: "🇮🇹" },
    homeTeam: { id: 20, name: "AC Milan", shortName: "MIL" },
    awayTeam: { id: 21, name: "Inter Milan", shortName: "INT" },
    score: { home: 0, away: 1, halftime: { home: 0, away: 0 } },
    status: { short: "2H", elapsed: 59, long: "Second Half" },
    events: [
      { time: { elapsed: 51, extra: null }, team: "away", player: "L. Martínez", assist: "H. Çalhanoğlu", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 34, extra: null }, team: "home", player: "T. Hernández", assist: null, type: "Card", detail: "Yellow Card", comments: "Time wasting" },
    ],
    stats: {
      possession: { home: 47, away: 53 }, shots: { home: 8, away: 11 }, shotsOnTarget: { home: 2, away: 4 },
      passes: { home: 298, away: 341 }, passAccuracy: { home: 82, away: 87 }, fouls: { home: 12, away: 10 },
      corners: { home: 3, away: 5 }, offsides: { home: 2, away: 1 }, yellowCards: { home: 2, away: 1 }, redCards: { home: 0, away: 0 },
    },
    venue: "San Siro", date: new Date(now).toISOString(), timestamp: now,
  },

  // ── Bundesliga ──
  {
    id: 4001,
    league: { id: 78, name: "Bundesliga", country: "Germany", flag: "🇩🇪" },
    homeTeam: { id: 30, name: "Bayern Munich", shortName: "BAY" },
    awayTeam: { id: 31, name: "Borussia Dortmund", shortName: "BVB" },
    score: { home: 2, away: 2, halftime: { home: 1, away: 1 } },
    status: { short: "2H", elapsed: 85, long: "Second Half" },
    events: [
      { time: { elapsed: 19, extra: null }, team: "home", player: "H. Kane", assist: "J. Musiala", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 37, extra: null }, team: "away", player: "J. Brandt", assist: "M. Sabitzer", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 63, extra: null }, team: "away", player: "D. Malen", assist: "J. Brandt", type: "Goal", detail: "Counter Attack", comments: null },
      { time: { elapsed: 71, extra: null }, team: "home", player: "J. Musiala", assist: "L. Sané", type: "Goal", detail: "Normal Goal", comments: null },
    ],
    stats: {
      possession: { home: 61, away: 39 }, shots: { home: 16, away: 9 }, shotsOnTarget: { home: 7, away: 4 },
      passes: { home: 512, away: 298 }, passAccuracy: { home: 90, away: 81 }, fouls: { home: 8, away: 13 },
      corners: { home: 8, away: 2 }, offsides: { home: 1, away: 3 }, yellowCards: { home: 1, away: 3 }, redCards: { home: 0, away: 0 },
    },
    venue: "Allianz Arena", date: new Date(now).toISOString(), timestamp: now,
  },

  // ── Ligue 1 ──
  {
    id: 5001,
    league: { id: 61, name: "Ligue 1", country: "France", flag: "🇫🇷" },
    homeTeam: { id: 40, name: "Paris Saint-Germain", shortName: "PSG" },
    awayTeam: { id: 41, name: "Olympique Marseille", shortName: "OM" },
    score: { home: 3, away: 0, halftime: { home: 2, away: 0 } },
    status: { short: "FT", elapsed: 90, long: "Match Finished" },
    events: [
      { time: { elapsed: 11, extra: null }, team: "home", player: "O. Dembélé", assist: "V. Zaïre-Emery", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 34, extra: null }, team: "home", player: "B. Barcola", assist: "O. Dembélé", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 78, extra: null }, team: "home", player: "R. Kolo Muani", assist: null, type: "Goal", detail: "Penalty", comments: null },
    ],
    stats: {
      possession: { home: 65, away: 35 }, shots: { home: 20, away: 5 }, shotsOnTarget: { home: 9, away: 2 },
      passes: { home: 612, away: 289 }, passAccuracy: { home: 92, away: 78 }, fouls: { home: 6, away: 18 },
      corners: { home: 9, away: 1 }, offsides: { home: 2, away: 4 }, yellowCards: { home: 0, away: 4 }, redCards: { home: 0, away: 1 },
    },
    venue: "Parc des Princes", date: new Date(now).toISOString(), timestamp: now,
  },

  // ── Champions League ──
  {
    id: 6001,
    league: { id: 2, name: "UEFA Champions League", country: "Europe", flag: "🇪🇺" },
    homeTeam: { id: 50, name: "Juventus", shortName: "JUV" },
    awayTeam: { id: 51, name: "Manchester United", shortName: "MUN" },
    score: { home: 1, away: 1, halftime: { home: 0, away: 0 } },
    status: { short: "2H", elapsed: 76, long: "Second Half" },
    events: [
      { time: { elapsed: 54, extra: null }, team: "home", player: "D. Vlahović", assist: "F. Chiesa", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 68, extra: null }, team: "away", player: "B. Fernandes", assist: "M. Rashford", type: "Goal", detail: "Free Kick", comments: null },
    ],
    stats: {
      possession: { home: 49, away: 51 }, shots: { home: 9, away: 12 }, shotsOnTarget: { home: 3, away: 5 },
      passes: { home: 378, away: 401 }, passAccuracy: { home: 84, away: 86 }, fouls: { home: 13, away: 11 },
      corners: { home: 4, away: 5 }, offsides: { home: 2, away: 3 }, yellowCards: { home: 2, away: 2 }, redCards: { home: 0, away: 0 },
    },
    venue: "Allianz Stadium", date: new Date(now).toISOString(), timestamp: now,
  },

  // ── Indian Super League ──
  {
    id: 7001,
    league: { id: 323, name: "Indian Super League", country: "India", flag: "🇮🇳" },
    homeTeam: { id: 60, name: "Mumbai City FC", shortName: "MCFC" },
    awayTeam: { id: 61, name: "Bengaluru FC", shortName: "BFC" },
    score: { home: 2, away: 1, halftime: { home: 1, away: 1 } },
    status: { short: "2H", elapsed: 64, long: "Second Half" },
    events: [
      { time: { elapsed: 22, extra: null }, team: "home", player: "L. Cassano", assist: "A. Jahouh", type: "Goal", detail: "Normal Goal", comments: null },
      { time: { elapsed: 39, extra: null }, team: "away", player: "S. Chhetri", assist: "R. Bheke", type: "Goal", detail: "Header", comments: null },
      { time: { elapsed: 56, extra: null }, team: "home", player: "B. Singh", assist: "L. Cassano", type: "Goal", detail: "Normal Goal", comments: null },
    ],
    stats: {
      possession: { home: 52, away: 48 }, shots: { home: 11, away: 7 }, shotsOnTarget: { home: 5, away: 3 },
      passes: { home: 312, away: 287 }, passAccuracy: { home: 80, away: 78 }, fouls: { home: 10, away: 12 },
      corners: { home: 4, away: 3 }, offsides: { home: 1, away: 2 }, yellowCards: { home: 2, away: 3 }, redCards: { home: 0, away: 0 },
    },
    venue: "Mumbai Football Arena", date: new Date(now).toISOString(), timestamp: now,
  },

  // ── Eredivisie (Not Started) ──
  {
    id: 8001,
    league: { id: 88, name: "Eredivisie", country: "Netherlands", flag: "🇳🇱" },
    homeTeam: { id: 70, name: "Ajax", shortName: "AJX" },
    awayTeam: { id: 71, name: "PSV Eindhoven", shortName: "PSV" },
    score: { home: 0, away: 0, halftime: { home: 0, away: 0 } },
    status: { short: "NS", elapsed: null, long: "Not Started" },
    events: [],
    stats: null,
    venue: "Johan Cruyff Arena", date: new Date(now + 3600000 * 2).toISOString(), timestamp: now + 3600000 * 2,
  },

  // ── Copa Libertadores ──
  {
    id: 9001,
    league: { id: 13, name: "Copa Libertadores", country: "South America", flag: "🌎" },
    homeTeam: { id: 80, name: "Flamengo", shortName: "FLA" },
    awayTeam: { id: 81, name: "River Plate", shortName: "RIV" },
    score: { home: 1, away: 0, halftime: { home: 0, away: 0 } },
    status: { short: "1H", elapsed: 38, long: "First Half" },
    events: [
      { time: { elapsed: 27, extra: null }, team: "home", player: "G. Barbosa", assist: "E. Ribeiro", type: "Goal", detail: "Normal Goal", comments: null },
    ],
    stats: {
      possession: { home: 56, away: 44 }, shots: { home: 6, away: 4 }, shotsOnTarget: { home: 2, away: 1 },
      passes: { home: 198, away: 156 }, passAccuracy: { home: 83, away: 79 }, fouls: { home: 5, away: 7 },
      corners: { home: 2, away: 1 }, offsides: { home: 0, away: 1 }, yellowCards: { home: 0, away: 1 }, redCards: { home: 0, away: 0 },
    },
    venue: "Maracanã", date: new Date(now).toISOString(), timestamp: now,
  },
];

/**
 * Group matches by league for display.
 */
export function groupMatchesByLeague(matches: LiveMatch[]): LeagueGroup[] {
  const grouped = new Map<number, LeagueGroup>();

  for (const match of matches) {
    const existing = grouped.get(match.league.id);
    if (existing) {
      existing.matches.push(match);
    } else {
      grouped.set(match.league.id, {
        league: match.league,
        matches: [match],
      });
    }
  }

  return Array.from(grouped.values());
}

/**
 * Get the status display label and color scheme
 */
export function getMatchStatusDisplay(status: LiveMatch["status"]): {
  label: string;
  color: string;
  bgColor: string;
  isLive: boolean;
} {
  switch (status.short) {
    case "1H":
    case "2H":
    case "ET":
    case "LIVE":
      return {
        label: `${status.elapsed}'`,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        isLive: true,
      };
    case "HT":
      return {
        label: "HT",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        isLive: true,
      };
    case "PEN":
      return {
        label: "PEN",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        isLive: true,
      };
    case "FT":
      return {
        label: "FT",
        color: "text-[var(--text-muted)]",
        bgColor: "bg-white/5",
        isLive: false,
      };
    case "NS":
      return {
        label: new Date(status.elapsed ?? 0).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        color: "text-[var(--text-secondary)]",
        bgColor: "bg-white/5",
        isLive: false,
      };
    default:
      return {
        label: status.short,
        color: "text-[var(--text-muted)]",
        bgColor: "bg-white/5",
        isLive: false,
      };
  }
}
