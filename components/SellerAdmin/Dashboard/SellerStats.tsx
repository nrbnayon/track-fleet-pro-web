"use client";

import { Package, Clock, Truck, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/Shared/StatsCard";
import { useSellerData } from "@/hooks/useSellerData";
import { useMemo } from "react";

export default function SellerStats() {
    const { parcels } = useSellerData();

    const sellerStats = useMemo(() => {
        const totalCreated = parcels.length;
        const pending = parcels.filter((p) => p.parcel_status === "pending").length;
        const ongoing = parcels.filter((p) => p.parcel_status === "ongoing").length;
        const delivered = parcels.filter((p) => p.parcel_status === "delivered").length;

        return [
            {
                title: "Parcels Created",
                value: totalCreated,
                subtitle: "8.5% Up from last month",
                icon: Package,
                iconColor: "#1D92ED",
                iconBgColor: "#DFF0FF",
            },
            {
                title: "Pending Parcels",
                value: pending,
                subtitle: "8.5% Up from last month",
                icon: Clock,
                iconColor: "#F0B100",
                iconBgColor: "#FFF6E5",
            },
            {
                title: "Ongoing",
                value: ongoing,
                subtitle: "8.5% Up from last month",
                icon: Truck,
                iconColor: "#AD46FF",
                iconBgColor: "#F5EDFF",
            },
            {
                title: "Delivered Today",
                value: delivered,
                subtitle: "8.5% Up from yesterday",
                icon: CheckCircle,
                iconColor: "#00C950",
                iconBgColor: "#E6F9EF",
            },
        ];
    }, [parcels]);

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
                    subtitle={stat.subtitle}
                />
            ))}
        </div>
    );
}
