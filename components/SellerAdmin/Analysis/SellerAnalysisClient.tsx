"use client";

import { useGetSellerAnalyticsQuery } from "@/redux/services/analyticsApi";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Package, Truck, Loader2, DollarSign } from "lucide-react";
import StatusBarChart from "./StatusBarChart";
import ParcelsByZoneChart from "./ParcelsByZoneChart";
import StatusBreakdownTable from "./StatusBreakdownTable";

export default function SellerAnalysisClient() {
    const { data: analyticsResponse, isLoading, isError } = useGetSellerAnalyticsQuery();
    const stats = analyticsResponse?.data;

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <div className="text-center py-10 text-red-500">
                Failed to load analytics data. Please try again later.
            </div>
        );
    }

    const dashboardStats = [
        {
            title: "Total Revenue",
            value: `$${stats.total_revenue || 0}`,
            isUp: true,
            icon: DollarSign,
            iconColor: "#615FFF",
            iconBg: "#615FFF33",
        },
        {
            title: "Total Deliveries",
            value: (stats.total_deliveries || 0).toString(),
            isUp: true,
            icon: Package,
            iconColor: "#2BA24C",
            iconBg: "#2BA24C33",
        },
        {
            title: "Active Drivers",
            value: (stats.active_drivers || 0).toString(),
            isUp: true,
            icon: Truck,
            iconColor: "#F59E0B",
            iconBg: "#F59E0B33",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dashboardStats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                        iconBgColor={stat.iconBg}
                        isUp={stat.isUp}
                    />
                ))}
            </div>

            <div className="w-full mx-auto">
                <StatusBarChart data={stats.weekly_stats} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ParcelsByZoneChart data={stats.zone_distribution} />
                </div>
                <div className="lg:col-span-1">
                    <StatusBreakdownTable data={stats.status_breakdown} />
                </div>
            </div>
        </div>
    );
}
