
"use client";

import { TrendingUp, DollarSign, Package, Users } from "lucide-react";
import TranslatedText from "@/components/Shared/TranslatedText";

const stats = [
    {
        title: "Total Revenue",
        value: "$12,450",
        change: "8.5%",
        isUp: true,
        icon: DollarSign,
        iconColor: "text-[#AD46FF]",
        iconBg: "bg-[#AD46FF33]",
    },
    {
        title: "Total Deliveries",
        value: "331",
        change: "8.5%",
        isUp: true,
        icon: Package,
        iconColor: "text-[#2BA24C]",
        iconBg: "bg-[#2BA24C33]",
    },
    {
        title: "Active Drivers",
        value: "12",
        change: "8.5%",
        isUp: true,
        icon: Users,
        iconColor: "text-[#615FFF]",
        iconBg: "bg-[#615FFF33]",
    },
];

export default function AnalysisStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white p-6 rounded-2xl border border-[#F1F1F1] shadow-sm flex items-start justify-between"
                >
                    <div className="space-y-4">
                        <h3 className="text-[15px] font-medium text-[#64748B]">
                            <TranslatedText text={stat.title} />
                        </h3>
                        <div className="space-y-1">
                            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#615FFF]">
                                <TrendingUp className="w-4 h-4" />
                                <span>{stat.change}</span>
                                <span className="text-[#64748B] font-normal">
                                    <TranslatedText text="Up from last month" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={`${stat.iconBg} ${stat.iconColor} p-3.5 rounded-2xl`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                </div>
            ))}
        </div>
    );
}
