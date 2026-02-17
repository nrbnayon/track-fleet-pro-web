"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect, useMemo } from "react";
import { SellerZoneDistribution } from "@/types/analytics";

interface ParcelsByZoneChartProps {
    data: SellerZoneDistribution[];
}

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#6366F1"];

export default function ParcelsByZoneChart({ data: zoneDistribution }: ParcelsByZoneChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const chartData = useMemo(() => {
        return zoneDistribution.map((item, index) => ({
            name: item.delivery_location,
            value: item.count,
            percentage: item.percentage,
            color: COLORS[index % COLORS.length]
        }));
    }, [zoneDistribution]);

    if (!isMounted) return <div className="h-[400px] w-full bg-gray-50 rounded-2xl animate-pulse" />;

    return (
        <div className="bg-white p-8 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] h-full">
            <h2 className="text-xl font-bold text-foreground mb-8">
                Parcels by Zone
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="h-[280px] w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                paddingAngle={2}
                                cornerRadius={4}
                                dataKey="value"
                                stroke="none"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 grid grid-cols-1 gap-4">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-semibold text-gray-700 truncate" title={`${item.name}: ${item.percentage}%`}>
                                {item.name}: {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
