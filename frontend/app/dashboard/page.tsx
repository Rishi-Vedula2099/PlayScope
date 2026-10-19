"use client";

import { useVideoData } from "@/hooks/useVideoData";
import { DashboardSkeleton } from "@/components/ui/Loader";
import StatsCards from "./components/stats/StatsCards";
import HeatmapView from "./components/heatmap/HeatmapView";
import EventTimeline from "./components/timeline/EventTimeline";
import VideoPlayer from "./components/video/VideoPlayer";
import PossessionChart from "./components/charts/PossessionChart";
import PassChart from "./components/charts/PassChart";
import Link from "next/link";
import { useState, useCallback } from "react";
import type { MatchEvent } from "@/lib/demo-data";

export default function DashboardPage() {
  const { data, loading } = useVideoData({ demoMode: true });
  const [, setCurrentMinute] = useState(0);

  const handleMinuteChange = useCallback((min: number) => {
    setCurrentMinute(min);
  }, []);

  const handleEventClick = useCallback((event: MatchEvent) => {
    // In a real implementation, this would seek the video
    console.log("Jump to event:", event.minute, event.description);
  }, []);

  if (loading || !data) return <DashboardSkeleton />;

  const { matchInfo, stats, events, heatmapData, trackingFrames, possessionOverTime, passData } = data;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Top Navigation */}
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
              className="text-sm font-medium text-[var(--text-primary)]"
            >
              Dashboard
            </Link>
            <Link
              href="/live"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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

      {/* Match Header */}
      <div className="border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
                <span>🏆</span>
                <span>{matchInfo.competition}</span>
                <span className="mx-1">•</span>
                <span>{matchInfo.venue}</span>
                <span className="mx-1">•</span>
                <span>{matchInfo.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {matchInfo.homeTeam.charAt(0)}
                    </span>
                  </div>
                  <span className="font-[var(--font-heading)] font-bold text-lg">
                    {matchInfo.homeTeam}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-bold font-[var(--font-heading)] text-[var(--team-a)]">
                    {matchInfo.score.home}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">-</span>
                  <span className="text-2xl font-bold font-[var(--font-heading)] text-[var(--team-b)]">
                    {matchInfo.score.away}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-[var(--font-heading)] font-bold text-lg">
                    {matchInfo.awayTeam}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {matchInfo.awayTeam.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Analysis Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Cards Row */}
        <section className="animate-fade-in">
          <StatsCards
            stats={stats}
            homeTeam={matchInfo.homeTeam}
            awayTeam={matchInfo.awayTeam}
          />
        </section>

        {/* Main Content: Video + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Video / Tactical View */}
          <section className="lg:col-span-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <VideoPlayer
              trackingFrames={trackingFrames}
              homeTeam={matchInfo.homeTeam}
              awayTeam={matchInfo.awayTeam}
              onMinuteChange={handleMinuteChange}
            />
          </section>

          {/* Event Timeline */}
          <section className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <EventTimeline
              events={events}
              homeTeam={matchInfo.homeTeam}
              awayTeam={matchInfo.awayTeam}
              onEventClick={handleEventClick}
            />
          </section>
        </div>

        {/* Heatmap + Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heatmap */}
          <section className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <HeatmapView
              data={heatmapData}
              homeTeam={matchInfo.homeTeam}
              awayTeam={matchInfo.awayTeam}
            />
          </section>

          {/* Possession Chart */}
          <section className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <PossessionChart
              home={stats.possession.home}
              away={stats.possession.away}
              homeTeam={matchInfo.homeTeam}
              awayTeam={matchInfo.awayTeam}
            />
          </section>
        </div>

        {/* Pass Chart Full Width */}
        <section className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <PassChart
            data={passData}
            homeTeam={matchInfo.homeTeam}
            awayTeam={matchInfo.awayTeam}
          />
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/5">
          <p className="text-xs text-[var(--text-muted)]">
            PlayScope Football Analytics • AI-Powered Match Analysis
          </p>
        </footer>
      </main>
    </div>
  );
}
