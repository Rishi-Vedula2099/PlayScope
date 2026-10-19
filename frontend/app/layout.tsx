import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayScope — Football Video Analytics",
  description:
    "AI-powered football match analysis. Detect players, track movement, visualize heatmaps, and uncover game-changing insights from match footage.",
  keywords: ["football analytics", "video analysis", "heatmap", "player tracking", "AI sports"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] font-[var(--font-sans)]">
        {children}
      </body>
    </html>
  );
}
