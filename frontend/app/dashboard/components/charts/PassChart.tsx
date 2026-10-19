"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "@/components/ui/Card";
import type { PassData } from "@/lib/demo-data";

interface PassChartProps {
  data: PassData[];
  homeTeam: string;
  awayTeam: string;
}

export default function PassChart({ data, homeTeam, awayTeam }: PassChartProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📈</span>
        <h3 className="text-sm font-semibold font-[var(--font-heading)] text-[var(--text-primary)]">
          Passes Over Time
        </h3>
      </div>

      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="homeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="awayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="minute"
              tick={{ fill: "#7c8db5", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
              tickFormatter={(v) => `${v}'`}
            />
            <YAxis
              tick={{ fill: "#7c8db5", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
            />
            <Tooltip
              contentStyle={{
                background: "#1e2140",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#f0f2f8",
                fontSize: "12px",
              }}
              labelFormatter={(v) => `Minute ${v}'`}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="homePasses"
              name={homeTeam}
              stroke="#6366f1"
              fill="url(#homeGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#6366f1", stroke: "#fff", strokeWidth: 1 }}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="awayPasses"
              name={awayTeam}
              stroke="#ef4444"
              fill="url(#awayGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#ef4444", stroke: "#fff", strokeWidth: 1 }}
              animationDuration={1500}
              animationBegin={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
