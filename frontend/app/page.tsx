import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/[0.05] blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/5 bg-[var(--background)]/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white text-base font-bold">P</span>
            </div>
            <span className="font-[var(--font-heading)] font-bold text-xl gradient-text">
              PlayScope
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              Dashboard
            </Link>
            <Link
              href="/live"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </Link>
            <Link
              href="/upload"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              Upload
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              Powered by YOLOv8 + DeepSORT AI
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-[var(--font-heading)] leading-[1.08] tracking-tight mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Football Analytics
            <br />
            <span className="gradient-text">Reimagined</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Upload match footage. Our AI detects players, tracks movement, and generates
            comprehensive analytics — heatmaps, event timelines, and tactical insights.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/dashboard"
              className="btn-primary text-base px-8 py-3 shadow-xl shadow-indigo-500/20"
            >
              View Live Demo →
            </Link>
            <Link href="/upload" className="btn-secondary text-base px-8 py-3">
              Upload Video
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Image placeholder — we'll use a styled div */}
        <div
          className="mt-20 relative animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="glass-card p-2 overflow-hidden">
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0d0f1e] to-[#151833] border border-white/5">
              {/* Mock dashboard preview */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    {
                      label: "Possession",
                      value: "58%",
                      color: "from-indigo-500/20 to-purple-500/20",
                    },
                    {
                      label: "Total Shots",
                      value: "14",
                      color: "from-cyan-500/20 to-blue-500/20",
                    },
                    {
                      label: "Pass Accuracy",
                      value: "88%",
                      color: "from-emerald-500/20 to-teal-500/20",
                    },
                    {
                      label: "Events",
                      value: "31",
                      color: "from-amber-500/20 to-orange-500/20",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} border border-white/5`}
                    >
                      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                        {stat.label}
                      </div>
                      <div className="text-xl font-bold font-[var(--font-heading)] text-[var(--text-primary)]">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {/* Mini pitch */}
                  <div className="col-span-3 rounded-xl overflow-hidden border border-white/5">
                    <div className="h-48 pitch-bg relative">
                      {/* Pitch lines */}
                      <div className="absolute inset-4 border border-white/20 rounded">
                        <div className="absolute top-0 bottom-0 left-1/2 border-l border-white/20" />
                        <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 border border-white/20 rounded-full" />
                      </div>
                      {/* Sample player dots */}
                      {[
                        { x: 20, y: 50, team: "home" },
                        { x: 35, y: 30, team: "home" },
                        { x: 35, y: 70, team: "home" },
                        { x: 50, y: 50, team: "home" },
                        { x: 70, y: 40, team: "home" },
                        { x: 65, y: 55, team: "away" },
                        { x: 55, y: 60, team: "away" },
                        { x: 45, y: 45, team: "away" },
                        { x: 75, y: 50, team: "away" },
                        { x: 80, y: 35, team: "away" },
                      ].map((p, i) => (
                        <div
                          key={i}
                          className={`absolute w-2.5 h-2.5 rounded-full ${
                            p.team === "home" ? "bg-indigo-400" : "bg-red-400"
                          } shadow-lg`}
                          style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            boxShadow:
                              p.team === "home"
                                ? "0 0 8px rgba(99,102,241,0.5)"
                                : "0 0 8px rgba(239,68,68,0.5)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mini timeline */}
                  <div className="col-span-2 p-3 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                    {[
                      {
                        min: "24'",
                        icon: "⚽",
                        text: "GOAL — R. Santos",
                        highlight: true,
                      },
                      {
                        min: "47'",
                        icon: "⚽",
                        text: "GOAL — A. Kane",
                        highlight: true,
                      },
                      { min: "55'", icon: "🔄", text: "Sub — F. Neves", highlight: false },
                      {
                        min: "72'",
                        icon: "⚽",
                        text: "GOAL — L. Garcia",
                        highlight: true,
                      },
                    ].map((evt, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          evt.highlight
                            ? "bg-emerald-500/5 border border-emerald-500/10"
                            : "bg-white/[0.02]"
                        }`}
                      >
                        <span className="text-[10px] tabular-nums text-[var(--text-muted)] w-6">
                          {evt.min}
                        </span>
                        <span className="text-sm">{evt.icon}</span>
                        <span className="text-[11px] text-[var(--text-secondary)]">{evt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold font-[var(--font-heading)] mb-3">
            Everything You Need for{" "}
            <span className="gradient-text">Match Analysis</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
            From raw footage to actionable insights in minutes. Our AI pipeline
            handles the heavy lifting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {[
            {
              icon: "🔍",
              title: "Player Detection",
              desc: "YOLOv8 detects every player, referee, and ball in real-time with 95%+ accuracy across all frames.",
              gradient: "from-indigo-500/10 to-violet-500/10",
            },
            {
              icon: "📡",
              title: "Multi-Object Tracking",
              desc: "DeepSORT maintains unique player IDs throughout the match, handling occlusions and camera cuts.",
              gradient: "from-cyan-500/10 to-blue-500/10",
            },
            {
              icon: "🔥",
              title: "Heatmaps",
              desc: "Visualize player movement density with beautiful pitch overlays. Filter by team or individual players.",
              gradient: "from-orange-500/10 to-red-500/10",
            },
            {
              icon: "⏱️",
              title: "Event Timeline",
              desc: "Interactive timeline of every pass, shot, foul, and goal. Click to jump to the exact moment.",
              gradient: "from-emerald-500/10 to-teal-500/10",
            },
            {
              icon: "📊",
              title: "Match Statistics",
              desc: "Possession, shots, passes, fouls — all computed automatically from tracking data.",
              gradient: "from-purple-500/10 to-pink-500/10",
            },
            {
              icon: "🎥",
              title: "Tactical View",
              desc: "2D pitch visualization with animated player positions and ball movement throughout the match.",
              gradient: "from-amber-500/10 to-yellow-500/10",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`glass-card p-6 bg-gradient-to-br ${feature.gradient} group cursor-default`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold font-[var(--font-heading)] text-[var(--text-primary)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="glass-card p-8 text-center">
          <h3 className="text-lg font-semibold font-[var(--font-heading)] mb-6">
            Built with Modern Tech
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              "Next.js",
              "FastAPI",
              "YOLOv8",
              "DeepSORT",
              "PostgreSQL",
              "Tailwind CSS",
              "Docker",
              "OpenCV",
            ].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-[var(--text-secondary)] font-medium hover:border-[var(--primary)]/30 hover:text-[var(--text-primary)] transition-all cursor-default"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-3xl font-bold font-[var(--font-heading)] mb-4">
          Ready to Analyze?
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
          Experience AI-powered football analytics. View the live demo or upload
          your own match footage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="btn-primary text-base px-8 py-3 shadow-xl shadow-indigo-500/20"
          >
            View Live Demo →
          </Link>
          <Link href="/upload" className="btn-secondary text-base px-8 py-3">
            Upload Video
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">P</span>
            </div>
            <span className="text-sm font-medium text-[var(--text-muted)]">
              PlayScope
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            AI-Powered Football Video Analytics
          </p>
        </div>
      </footer>
    </div>
  );
}
