
"use client";

import { StatsCard } from "@/components/Shared/StatsCard";
import WeeklyDeliveriesBarChart from "./WeeklyDeliveriesBarChart";
import RevenueTrendLineChart from "./RevenueTrendLineChart";
import DeliveryStatusDonutChart from "./DeliveryStatusDonutChart";
import DriverPerformanceList from "./DriverPerformanceList";
import { DollarSign, Package, Truck } from "lucide-react";
import { useGetAnalyticsQuery } from "@/redux/services/analyticsApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalysisDashboardClient() {
    const { data: analyticsData, isLoading, error } = useGetAnalyticsQuery();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-[350px] rounded-2xl" />
                    <Skeleton className="h-[350px] rounded-2xl" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-[400px] rounded-2xl" />
                    <Skeleton className="h-[400px] rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error || !analyticsData?.data) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">Failed to load analytics data</p>
            </div>
        );
    }

    const { data } = analyticsData;

    const stats = [
        {
            title: "Total Deliveries",
            value: data.total_deliveries.toString(),
            icon: Package,
            iconColor: "#2BA24C",
            iconBg: "#2BA24C33",
        },
        {
            title: "Active Drivers",
            value: data.active_drivers.toString(),
            icon: Truck,
            iconColor: "#615FFF",
            iconBg: "#615FFF33",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="w-full mx-auto">
                <WeeklyDeliveriesBarChart weeklyData={data.weekly_deliveries} />
                {/* <RevenueTrendLineChart /> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-full">
                    <DeliveryStatusDonutChart statusData={data.status_breakdown} />
                </div>
                <div className="lg:col-span-1 h-full">
                    <DriverPerformanceList drivers={data.top_drivers} />
                </div>
            </div>
        </div>
    );
}
