"use client";

import { useSellerData } from "@/hooks/useSellerData";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Package, Truck, Loader2 } from "lucide-react";
import StatusBarChart from "./StatusBarChart";
import ParcelsByZoneChart from "./ParcelsByZoneChart";
import StatusBreakdownTable from "./StatusBreakdownTable";

export default function SellerAnalysisClient() {
    const { seller, parcels, stats, isLoading } = useSellerData();

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const dashboardStats = [
        {
            title: "Total Deliveries",
            value: (stats?.total_parcels || 331).toString(),
            isUp: true,
            icon: Package,
            iconColor: "#2BA24C",
            iconBg: "#2BA24C33",
        },
        {
            title: "Active Drivers",
            value: "12",
            isUp: true,
            icon: Truck,
            iconColor: "#615FFF",
            iconBg: "#615FFF33",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <StatusBarChart parcels={parcels} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ParcelsByZoneChart parcels={parcels} />
                </div>
                <div className="lg:col-span-1">
                    <StatusBreakdownTable parcels={parcels} />
                </div>
            </div>
        </div>
    );
}
