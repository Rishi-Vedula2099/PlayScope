"use client";

import { useEffect, useState, useRef } from "react";
import Card from "@/components/ui/Card";
import type { MatchStats } from "@/lib/demo-data";

interface StatsCardsProps {
  stats: MatchStats;
  homeTeam: string;
  awayTeam: string;
}

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function AnimatedNumber({ value, suffix = "", duration = 1200 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (value - start) * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

interface StatBarProps {
  home: number;
  away: number;
  label: string;
  icon: string;
}

function StatBar({ home, away, label, icon }: StatBarProps) {
  const total = home + away || 1;
  const homePercent = (home / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[var(--team-a)] tabular-nums">{home}</span>
        <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="font-semibold text-[var(--team-b)] tabular-nums">{away}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/5 gap-0.5">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${homePercent}%`,
            background: "linear-gradient(90deg, var(--team-a), #818cf8)",
          }}
        />
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${100 - homePercent}%`,
            background: "linear-gradient(90deg, #f87171, var(--team-b))",
          }}
        />
      </div>
    </div>
  );
}

export default function StatsCards({ stats, homeTeam, awayTeam }: StatsCardsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const topCards = [
    {
      label: "Possession",
      home: stats.possession.home,
      away: stats.possession.away,
      suffix: "%",
      icon: "🏈",
      gradient: "from-indigo-500/20 to-purple-500/20",
    },
    {
      label: "Total Shots",
      home: stats.shots.home,
      away: stats.shots.away,
      suffix: "",
      icon: "🎯",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      label: "Pass Accuracy",
      home: stats.passAccuracy.home,
      away: stats.passAccuracy.away,
      suffix: "%",
      icon: "✅",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      label: "Fouls",
      home: stats.fouls.home,
      away: stats.fouls.away,
      suffix: "",
      icon: "⚠️",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        {topCards.map((card) => (
          <Card key={card.label} className={`bg-gradient-to-br ${card.gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-base">{card.icon}</span>
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  {card.label}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold text-[var(--team-a)] font-[var(--font-heading)]">
                    {isVisible ? (
                      <AnimatedNumber value={card.home} suffix={card.suffix} />
                    ) : (
                      "0"
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{homeTeam}</div>
                </div>
                <div className="text-xs text-[var(--text-muted)] font-medium px-2">vs</div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--team-b)] font-[var(--font-heading)]">
                    {isVisible ? (
                      <AnimatedNumber value={card.away} suffix={card.suffix} />
                    ) : (
                      "0"
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{awayTeam}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed stat bars */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--team-a)]" />
            <span className="text-sm font-medium">{homeTeam}</span>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Match Stats</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{awayTeam}</span>
            <div className="w-3 h-3 rounded-full bg-[var(--team-b)]" />
          </div>
        </div>

        <StatBar home={stats.shots.home} away={stats.shots.away} label="Shots" icon="🎯" />
        <StatBar home={stats.shotsOnTarget.home} away={stats.shotsOnTarget.away} label="On Target" icon="🥅" />
        <StatBar home={stats.passes.home} away={stats.passes.away} label="Passes" icon="➡️" />
        <StatBar home={stats.passAccuracy.home} away={stats.passAccuracy.away} label="Pass %" icon="✅" />
        <StatBar home={stats.corners.home} away={stats.corners.away} label="Corners" icon="🚩" />
        <StatBar home={stats.fouls.home} away={stats.fouls.away} label="Fouls" icon="⚠️" />
        <StatBar home={stats.offsides.home} away={stats.offsides.away} label="Offsides" icon="🏁" />
        <StatBar home={stats.yellowCards.home} away={stats.yellowCards.away} label="Yellows" icon="🟨" />
      </Card>
    </div>
  );
}
