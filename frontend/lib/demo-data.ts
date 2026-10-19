// ─── PlayScope Demo Data ───
// Realistic football match analytics data for demo/showcase mode

export interface Player {
  id: number;
  name: string;
  number: number;
  team: "home" | "away";
  position: string;
  positions: { x: number; y: number; minute: number }[];
}

export interface MatchEvent {
  id: string;
  type: "pass" | "shot" | "goal" | "foul" | "save" | "corner" | "freekick" | "offside" | "substitution" | "yellow_card" | "red_card";
  minute: number;
  second: number;
  team: "home" | "away";
  player: string;
  description: string;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
}

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  fouls: { home: number; away: number };
  corners: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  offsides: { home: number; away: number };
}

export interface PossessionOverTime {
  minute: number;
  home: number;
  away: number;
}

export interface PassData {
  minute: number;
  homePasses: number;
  awayPasses: number;
}

export interface TrackingFrame {
  frame: number;
  timestamp: number;
  players: {
    id: number;
    team: "home" | "away";
    x: number;
    y: number;
    vx: number;
    vy: number;
  }[];
  ball: { x: number; y: number };
}

export interface MatchData {
  matchInfo: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    venue: string;
    score: { home: number; away: number };
    competition: string;
  };
  stats: MatchStats;
  events: MatchEvent[];
  players: Player[];
  possessionOverTime: PossessionOverTime[];
  passData: PassData[];
  heatmapData: { x: number; y: number; intensity: number; team: "home" | "away" }[];
  trackingFrames: TrackingFrame[];
}

// ─── Generate heatmap points ───
function generateHeatmapData() {
  const points: { x: number; y: number; intensity: number; team: "home" | "away" }[] = [];
  
  // Home team — primarily left/center of pitch
  const homeHotspots = [
    { cx: 30, cy: 50, spread: 15, weight: 1.0 },
    { cx: 45, cy: 35, spread: 12, weight: 0.8 },
    { cx: 45, cy: 65, spread: 12, weight: 0.8 },
    { cx: 55, cy: 50, spread: 18, weight: 0.7 },
    { cx: 70, cy: 45, spread: 10, weight: 0.9 },
    { cx: 70, cy: 55, spread: 10, weight: 0.85 },
    { cx: 15, cy: 50, spread: 8, weight: 0.6 },
    { cx: 80, cy: 40, spread: 8, weight: 0.5 },
    { cx: 80, cy: 60, spread: 8, weight: 0.5 },
  ];

  for (const hs of homeHotspots) {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * hs.spread;
      points.push({
        x: hs.cx + r * Math.cos(angle),
        y: hs.cy + r * Math.sin(angle),
        intensity: Math.max(0.1, hs.weight * (1 - r / hs.spread) + Math.random() * 0.2),
        team: "home",
      });
    }
  }

  // Away team — primarily right/center of pitch
  const awayHotspots = [
    { cx: 70, cy: 50, spread: 15, weight: 1.0 },
    { cx: 55, cy: 35, spread: 12, weight: 0.8 },
    { cx: 55, cy: 65, spread: 12, weight: 0.8 },
    { cx: 45, cy: 50, spread: 18, weight: 0.65 },
    { cx: 30, cy: 45, spread: 10, weight: 0.7 },
    { cx: 30, cy: 55, spread: 10, weight: 0.7 },
    { cx: 85, cy: 50, spread: 8, weight: 0.6 },
    { cx: 20, cy: 40, spread: 8, weight: 0.4 },
    { cx: 20, cy: 60, spread: 8, weight: 0.4 },
  ];

  for (const hs of awayHotspots) {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * hs.spread;
      points.push({
        x: hs.cx + r * Math.cos(angle),
        y: hs.cy + r * Math.sin(angle),
        intensity: Math.max(0.1, hs.weight * (1 - r / hs.spread) + Math.random() * 0.2),
        team: "away",
      });
    }
  }

  return points;
}

// ─── Generate possession timeline ───
function generatePossessionTimeline(): PossessionOverTime[] {
  const data: PossessionOverTime[] = [];
  let homeBase = 58;
  for (let m = 0; m <= 90; m += 5) {
    const drift = (Math.random() - 0.5) * 10;
    homeBase = Math.max(35, Math.min(70, homeBase + drift));
    data.push({ minute: m, home: Math.round(homeBase), away: Math.round(100 - homeBase) });
  }
  return data;
}

// ─── Generate pass data ───
function generatePassData(): PassData[] {
  const data: PassData[] = [];
  for (let m = 0; m <= 90; m += 5) {
    data.push({
      minute: m,
      homePasses: Math.floor(20 + Math.random() * 25),
      awayPasses: Math.floor(15 + Math.random() * 22),
    });
  }
  return data;
}

// ─── Events ───
const events: MatchEvent[] = [
  { id: "e1", type: "pass", minute: 2, second: 14, team: "home", player: "M. Torres", description: "Short pass to M. Silva in midfield", x: 35, y: 45, targetX: 45, targetY: 50 },
  { id: "e2", type: "shot", minute: 5, second: 32, team: "home", player: "R. Santos", description: "Long-range shot from outside the box — saved", x: 72, y: 48, targetX: 95, targetY: 50 },
  { id: "e3", type: "corner", minute: 5, second: 48, team: "home", player: "L. Garcia", description: "Corner kick from the right", x: 95, y: 5 },
  { id: "e4", type: "foul", minute: 8, second: 11, team: "away", player: "K. Werner", description: "Foul on M. Torres — free kick awarded", x: 55, y: 38 },
  { id: "e5", type: "freekick", minute: 8, second: 45, team: "home", player: "L. Garcia", description: "Free kick into the box — headed away", x: 60, y: 38 },
  { id: "e6", type: "pass", minute: 12, second: 5, team: "away", player: "J. Müller", description: "Through ball to P. Rossi — intercepted", x: 45, y: 55, targetX: 30, targetY: 45 },
  { id: "e7", type: "shot", minute: 15, second: 22, team: "away", player: "P. Rossi", description: "Curling shot from the left — just wide", x: 25, y: 35, targetX: 5, targetY: 48 },
  { id: "e8", type: "yellow_card", minute: 18, second: 0, team: "home", player: "D. Rodriguez", description: "Yellow card for a late tackle", x: 42, y: 60 },
  { id: "e9", type: "pass", minute: 22, second: 30, team: "home", player: "M. Silva", description: "Key pass into the channel", x: 55, y: 30, targetX: 75, targetY: 25 },
  { id: "e10", type: "goal", minute: 24, second: 15, team: "home", player: "R. Santos", description: "⚽ GOAL! Clinical finish into the bottom corner", x: 88, y: 52, targetX: 98, targetY: 55 },
  { id: "e11", type: "shot", minute: 31, second: 8, team: "away", player: "A. Kane", description: "Header from the cross — saved brilliantly", x: 18, y: 48, targetX: 5, targetY: 50 },
  { id: "e12", type: "save", minute: 31, second: 9, team: "home", player: "GK Martinez", description: "Great save to deny Kane's header", x: 5, y: 50 },
  { id: "e13", type: "foul", minute: 35, second: 40, team: "home", player: "C. Mendes", description: "Foul in midfield — free kick to away team", x: 50, y: 55 },
  { id: "e14", type: "offside", minute: 38, second: 12, team: "away", player: "P. Rossi", description: "Offside flag raised — tight call", x: 22, y: 42 },
  { id: "e15", type: "corner", minute: 42, second: 5, team: "away", player: "J. Müller", description: "Corner from the left side", x: 5, y: 95 },
  { id: "e16", type: "shot", minute: 42, second: 18, team: "away", player: "K. Werner", description: "Volley from the edge of the box — over the bar", x: 22, y: 52, targetX: 5, targetY: 45 },
  { id: "e17", type: "goal", minute: 47, second: 33, team: "away", player: "A. Kane", description: "⚽ GOAL! Equalizer! Powerful header from corner", x: 12, y: 50, targetX: 2, targetY: 48 },
  { id: "e18", type: "substitution", minute: 55, second: 0, team: "home", player: "F. Neves", description: "Substitution: F. Neves replaces D. Rodriguez", x: 50, y: 0 },
  { id: "e19", type: "pass", minute: 58, second: 22, team: "home", player: "M. Torres", description: "Excellent through ball splitting the defense", x: 55, y: 50, targetX: 80, targetY: 42 },
  { id: "e20", type: "shot", minute: 58, second: 35, team: "home", player: "R. Santos", description: "One-on-one with keeper — shot saved", x: 85, y: 45, targetX: 98, targetY: 50 },
  { id: "e21", type: "save", minute: 58, second: 36, team: "away", player: "GK Neuer", description: "Incredible save to keep it level", x: 95, y: 50 },
  { id: "e22", type: "yellow_card", minute: 62, second: 0, team: "away", player: "L. Hernandez", description: "Yellow card for simulation", x: 25, y: 48 },
  { id: "e23", type: "foul", minute: 67, second: 15, team: "away", player: "K. Werner", description: "Tactical foul stopping a counter-attack", x: 60, y: 52 },
  { id: "e24", type: "goal", minute: 72, second: 45, team: "home", player: "L. Garcia", description: "⚽ GOAL! Stunning free kick into the top corner!", x: 75, y: 38, targetX: 98, targetY: 42 },
  { id: "e25", type: "shot", minute: 78, second: 10, team: "away", player: "P. Rossi", description: "Driven shot from distance — deflected wide", x: 32, y: 55, targetX: 5, targetY: 48 },
  { id: "e26", type: "corner", minute: 78, second: 30, team: "away", player: "J. Müller", description: "Corner from the right", x: 5, y: 5 },
  { id: "e27", type: "substitution", minute: 80, second: 0, team: "away", player: "T. Mbappe", description: "Substitution: T. Mbappe replaces K. Werner", x: 50, y: 100 },
  { id: "e28", type: "shot", minute: 84, second: 20, team: "away", player: "T. Mbappe", description: "Dribbles past two — shot blocked", x: 20, y: 48, targetX: 5, targetY: 50 },
  { id: "e29", type: "foul", minute: 87, second: 30, team: "home", player: "C. Mendes", description: "Professional foul near the box — free kick", x: 22, y: 45 },
  { id: "e30", type: "freekick", minute: 88, second: 0, team: "away", player: "J. Müller", description: "Free kick hits the wall", x: 22, y: 45, targetX: 5, targetY: 50 },
  { id: "e31", type: "shot", minute: 90, second: 12, team: "home", player: "F. Neves", description: "Counter-attack shot — wide", x: 82, y: 55, targetX: 98, targetY: 52 },
];

// ─── Players ───
const homePlayers: Player[] = [
  { id: 1, name: "GK Martinez", number: 1, team: "home", position: "GK", positions: [] },
  { id: 2, name: "A. Pereira", number: 2, team: "home", position: "RB", positions: [] },
  { id: 3, name: "C. Mendes", number: 4, team: "home", position: "CB", positions: [] },
  { id: 4, name: "J. Costa", number: 5, team: "home", position: "CB", positions: [] },
  { id: 5, name: "N. Alves", number: 3, team: "home", position: "LB", positions: [] },
  { id: 6, name: "D. Rodriguez", number: 6, team: "home", position: "CDM", positions: [] },
  { id: 7, name: "M. Torres", number: 8, team: "home", position: "CM", positions: [] },
  { id: 8, name: "M. Silva", number: 10, team: "home", position: "CAM", positions: [] },
  { id: 9, name: "L. Garcia", number: 7, team: "home", position: "RW", positions: [] },
  { id: 10, name: "R. Santos", number: 9, team: "home", position: "ST", positions: [] },
  { id: 11, name: "V. Lima", number: 11, team: "home", position: "LW", positions: [] },
];

const awayPlayers: Player[] = [
  { id: 12, name: "GK Neuer", number: 1, team: "away", position: "GK", positions: [] },
  { id: 13, name: "R. James", number: 2, team: "away", position: "RB", positions: [] },
  { id: 14, name: "L. Hernandez", number: 4, team: "away", position: "CB", positions: [] },
  { id: 15, name: "M. de Ligt", number: 5, team: "away", position: "CB", positions: [] },
  { id: 16, name: "B. Davies", number: 3, team: "away", position: "LB", positions: [] },
  { id: 17, name: "K. Werner", number: 6, team: "away", position: "CDM", positions: [] },
  { id: 18, name: "J. Müller", number: 8, team: "away", position: "CM", positions: [] },
  { id: 19, name: "T. Kroos", number: 10, team: "away", position: "CAM", positions: [] },
  { id: 20, name: "P. Rossi", number: 7, team: "away", position: "RW", positions: [] },
  { id: 21, name: "A. Kane", number: 9, team: "away", position: "ST", positions: [] },
  { id: 22, name: "S. Mane", number: 11, team: "away", position: "LW", positions: [] },
];

// ─── Generate tracking frames ───
function generateTrackingFrames(): TrackingFrame[] {
  const frames: TrackingFrame[] = [];
  // Generate at 1fps for 90 minutes = 5400 frames. We'll sample every 30s = 180 frames
  for (let f = 0; f < 180; f++) {
    const minute = (f / 180) * 90;
    const players: TrackingFrame["players"] = [];
    
    // Home team positions (attacking right)
    const homeFormation = [
      { baseX: 5, baseY: 50 },   // GK
      { baseX: 20, baseY: 15 },  // RB
      { baseX: 18, baseY: 38 },  // CB
      { baseX: 18, baseY: 62 },  // CB
      { baseX: 20, baseY: 85 },  // LB
      { baseX: 35, baseY: 50 },  // CDM
      { baseX: 45, baseY: 35 },  // CM
      { baseX: 52, baseY: 50 },  // CAM
      { baseX: 65, baseY: 18 },  // RW
      { baseX: 70, baseY: 50 },  // ST
      { baseX: 65, baseY: 82 },  // LW
    ];

    homeFormation.forEach((pos, i) => {
      const moveX = (Math.random() - 0.5) * 12;
      const moveY = (Math.random() - 0.5) * 10;
      players.push({
        id: i + 1,
        team: "home",
        x: Math.max(1, Math.min(99, pos.baseX + moveX + Math.sin(minute / 10) * 5)),
        y: Math.max(1, Math.min(99, pos.baseY + moveY + Math.cos(minute / 8) * 4)),
        vx: moveX * 0.3,
        vy: moveY * 0.3,
      });
    });

    // Away team positions (attacking left)
    const awayFormation = [
      { baseX: 95, baseY: 50 },
      { baseX: 80, baseY: 85 },
      { baseX: 82, baseY: 62 },
      { baseX: 82, baseY: 38 },
      { baseX: 80, baseY: 15 },
      { baseX: 65, baseY: 50 },
      { baseX: 55, baseY: 65 },
      { baseX: 48, baseY: 50 },
      { baseX: 35, baseY: 82 },
      { baseX: 30, baseY: 50 },
      { baseX: 35, baseY: 18 },
    ];

    awayFormation.forEach((pos, i) => {
      const moveX = (Math.random() - 0.5) * 12;
      const moveY = (Math.random() - 0.5) * 10;
      players.push({
        id: i + 12,
        team: "away",
        x: Math.max(1, Math.min(99, pos.baseX + moveX + Math.cos(minute / 10) * 5)),
        y: Math.max(1, Math.min(99, pos.baseY + moveY + Math.sin(minute / 8) * 4)),
        vx: moveX * 0.3,
        vy: moveY * 0.3,
      });
    });

    // Ball position — somewhere near a random player
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    frames.push({
      frame: f,
      timestamp: (f / 180) * 90 * 60,
      players,
      ball: {
        x: randomPlayer.x + (Math.random() - 0.5) * 4,
        y: randomPlayer.y + (Math.random() - 0.5) * 4,
      },
    });
  }
  return frames;
}

// ─── Final export ───
export const demoMatchData: MatchData = {
  matchInfo: {
    id: "match-2024-ucl-sf1",
    homeTeam: "FC Atlas",
    awayTeam: "Dynamo United",
    date: "2024-04-16",
    venue: "Grand Arena Stadium",
    score: { home: 2, away: 1 },
    competition: "Champions League — Semi Final",
  },
  stats: {
    possession: { home: 58, away: 42 },
    shots: { home: 14, away: 9 },
    shotsOnTarget: { home: 6, away: 3 },
    passes: { home: 487, away: 356 },
    passAccuracy: { home: 88, away: 82 },
    fouls: { home: 11, away: 14 },
    corners: { home: 6, away: 4 },
    yellowCards: { home: 1, away: 1 },
    redCards: { home: 0, away: 0 },
    offsides: { home: 2, away: 3 },
  },
  events,
  players: [...homePlayers, ...awayPlayers],
  possessionOverTime: generatePossessionTimeline(),
  passData: generatePassData(),
  heatmapData: generateHeatmapData(),
  trackingFrames: generateTrackingFrames(),
};
