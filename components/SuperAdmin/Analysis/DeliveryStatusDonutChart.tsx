"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";

const data = [
    { name: "Delivered", value: 43, color: "#10B981" },
    { name: "Ongoing", value: 37, color: "#B37EFF" },
    { name: "Assigned", value: 22, color: "#3B82F6" },
    { name: "Pending", value: 6, color: "#F59E0B" },
];

export default function DeliveryStatusDonutChart() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] h-full flex flex-col">
            <h2 className="text-xl font-semibold text-foreground mb-6">
                Delivery Status Distribution
            </h2>

            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
                {/* Chart Container */}
                <div className="relative w-full lg:w-auto h-[280px] lg:h-[300px] flex items-center justify-center">
                    {isMounted ? (
                        <ResponsiveContainer width={300} height={300}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={120}
                                    paddingAngle={2}
                                    cornerRadius={4}
                                    startAngle={90}
                                    endAngle={-270}
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
                        <div className="w-[300px] h-[300px] bg-gray-50 rounded-full animate-pulse" />
                    )}
                </div>

                {/* Legend - Right side on large devices */}
                <div className="flex flex-col gap-3 lg:min-w-[150px]">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <div className="flex items-center justify-between gap-8 w-full">
                                <span className="text-sm font-medium text-secondary whitespace-nowrap">
                                    {item.name}
                                </span>
                                <span className="text-sm font-bold text-foreground">
                                    {item.value}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}