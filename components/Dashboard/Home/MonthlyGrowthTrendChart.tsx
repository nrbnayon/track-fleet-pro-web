/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Dashboard/Home/MonthlyGrowthTrendChart.tsx
"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";

const data = [
  { month: "02/2023", year2024: 2.15, year2023: 1.8 },
  { month: "03/2023", year2024: 2.30, year2023: 1.2 },
  { month: "04/2023", year2024: 2.85, year2023: 0.5 },
  { month: "05/2023", year2024: 2.90, year2023: 1.4 },
  { month: "06/2023", year2024: 2.65, year2023: 1.7 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-medium text-foreground">{payload[0].payload.month}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-secondary flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MonthlyGrowthTrendChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Monthly Growth Trend
      </h2>

      <div className="h-[300px] w-full min-w-0">
        {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <ComposedChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                dataKey="month"
                axisLine={true}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                stroke="#E5E7EB"
                dy={10}
                />
                <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                domain={[0, 3.5]} // Adjusted domain to fit data better visually
                ticks={[0, 0.75, 1.5, 2.25, 3]} // Matches the image standard ticks
                tickFormatter={(value) => {
                    if (value === 3) return "03";
                    return value.toString();
                }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => (
                    <span className="text-sm text-secondary ml-1">{value}</span>
                )}
                />
                <Bar
                dataKey="year2024"
                fill="#8BA3FF"
                radius={[0, 0, 0, 0]} 
                barSize={45}
                name="2024"
                className="opacity-90"
                />
                <Line
                type="monotone"
                dataKey="year2023"
                stroke="#6FD195"
                strokeWidth={2}
                dot={{
                    fill: "#6FD195",
                    r: 5,
                    strokeWidth: 1,
                    stroke: "#00000040" // White border on dots common in these designs
                }}
                activeDot={{
                    r: 6,
                    strokeWidth: 0,
                }}
                name="2023"
                />
            </ComposedChart>
            </ResponsiveContainer>
        ) : (
            <div className="h-full w-full bg-gray-50 rounded-lg animate-pulse" />
        )}
      </div>
    </div>
  );
}