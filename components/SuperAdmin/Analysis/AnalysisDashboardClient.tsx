
"use client";

import { StatsCard } from "@/components/Shared/StatsCard";
import WeeklyDeliveriesBarChart from "./WeeklyDeliveriesBarChart";
import RevenueTrendLineChart from "./RevenueTrendLineChart";
import DeliveryStatusDonutChart from "./DeliveryStatusDonutChart";
import DriverPerformanceList from "./DriverPerformanceList";
import { DollarSign, Package, Truck } from "lucide-react";

export default function AnalysisDashboardClient() {
    const stats = [
        {
            title: "Total Revenue",
            value: "$12,450",
            icon: DollarSign,
            iconColor: "#AD46FF",
            iconBg: "#AD46FF33",
        },
        {
            title: "Total Deliveries",
            value: "331",
            icon: Package,
            iconColor: "#2BA24C",
            iconBg: "#2BA24C33",
        },
        {
            title: "Active Drivers",
            value: "12",
            icon: Truck,
            iconColor: "#615FFF",
            iconBg: "#615FFF33",
        },
    ];
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                        iconBgColor={stat.iconBg}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyDeliveriesBarChart />
                <RevenueTrendLineChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-full">
                    <DeliveryStatusDonutChart />
                </div>
                <div className="lg:col-span-1 h-full">
                    <DriverPerformanceList />
                </div>
            </div>
        </div>
    );
}
