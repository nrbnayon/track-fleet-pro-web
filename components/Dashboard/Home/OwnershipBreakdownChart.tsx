/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";

const data = [
  { name: "Leased", value: 25, color: "#FF7782" },
  { name: "Owned", value: 75, color: "#799EFF" },
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, fill, payload, value } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 0) * cos;
  const sy = cy + (outerRadius + 0) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 120;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      {/* Line from slice to text */}
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />

      {/* Label Text (Category Name) - Above Line */}
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 8}
        y={ey}
        dy={-6} // Move up slightly
        textAnchor={textAnchor}
        fill="#6B7280" // text-secondary
        fontSize={13}
        fontWeight={500}
      >
        {payload.name}
      </text>

      {/* Value Text (Percentage) - Below Line */}
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 8}
        y={ey}
        dy={14} // Move down
        textAnchor={textAnchor}
        fill={fill} // Match slice color
        fontSize={14}
        fontWeight={600}
      >
        {value}%
      </text>
    </g>
  );
};

export function OwnershipBreakdownChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Ownership Breakdown
      </h2>

      <div className="relative h-[300px] w-full min-w-0">
        {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={115}
                paddingAngle={0}
                dataKey="value"
                startAngle={90} // 12 o'clock
                endAngle={-270} // Clockwise full circle
                strokeWidth={0}
                label={renderCustomizedLabel}
                labelLine={false} // We draw our own line in renderCustomizedLabel
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                </Pie>
                <Tooltip
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                    return (
                        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100">
                        <p className="text-sm font-semibold text-foreground">
                            {payload[0].name}
                        </p>
                        <p className="text-sm text-secondary">
                            {payload[0].value}%
                        </p>
                        </div>
                    );
                    }
                    return null;
                }}
                />
            </PieChart>
            </ResponsiveContainer>
        ) : (
            <div className="h-full w-full bg-gray-50 rounded-lg animate-pulse" />
        )}

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">100%</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 flex-wrap">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-secondary">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
