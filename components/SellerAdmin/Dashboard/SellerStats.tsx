"use client";

import { Package, Clock, Truck, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/Shared/StatsCard";
import { SellerDashboardCards } from "@/redux/services/dashboardApi";
import { useMemo } from "react";

interface SellerStatsProps {
    stats?: SellerDashboardCards;
}

export default function SellerStats({ stats }: SellerStatsProps) {

    const sellerStats = useMemo(() => {
        return [
            {
                title: "Parcels Created",
                value: stats?.parcels_created || 0,
                icon: Package,
                iconColor: "#1D92ED",
                iconBgColor: "#DFF0FF",
            },
            {
                title: "Pending Parcels",
                value: stats?.pending_parcels || 0,
                icon: Clock,
                iconColor: "#F0B100",
                iconBgColor: "#FFF6E5",
            },
            {
                title: "Ongoing",
                value: stats?.ongoing || 0,
                icon: Truck,
                iconColor: "#AD46FF",
                iconBgColor: "#F5EDFF",
            },
            {
                title: "Delivered Today",
                value: stats?.delivered_today || 0,
                icon: CheckCircle,
                iconColor: "#00C950",
                iconBgColor: "#E6F9EF",
            },
        ];
    }, [stats]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {sellerStats.map((stat, index) => (
                <StatsCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    iconColor={stat.iconColor}
                    iconBgColor={stat.iconBgColor}
                />
            ))}
        </div>
    );
}
