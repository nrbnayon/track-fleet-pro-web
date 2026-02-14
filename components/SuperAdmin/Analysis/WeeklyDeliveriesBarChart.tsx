
"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import type { WeeklyDeliveries } from "@/types/analytics";

interface WeeklyDeliveriesBarChartProps {
    weeklyData: WeeklyDeliveries;
}

export default function WeeklyDeliveriesBarChart({ weeklyData }: WeeklyDeliveriesBarChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Transform API data to chart format
    const data = [
        { name: "Mon", value: weeklyData.Mon },
        { name: "Tue", value: weeklyData.Tue },
        { name: "Wed", value: weeklyData.Wed },
        { name: "Thu", value: weeklyData.Thu },
        { name: "Fri", value: weeklyData.Fri },
        { name: "Sat", value: weeklyData.Sat },
        { name: "Sun", value: weeklyData.Sun },
    ];

    if (!isMounted) return <div className="h-[350px] w-full bg-gray-50 rounded-2xl animate-pulse" />;

    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg font-bold text-foreground mb-8">
                Weekly Deliveries
            </h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748B", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748B", fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: "#F8FAFC" }}
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                            barSize={45}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
