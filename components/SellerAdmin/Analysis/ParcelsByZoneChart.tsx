"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { Parcel } from "@/types/parcel";

interface ParcelsByZoneChartProps {
    parcels: Parcel[];
}

const data = [
    { name: "Manhattan", value: 32, color: "#3B82F6" },
    { name: "Brooklyn", value: 24, color: "#8B5CF6" },
    { name: "Queens", value: 20, color: "#10B981" },
    { name: "Bronx", value: 16, color: "#F59E0B" },
    { name: "Staten Island", value: 8, color: "#EF4444" },
];

export default function ParcelsByZoneChart({ parcels }: ParcelsByZoneChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                                data={data}
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
                                {data.map((entry, index) => (
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
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-semibold text-gray-700">{item.name}: {item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
