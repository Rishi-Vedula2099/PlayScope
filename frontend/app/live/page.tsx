"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  demoLiveMatches,
  groupMatchesByLeague,
  getMatchStatusDisplay,
  type LiveMatch,
  type LeagueGroup,
  type LiveMatchEvent,
} from "@/lib/live-data";

// ─── Match Card Component ────────────────────────────────────────────────────

function MatchCard({
  match,
  isExpanded,
  onToggle,
}: {
  match: LiveMatch;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusDisplay = getMatchStatusDisplay(match.status);

  return (
    <div
      className={`glass-card overflow-hidden transition-all duration-300 ${
        isExpanded ? "ring-1 ring-[var(--primary)]/30" : ""
      }`}
    >
      {/* Match Row */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
      >
        {/* Status Indicator */}
        <div className={`flex flex-col items-center min-w-[48px] ${statusDisplay.color}`}>
          {statusDisplay.isLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mb-1" />
          )}
          <span className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded ${statusDisplay.bgColor}`}>
            {statusDisplay.label}
          </span>
        </div>

        {/* Teams & Score */}
        <div className="flex-1 min-w-0">
          {/* Home Team */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0">
                <span className="text-white text-[8px] font-bold">
                  {match.homeTeam.shortName.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                {match.homeTeam.name}
              </span>
            </div>
            <span
              className={`text-sm font-bold tabular-nums ${
                match.score.home > match.score.away
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              {match.status.short === "NS" ? "-" : match.score.home}
            </span>
          </div>
          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0">
                <span className="text-white text-[8px] font-bold">
                  {match.awayTeam.shortName.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                {match.awayTeam.name}
              </span>
            </div>
            <span
              className={`text-sm font-bold tabular-nums ${
                match.score.away > match.score.home
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              {match.status.short === "NS" ? "-" : match.score.away}
            </span>
          </div>
        </div>

        {/* Expand Arrow */}
        <div className="text-[var(--text-muted)]">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded: Events + Stats */}
      {isExpanded && (
        <div className="border-t border-white/5 animate-fade-in">
          {/* Venue */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] text-[var(--text-muted)]">🏟️ {match.venue}</span>
          </div>

          {/* Events */}
          {match.events.length > 0 && (
            <div className="px-4 py-3 space-y-1.5">
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Key Events
              </div>
              {match.events.map((evt, i) => (
                <EventRow
                  key={i}
                  event={evt}
                  homeTeam={match.homeTeam.shortName}
                  awayTeam={match.awayTeam.shortName}
                />
              ))}
            </div>
          )}

          {/* Match Stats */}
          {match.stats && (
            <div className="px-4 py-3 border-t border-white/5">
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Match Stats
              </div>
              <div className="space-y-2.5">
                <StatBar
                  label="Possession"
                  home={match.stats.possession.home}
                  away={match.stats.possession.away}
                  format="pct"
                />
                <StatBar
                  label="Shots"
                  home={match.stats.shots.home}
                  away={match.stats.shots.away}
                />
                <StatBar
                  label="On Target"
                  home={match.stats.shotsOnTarget.home}
                  away={match.stats.shotsOnTarget.away}
                />
                <StatBar label="Pass %" home={match.stats.passAccuracy.home} away={match.stats.passAccuracy.away} format="pct" />
                <StatBar label="Corners" home={match.stats.corners.home} away={match.stats.corners.away} />
                <StatBar label="Fouls" home={match.stats.fouls.home} away={match.stats.fouls.away} />
              </div>
            </div>
          )}

          {/* Not Started — show kickoff time */}
          {match.status.short === "NS" && (
            <div className="px-4 py-4 text-center">
              <span className="text-sm text-[var(--text-secondary)]">
                Kick-off at{" "}
                <span className="font-semibold text-[var(--text-primary)]">
                  {new Date(match.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Event Row ───────────────────────────────────────────────────────────────

function EventRow({
  event,
  homeTeam,
  awayTeam,
}: {
  event: LiveMatchEvent;
  homeTeam: string;
  awayTeam: string;
}) {
  const iconMap: Record<string, string> = {
    Goal: "⚽",
    Card: event.detail.includes("Red") ? "🟥" : "🟨",
    Subst: "🔄",
    Var: "📺",
  };

  const isGoal = event.type === "Goal";

  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${
        isGoal ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-white/[0.02]"
      }`}
    >
      <span className="text-[10px] tabular-nums text-[var(--text-muted)] w-7 shrink-0">
        {event.time.elapsed}&apos;
      </span>
      <span className="text-sm shrink-0">{iconMap[event.type] || "•"}</span>
      <div className="flex-1 min-w-0">
        <span className="text-[11px] text-[var(--text-primary)] font-medium">{event.player}</span>
        {event.assist && (
          <span className="text-[10px] text-[var(--text-muted)]"> (ast. {event.assist})</span>
        )}
      </div>
      <span
        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
          event.team === "home"
            ? "bg-indigo-500/15 text-indigo-400"
            : "bg-red-500/15 text-red-400"
        }`}
      >
        {event.team === "home" ? homeTeam : awayTeam}
      </span>
    </div>
  );
}

// ─── Stat Bar ────────────────────────────────────────────────────────────────

function StatBar({
  label,
  home,
  away,
  format,
}: {
  label: string;
  home: number;
  away: number;
  format?: "pct";
}) {
  const total = home + away || 1;
  const homeWidth = (home / total) * 100;
  const suffix = format === "pct" ? "%" : "";

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] tabular-nums text-[var(--text-primary)] font-semibold w-8 text-right">
        {home}{suffix}
      </span>
      <div className="flex-1 flex h-1.5 rounded-full overflow-hidden bg-white/5">
        <div
          className="bg-indigo-500 rounded-l-full transition-all duration-700"
          style={{ width: `${homeWidth}%` }}
        />
        <div
          className="bg-red-500 rounded-r-full transition-all duration-700"
          style={{ width: `${100 - homeWidth}%` }}
        />
      </div>
      <span className="text-[11px] tabular-nums text-[var(--text-primary)] font-semibold w-8">
        {away}{suffix}
      </span>
      <span className="text-[10px] text-[var(--text-muted)] w-16 text-center">{label}</span>
    </div>
  );
}

// ─── Main Live Page ──────────────────────────────────────────────────────────

type FilterOption = "all" | "live" | "finished" | "upcoming";

export default function LiveHubPage() {
  const [matches, setMatches] = useState<LiveMatch[]>(demoLiveMatches);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulate real-time minute updates for live matches
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) =>
        prev.map((m) => {
          if (
            m.status.short === "1H" ||
            m.status.short === "2H" ||
            m.status.short === "ET"
          ) {
            const newElapsed = (m.status.elapsed ?? 0) + 1;

            // Transition 1H → HT at 45
            if (m.status.short === "1H" && newElapsed >= 45) {
              return {
                ...m,
                status: { ...m.status, short: "HT", elapsed: 45, long: "Half Time" },
              };
            }
            // Transition 2H → FT at 90
            if (m.status.short === "2H" && newElapsed >= 90) {
              return {
                ...m,
                status: { ...m.status, short: "FT", elapsed: 90, long: "Match Finished" },
              };
            }

            // Randomly update a stat slightly
            const updatedStats = m.stats
              ? {
                  ...m.stats,
                  passes: {
                    home: m.stats.passes.home + Math.floor(Math.random() * 3),
                    away: m.stats.passes.away + Math.floor(Math.random() * 3),
                  },
                }
              : null;

            return {
              ...m,
              stats: updatedStats,
              status: { ...m.status, elapsed: newElapsed },
            };
          }

          // Resume HT → 2H after brief pause
          if (m.status.short === "HT") {
            // Random chance to resume (about every 10s)
            if (Math.random() < 0.1) {
              return {
                ...m,
                status: { ...m.status, short: "2H", elapsed: 46, long: "Second Half" },
              };
            }
          }

          return m;
        })
      );
      setLastUpdated(new Date());
    }, 5000); // 5 second tick = ~1 minute of match time

    return () => clearInterval(interval);
  }, []);

  const toggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    if (filter === "live") return ["1H", "2H", "HT", "ET", "PEN", "LIVE"].includes(m.status.short);
    if (filter === "finished") return m.status.short === "FT";
    if (filter === "upcoming") return m.status.short === "NS";
    return true;
  });

  const leagueGroups = groupMatchesByLeague(filteredMatches);
  const liveCount = matches.filter((m) =>
    ["1H", "2H", "HT", "ET", "PEN", "LIVE"].includes(m.status.short)
  ).length;

  const filters: { value: FilterOption; label: string; count?: number }[] = [
    { value: "all", label: "All Matches", count: matches.length },
    { value: "live", label: "Live", count: liveCount },
    { value: "finished", label: "Finished" },
    { value: "upcoming", label: "Upcoming" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="font-[var(--font-heading)] font-bold text-lg gradient-text">
              PlayScope
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              Dashboard
            </Link>
            <Link
              href="/live"
              className="text-sm font-medium text-[var(--text-primary)]"
            >
              Live
            </Link>
            <Link
              href="/upload"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              Upload
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              U
            </div>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Title + Live Counter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)]">
              <span className="gradient-text">Live Match Hub</span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Real-time football scores from leagues around the world
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 tabular-nums">
                {liveCount} LIVE
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filter === f.value
                  ? "bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30"
                  : "bg-white/5 text-[var(--text-secondary)] border border-white/5 hover:bg-white/[0.08]"
              }`}
            >
              {f.value === "live" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              {f.label}
              {f.count !== undefined && (
                <span className="text-[10px] opacity-70">{f.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* League Groups */}
        {leagueGroups.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-3xl mb-3">⚽</div>
            <p className="text-[var(--text-secondary)] text-sm">
              No matches found for this filter.
            </p>
          </div>
        ) : (
          <div className="space-y-6 stagger-children">
            {leagueGroups.map((group) => (
              <div key={group.league.id}>
                {/* League Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{group.league.flag}</span>
                  <span className="text-sm font-semibold font-[var(--font-heading)] text-[var(--text-primary)]">
                    {group.league.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {group.league.country}
                  </span>
                  <div className="flex-1 border-b border-white/5 ml-2" />
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {group.matches.length} {group.matches.length === 1 ? "match" : "matches"}
                  </span>
                </div>

                {/* Match Cards */}
                <div className="space-y-2">
                  {group.matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      isExpanded={expandedId === match.id}
                      onToggle={() => toggleExpand(match.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Data Attribution */}
        <div className="mt-10 text-center space-y-2">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2">
            <span className="text-xs text-[var(--text-muted)]">
              📡 Demo data • Connect{" "}
              <span className="text-[var(--primary)] font-medium">API-Football</span> for
              real-time global coverage across 1,200+ leagues
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">
            Auto-refreshes every 5 seconds • Scores update in real-time
          </p>
        </div>
      </main>
    </div>
  );
}
