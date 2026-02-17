"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useState, useEffect, useMemo } from "react";
import { SellerWeeklyStat } from "@/types/analytics";

interface StatusBarChartProps {
    data: SellerWeeklyStat[];
}

export default function StatusBarChart({ data }: StatusBarChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const chartData = useMemo(() => {
        return data.map(stat => ({
            name: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date(stat.day)),
            Pending: stat.pending_count,
            Ongoing: stat.ongoing_count,
            Delivered: stat.delivered_count,
        }));
    }, [data]);

    if (!isMounted) return <div className="h-[350px] w-full bg-gray-50 rounded-2xl animate-pulse" />;

    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg font-bold text-foreground mb-8">
                Weekly Deliveries
            </h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94A3B8", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94A3B8", fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: "#F1F5F9" }}
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                            dataKey="Pending"
                            fill="#F59E0B"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Bar
                            dataKey="Ongoing"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Bar
                            dataKey="Delivered"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
