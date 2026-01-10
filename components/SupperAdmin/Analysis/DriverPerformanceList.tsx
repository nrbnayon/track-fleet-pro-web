
"use client";

import TranslatedText from "@/components/Shared/TranslatedText";

const drivers = [
    { name: "Michael Chen", deliveries: 89, rank: "01" },
    { name: "Sarah Johnson", deliveries: 76, rank: "02" },
    { name: "David Martinez", deliveries: 62, rank: "03" },
    { name: "Emily Rodriguez", deliveries: 71, rank: "04" },
];

export default function DriverPerformanceList() {
    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] h-full">
            <h2 className="text-lg font-bold text-foreground mb-6">
                <TranslatedText text="Driver Performance" />
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
                                <TranslatedText text="deliveries" />
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[15px]">
                            {driver.rank}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
