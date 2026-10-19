"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Card from "@/components/ui/Card";

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  team: "home" | "away";
}

interface HeatmapViewProps {
  data: HeatmapPoint[];
  homeTeam: string;
  awayTeam: string;
}

export default function HeatmapView({ data, homeTeam, awayTeam }: HeatmapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "home" | "away">("all");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        // Maintain pitch aspect ratio (105:68 ≈ 1.544)
        setDimensions({ width, height: width / 1.544 });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const drawPitch = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Pitch background
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#1a472a");
      gradient.addColorStop(0.5, "#236b3a");
      gradient.addColorStop(1, "#1a472a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Pitch stripes
      const stripeCount = 12;
      for (let i = 0; i < stripeCount; i++) {
        if (i % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.02)";
          ctx.fillRect((w / stripeCount) * i, 0, w / stripeCount, h);
        }
      }

      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.5;

      const margin = 8;
      const pw = w - margin * 2;
      const ph = h - margin * 2;

      // Outer boundary
      ctx.strokeRect(margin, margin, pw, ph);

      // Center line
      ctx.beginPath();
      ctx.moveTo(w / 2, margin);
      ctx.lineTo(w / 2, h - margin);
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, ph * 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // Center dot
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Penalty areas
      const penW = pw * 0.16;
      const penH = ph * 0.44;
      // Left
      ctx.strokeRect(margin, h / 2 - penH / 2, penW, penH);
      // Right
      ctx.strokeRect(w - margin - penW, h / 2 - penH / 2, penW, penH);

      // Goal areas
      const goalW = pw * 0.055;
      const goalH = ph * 0.2;
      ctx.strokeRect(margin, h / 2 - goalH / 2, goalW, goalH);
      ctx.strokeRect(w - margin - goalW, h / 2 - goalH / 2, goalW, goalH);

      // Penalty dots
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(margin + pw * 0.115, h / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w - margin - pw * 0.115, h / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Corner arcs
      const cornerR = pw * 0.02;
      [
        [margin, margin, 0, Math.PI / 2],
        [w - margin, margin, Math.PI / 2, Math.PI],
        [margin, h - margin, -Math.PI / 2, 0],
        [w - margin, h - margin, Math.PI, Math.PI * 1.5],
      ].forEach(([cx, cy, startA, endA]) => {
        ctx.beginPath();
        ctx.arc(cx as number, cy as number, cornerR, startA as number, endA as number);
        ctx.stroke();
      });
    },
    []
  );

  const drawHeatmap = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const filteredData = data.filter(
        (p) => filter === "all" || p.team === filter
      );

      // Create offscreen canvas for heatmap
      const heatCanvas = document.createElement("canvas");
      heatCanvas.width = w;
      heatCanvas.height = h;
      const heatCtx = heatCanvas.getContext("2d")!;

      // Draw each point as radial gradient
      filteredData.forEach((point) => {
        const px = (point.x / 100) * w;
        const py = (point.y / 100) * h;
        const radius = Math.max(w, h) * 0.08;

        const gradient = heatCtx.createRadialGradient(px, py, 0, px, py, radius);
        gradient.addColorStop(0, `rgba(255, 0, 0, ${point.intensity * 0.4})`);
        gradient.addColorStop(0.4, `rgba(255, 128, 0, ${point.intensity * 0.2})`);
        gradient.addColorStop(1, "rgba(0, 0, 255, 0)");

        heatCtx.fillStyle = gradient;
        heatCtx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
      });

      // Colorize the heatmap
      const imageData = heatCtx.getImageData(0, 0, w, h);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const alpha = pixels[i + 3];
        if (alpha === 0) continue;

        const intensity = alpha / 255;

        let r: number, g: number, b: number;

        if (intensity < 0.2) {
          // Blue
          r = 30;
          g = 64;
          b = 175;
        } else if (intensity < 0.4) {
          // Cyan
          const t = (intensity - 0.2) / 0.2;
          r = 30 + t * (6 - 30);
          g = 64 + t * (182 - 64);
          b = 175 + t * (212 - 175);
        } else if (intensity < 0.6) {
          // Green
          const t = (intensity - 0.4) / 0.2;
          r = 6 + t * (16 - 6);
          g = 182 + t * (185 - 182);
          b = 212 + t * (129 - 212);
        } else if (intensity < 0.8) {
          // Yellow
          const t = (intensity - 0.6) / 0.2;
          r = 16 + t * (234 - 16);
          g = 185 + t * (179 - 185);
          b = 129 + t * (8 - 129);
        } else {
          // Red
          const t = (intensity - 0.8) / 0.2;
          r = 234 + t * (239 - 234);
          g = 179 + t * (68 - 179);
          b = 8 + t * (68 - 8);
        }

        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
        pixels[i + 3] = Math.min(255, alpha * 1.8);
      }

      heatCtx.putImageData(imageData, 0, 0);

      // Apply Gaussian blur
      ctx.filter = "blur(12px)";
      ctx.globalAlpha = 0.7;
      ctx.drawImage(heatCanvas, 0, 0);
      ctx.globalAlpha = 1;
      ctx.filter = "none";
    },
    [data, filter]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    drawPitch(ctx, dimensions.width, dimensions.height);
    drawHeatmap(ctx, dimensions.width, dimensions.height);
  }, [dimensions, drawPitch, drawHeatmap]);

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <h3 className="text-sm font-semibold font-[var(--font-heading)] text-[var(--text-primary)]">
              Player Heatmap
            </h3>
          </div>
          <div className="flex gap-1">
            {(["all", "home", "away"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  filter === f
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/20"
                    : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10"
                }`}
              >
                {f === "all" ? "Both" : f === "home" ? homeTeam : awayTeam}
              </button>
            ))}
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

      {/* Legend */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[var(--text-muted)]">Low</span>
          <div className="flex-1 heatmap-legend" />
          <span className="text-[10px] text-[var(--text-muted)]">High</span>
        </div>
      </div>
    </Card>
  );
}
