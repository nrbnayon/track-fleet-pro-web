// components/Dashboard/Home/LandDistributionZoneChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";

const data = [
  { zone: "Zone E", totalParcels: 55.0 },
  { zone: "Zone C", totalParcels: 45.5 },
  { zone: "Zone A", totalParcels: 48.8 },
  { zone: "Zone B", totalParcels: 58.8 },
  { zone: "Zone D", totalParcels: 45.5 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-medium text-foreground">{payload[0].payload.zone}</p>
        <p className="text-sm text-secondary flex items-center gap-2">
           <span 
              className="w-2 h-2 rounded-sm" 
              style={{ backgroundColor: payload[0].color }}
            />
          <span>Total Parcels:</span>
          <span className="font-semibold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom tick to split text into two lines
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomizedAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const words = payload.value.split(" ");
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#6B7280" fontSize={12}>
        {words[0]}
      </text>
      <text x={0} y={0} dy={32} textAnchor="middle" fill="#6B7280" fontSize={12}>
        {words[1]}
      </text>
    </g>
  );
};

export function LandDistributionZoneChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Land Distribution by Zone
      </h2>

      <div className="h-[300px] w-full min-w-0">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="zone"
                axisLine={true}
                tickLine={false}
                tick={<CustomizedAxisTick />}
                interval={0}
                stroke="#E5E7EB"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                domain={[0, 60]}
                ticks={[0, 15, 30, 45, 60]}
                tickFormatter={(value) => {
                  if (value === 60) return "60";
                  if (value === 45) return "45";
                  if (value === 30) return "30";
                  if (value === 15) return "15";
                  return value.toString();
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="square"
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => (
                  <span className="text-sm text-secondary ml-1">{value}</span>
                )}
              />
              <Bar
                dataKey="totalParcels"
                fill="#3B82F6"
                // radius={[0, 0, 0, 0]} // Square corners based on image
                barSize={60}
                name="Total Parcels"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-gray-50 rounded-lg animate-pulse" />
        )}
      </div>
    </div>
  );
}