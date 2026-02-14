
"use client";

import type { TopDriver } from "@/types/analytics";

interface DriverPerformanceListProps {
    drivers: TopDriver[];
}

export default function DriverPerformanceList({ drivers }: DriverPerformanceListProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] h-full">
            <h2 className="text-lg font-bold text-foreground mb-6">
                Driver Performance
            </h2>
            <div className="space-y-4">
                {drivers.map((driver, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] hover:shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)] hover:border hover:border-primary/20 hover:bg-primary/2 transition-all cursor-pointer group"
                    >
                        <div className="space-y-1">
                            <h3 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">
                                {driver.name}
                            </h3>
                            <p className="text-[13px] text-secondary">
                                {driver.deliveries}{" "}
                                deliveries
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base">
                            {driver.rank.toString().padStart(2, '0')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
