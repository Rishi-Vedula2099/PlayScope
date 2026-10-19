"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Card from "@/components/ui/Card";
import type { TrackingFrame } from "@/lib/demo-data";

interface VideoPlayerProps {
  trackingFrames: TrackingFrame[];
  homeTeam: string;
  awayTeam: string;
  currentMinute?: number;
  onMinuteChange?: (minute: number) => void;
}

export default function VideoPlayer({
  trackingFrames,
  homeTeam,
  awayTeam,
  currentMinute = 0,
  onMinuteChange,
}: VideoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [speed, setSpeed] = useState(1);
  const lastFrameTime = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ width, height: width / 1.544 });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const drawPitch = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Background
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#15412a");
      grad.addColorStop(0.5, "#1e5e3a");
      grad.addColorStop(1, "#15412a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stripes
      for (let i = 0; i < 12; i++) {
        if (i % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.015)";
          ctx.fillRect((w / 12) * i, 0, w / 12, h);
        }
      }

      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1.5;

      const m = 12;
      const pw = w - m * 2;
      const ph = h - m * 2;

      ctx.strokeRect(m, m, pw, ph);
      ctx.beginPath();
      ctx.moveTo(w / 2, m);
      ctx.lineTo(w / 2, h - m);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, ph * 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // Penalty areas
      const penW = pw * 0.16;
      const penH = ph * 0.44;
      ctx.strokeRect(m, h / 2 - penH / 2, penW, penH);
      ctx.strokeRect(w - m - penW, h / 2 - penH / 2, penW, penH);

      // Goal areas
      const goalW = pw * 0.055;
      const goalH = ph * 0.2;
      ctx.strokeRect(m, h / 2 - goalH / 2, goalW, goalH);
      ctx.strokeRect(w - m - goalW, h / 2 - goalH / 2, goalW, goalH);
    },
    []
  );

  const drawFrame = useCallback(
    (frame: TrackingFrame) => {
      const canvas = canvasRef.current;
      if (!canvas || dimensions.width === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);

      const w = dimensions.width;
      const h = dimensions.height;

      drawPitch(ctx, w, h);

      // Draw player trails (subtle)
      frame.players.forEach((player) => {
        const px = (player.x / 100) * w;
        const py = (player.y / 100) * h;
        const isHome = player.team === "home";

        // Trail
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.fillStyle = isHome
          ? "rgba(99, 102, 241, 0.08)"
          : "rgba(239, 68, 68, 0.08)";
        ctx.fill();
      });

      // Draw players
      frame.players.forEach((player) => {
        const px = (player.x / 100) * w;
        const py = (player.y / 100) * h;
        const isHome = player.team === "home";

        // Outer glow
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 10);
        glow.addColorStop(
          0,
          isHome ? "rgba(99,102,241,0.3)" : "rgba(239,68,68,0.3)"
        );
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fill();

        // Player dot
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = isHome ? "#6366f1" : "#ef4444";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Player ID
        ctx.fillStyle = "white";
        ctx.font = "bold 7px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(player.id), px, py);
      });

      // Draw ball
      const bx = (frame.ball.x / 100) * w;
      const by = (frame.ball.y / 100) * h;

      // Ball glow
      const ballGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 16);
      ballGlow.addColorStop(0, "rgba(255,255,255,0.3)");
      ballGlow.addColorStop(1, "transparent");
      ctx.fillStyle = ballGlow;
      ctx.beginPath();
      ctx.arc(bx, by, 16, 0, Math.PI * 2);
      ctx.fill();

      // Ball
      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Time overlay
      const minute = Math.floor((frame.frame / trackingFrames.length) * 90);
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.roundRect(8, 8, 60, 24, 6);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`${minute}'`, 18, 20);
    },
    [dimensions, drawPitch, trackingFrames.length]
  );

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTime.current > 300 / speed) {
        lastFrameTime.current = timestamp;
        setFrameIndex((prev) => {
          const next = prev + 1;
          if (next >= trackingFrames.length) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, speed, trackingFrames.length]);

  // Draw current frame
  useEffect(() => {
    if (trackingFrames[frameIndex]) {
      drawFrame(trackingFrames[frameIndex]);
      const minute = Math.floor((frameIndex / trackingFrames.length) * 90);
      onMinuteChange?.(minute);
    }
  }, [frameIndex, drawFrame, trackingFrames, onMinuteChange]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value);
    setFrameIndex(idx);
  };

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎥</span>
          <h3 className="text-sm font-semibold font-[var(--font-heading)] text-[var(--text-primary)]">
            Tactical View
          </h3>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--team-a)]" />
              <span className="text-[10px] text-[var(--text-secondary)]">
                {homeTeam}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--team-b)]" />
              <span className="text-[10px] text-[var(--text-secondary)]">
                {awayTeam}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="p-3">
        <canvas
          ref={canvasRef}
          style={{
            width: dimensions.width || "100%",
            height: dimensions.height || "auto",
            borderRadius: "12px",
          }}
        />
      </div>

      {/* Controls */}
      <div className="px-4 pb-4 space-y-2">
        {/* Seek bar */}
        <input
          type="range"
          min="0"
          max={trackingFrames.length - 1}
          value={frameIndex}
          onChange={handleSeek}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--primary) ${
              (frameIndex / (trackingFrames.length - 1)) * 100
            }%, rgba(255,255,255,0.1) ${
              (frameIndex / (trackingFrames.length - 1)) * 100
            }%)`,
          }}
        />

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFrameIndex(0)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
              title="Reset"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 px-3 rounded-lg bg-[var(--primary)] hover:bg-indigo-400 transition text-white cursor-pointer"
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[var(--text-muted)] mr-1">Speed:</span>
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 text-[10px] rounded cursor-pointer transition ${
                  speed === s
                    ? "bg-[var(--primary)] text-white"
                    : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="text-xs text-[var(--text-muted)] tabular-nums">
            {Math.floor((frameIndex / trackingFrames.length) * 90)}&apos; / 90&apos;
          </span>
        </div>
      </div>
    </Card>
  );
}
