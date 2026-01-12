"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useState, useEffect } from "react";
import TranslatedText from "@/components/Shared/TranslatedText";

const data = [
    { name: "Jan", delivered: 65, ongoing: 78, pending: 70 },
    { name: "Feb", delivered: 85, ongoing: 92, pending: 78 },
    { name: "Mar", delivered: 78, ongoing: 82, pending: 62 },
    { name: "Apr", delivered: 98, ongoing: 105, pending: 85 },
    { name: "May", delivered: 108, ongoing: 115, pending: 92 },
    { name: "Jun", delivered: 102, ongoing: 108, pending: 88 },
    { name: "Jul", delivered: 118, ongoing: 125, pending: 105 },
    { name: "Aug", delivered: 122, ongoing: 130, pending: 112 },
    { name: "Sep", delivered: 112, ongoing: 118, pending: 98 },
    { name: "Oct", delivered: 135, ongoing: 142, pending: 118 },
    { name: "Nov", delivered: 118, ongoing: 125, pending: 105 },
    { name: "Dec", delivered: 105, ongoing: 112, pending: 92 },
];

export default function ParcelTrendChart() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[400px] w-full bg-gray-50 rounded-2xl animate-pulse" />;

    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-8">
                <TranslatedText text="Parcel Trend" />
            </h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E2E8F0" />
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
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            content={({ payload }) => (
                                <div className="flex justify-center gap-6 mt-6">
                                    {payload?.map((entry: any, index: number) => (
                                        <div key={`item-${index}`} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                            <span className="text-xs font-medium text-gray-500 capitalize">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                        <Line
                            type="monotone"
                            dataKey="delivered"
                            stroke="#00C950"
                            strokeWidth={2}
                            dot={{ fill: "#00C950", strokeWidth: 2, r: 4, stroke: "#fff" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="ongoing"
                            stroke="#1D92ED"
                            strokeWidth={2}
                            dot={{ fill: "#1D92ED", strokeWidth: 2, r: 4, stroke: "#fff" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="pending"
                            stroke="#F0B100"
                            strokeWidth={2}
                            dot={{ fill: "#F0B100", strokeWidth: 2, r: 4, stroke: "#fff" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
