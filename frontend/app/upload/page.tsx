"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";

type UploadState = "idle" | "uploading" | "processing" | "complete" | "error";

export default function UploadPage() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((file: File) => {
    setFileName(file.name);
    setState("uploading");
    setProgress(0);

    // Simulate upload progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        setState("processing");
        // Simulate processing
        setTimeout(() => {
          setState("complete");
        }, 3000);
      }
      setProgress(Math.min(p, 100));
    }, 200);
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const validTypes = ["video/mp4", "video/mpeg", "video/avi", "video/quicktime", "video/webm"];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i)) {
        setError("Please upload a valid video file (MP4, AVI, MOV, MKV, WebM)");
        setState("error");
        return;
      }
      setError("");
      simulateUpload(file);
    },
    [simulateUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setFileName("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
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
              href="/upload"
              className="text-sm font-medium text-[var(--text-primary)]"
            >
              Upload
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold font-[var(--font-heading)] gradient-text mb-3">
            Upload Match Footage
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Upload a football match video to analyze with AI. Our engine will detect
            players, track movement, and generate comprehensive analytics.
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {state === "idle" || state === "error" ? (
            <Card
              padding="none"
              className={`transition-all duration-300 ${
                isDragging
                  ? "ring-2 ring-[var(--primary)] bg-indigo-500/5 scale-[1.01]"
                  : ""
              }`}
            >
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current?.click()}
                className="p-12 cursor-pointer text-center"
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleInputChange}
                />

                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[var(--primary)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {isDragging ? "Drop your video here" : "Drag & drop your video"}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  or click to browse files
                </p>
                <div className="flex items-center justify-center gap-3 text-xs text-[var(--text-muted)]">
                  <span className="px-2 py-1 rounded bg-white/5">MP4</span>
                  <span className="px-2 py-1 rounded bg-white/5">AVI</span>
                  <span className="px-2 py-1 rounded bg-white/5">MOV</span>
                  <span className="px-2 py-1 rounded bg-white/5">MKV</span>
                  <span className="px-2 py-1 rounded bg-white/5">WebM</span>
                </div>

                {error && (
                  <p className="mt-4 text-sm text-[var(--danger)]">{error}</p>
                )}
              </div>
            </Card>
          ) : state === "uploading" ? (
            <Card className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[var(--primary)] animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                Uploading...
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">{fileName}</p>

              <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-[var(--text-muted)] tabular-nums">
                {Math.round(progress)}%
              </p>
            </Card>
          ) : state === "processing" ? (
            <Card className="text-center py-12">
              <Loader size="lg" text="Analyzing your match footage..." />
              <p className="text-sm text-[var(--text-secondary)] mt-4">
                Detecting players, tracking movement, and extracting events...
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Detection", icon: "🔍", done: true },
                  { label: "Tracking", icon: "📡", done: false },
                  { label: "Analytics", icon: "📊", done: false },
                ].map((step, i) => (
                  <div
                    key={step.label}
                    className={`p-3 rounded-xl border ${
                      step.done
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-white/5 bg-white/[0.02] animate-pulse"
                    }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                    <div className="text-[10px] text-[var(--text-muted)] mt-1">
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Analysis Complete!
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Your match has been fully analyzed. View the results in the dashboard.
              </p>

              <div className="flex items-center justify-center gap-3">
                <Link href="/dashboard" className="btn-primary">
                  View Dashboard →
                </Link>
                <button onClick={reset} className="btn-secondary cursor-pointer">
                  Upload Another
                </button>
              </div>
            </Card>
          )}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mt-8 stagger-children">
          {[
            {
              icon: "🔍",
              title: "YOLOv8 Detection",
              desc: "Detects all players and ball in every frame",
            },
            {
              icon: "📡",
              title: "DeepSORT Tracking",
              desc: "Maintains player IDs throughout the match",
            },
            {
              icon: "📊",
              title: "Smart Analytics",
              desc: "Generates heatmaps, stats, and event timelines",
            },
          ].map((item) => (
            <Card key={item.title} className="text-center">
              <span className="text-2xl">{item.icon}</span>
              <h4 className="text-xs font-semibold text-[var(--text-primary)] mt-2 mb-1">
                {item.title}
              </h4>
              <p className="text-[10px] text-[var(--text-muted)]">{item.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
