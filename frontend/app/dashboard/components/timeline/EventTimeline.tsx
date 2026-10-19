"use client";

import { useState, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import { getEventIcon, getEventColor, formatMinute } from "@/lib/utils";
import type { MatchEvent } from "@/lib/demo-data";

interface EventTimelineProps {
  events: MatchEvent[];
  homeTeam: string;
  awayTeam: string;
  onEventClick?: (event: MatchEvent) => void;
}

export default function EventTimeline({
  events,
  homeTeam,
  awayTeam,
  onEventClick,
}: EventTimelineProps) {
  const [selectedType, setSelectedType] = useState<string | "all">("all");
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const eventTypes = [
    { value: "all", label: "All", icon: "📋" },
    { value: "goal", label: "Goals", icon: "⚽" },
    { value: "shot", label: "Shots", icon: "🎯" },
    { value: "pass", label: "Key Passes", icon: "➡️" },
    { value: "foul", label: "Fouls", icon: "⚠️" },
    { value: "yellow_card", label: "Cards", icon: "🟨" },
  ];

  const filteredEvents =
    selectedType === "all"
      ? events
      : events.filter((e) => e.type === selectedType);

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => a.minute - b.minute || a.second - b.second
  );

  // Auto-scroll to latest event on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedType]);

  return (
    <Card padding="none" className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⏱️</span>
          <h3 className="text-sm font-semibold font-[var(--font-heading)] text-[var(--text-primary)]">
            Match Timeline
          </h3>
          <span className="ml-auto text-xs text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">
            {sortedEvents.length} events
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {eventTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center cursor-pointer gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                selectedType === type.value
                  ? "bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/20"
                  : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10"
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0"
        style={{ maxHeight: "400px" }}
      >
        {/* Minute markers background */}
        <div className="relative">
          {/* Half-time marker */}
          {sortedEvents.some(e => e.minute >= 45) && sortedEvents.some(e => e.minute <= 45) && (
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[var(--background)] px-3 text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                  Half Time
                </span>
              </div>
            </div>
          )}

          {sortedEvents.map((event, i) => {
            const isGoal = event.type === "goal";
            const isHovered = hoveredEvent === event.id;

            return (
              <div key={event.id}>
                {/* Half time divider */}
                {i > 0 &&
                  sortedEvents[i - 1].minute < 45 &&
                  event.minute >= 45 && (
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dashed border-white/10" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-[#0f0f23] px-3 text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                          Half Time
                        </span>
                      </div>
                    </div>
                  )}

                <button
                  onClick={() => onEventClick?.(event)}
                  onMouseEnter={() => setHoveredEvent(event.id)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  className={`w-full text-left cursor-pointer flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 group ${
                    isHovered
                      ? "bg-white/5 scale-[1.01]"
                      : "hover:bg-white/[0.03]"
                  } ${isGoal ? "ring-1 ring-emerald-500/20 bg-emerald-500/5" : ""}`}
                >
                  {/* Time badge */}
                  <div
                    className="flex-shrink-0 w-12 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold tabular-nums"
                    style={{
                      background: `${getEventColor(event.type)}15`,
                      color: getEventColor(event.type),
                    }}
                  >
                    {formatMinute(event.minute)}
                  </div>

                  {/* Event icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      isGoal ? "animate-float" : ""
                    }`}
                    style={{ background: `${getEventColor(event.type)}15` }}
                  >
                    {getEventIcon(event.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {event.player}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{
                          background:
                            event.team === "home"
                              ? "var(--team-a)"
                              : "var(--team-b)",
                          color: "white",
                          opacity: 0.8,
                        }}
                      >
                        {event.team === "home" ? homeTeam : awayTeam}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 truncate">
                      {event.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-center">
                    <svg
                      className="w-4 h-4 text-[var(--text-muted)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini timeline bar at bottom */}
      <div className="p-3 pt-2 border-t border-white/5">
        <div className="relative h-6 bg-white/[0.03] rounded-lg overflow-hidden">
          {/* Minute markers */}
          {[0, 15, 30, 45, 60, 75, 90].map((min) => (
            <div
              key={min}
              className="absolute top-0 h-full border-l border-white/5"
              style={{ left: `${(min / 90) * 100}%` }}
            >
              <span className="absolute -bottom-0.5 left-1 text-[8px] text-[var(--text-muted)]">
                {min}&apos;
              </span>
            </div>
          ))}

          {/* Event dots */}
          {events.map((event) => (
            <div
              key={event.id}
              className="absolute top-1 w-2 h-2 rounded-full transition-transform duration-200 hover:scale-150 cursor-pointer"
              style={{
                left: `${(event.minute / 90) * 100}%`,
                background: getEventColor(event.type),
                boxShadow:
                  event.type === "goal"
                    ? `0 0 6px ${getEventColor(event.type)}`
                    : "none",
              }}
              title={`${formatMinute(event.minute)} - ${event.player}: ${event.description}`}
              onClick={() => onEventClick?.(event)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
