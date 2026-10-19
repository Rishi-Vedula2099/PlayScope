"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/ui/Card";

interface PossessionChartProps {
  home: number;
  away: number;
  homeTeam: string;
  awayTeam: string;
}

export default function PossessionChart({
  home,
  away,
  homeTeam,
  awayTeam,
}: PossessionChartProps) {
  const data = [
    { name: homeTeam, value: home, color: "#6366f1" },
    { name: awayTeam, value: away, color: "#ef4444" },
  ];

  return (
    <Card className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🏈</span>
        <h3 className="text-sm font-semibold font-[var(--font-heading)] text-[var(--text-primary)]">
          Ball Possession
        </h3>
      </div>

      <div className="relative" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              animationBegin={200}
              animationDuration={1200}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1e2140",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#f0f2f8",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value}%`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text font-[var(--font-heading)]">
              {home}%
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
              {homeTeam}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-xs text-[var(--text-secondary)]">
              {item.name}{" "}
              <span className="font-semibold text-[var(--text-primary)]">
                {item.value}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
