"use client";

import Image from "next/image";
import Link from "next/link";
import { allDriversData } from "@/data/allDriversData";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function ActiveDrivers() {
    const activeDrivers = useMemo(() => {
        return allDriversData
            .filter((driver) => driver.isActive)
            .sort((a, b) => {
                // Prioritize "busy" (on delivery) then "available", then "offline"
                const statusPriority = { busy: 0, available: 1, offline: 2 };
                const statusA = (a.driver_status || 'offline') as keyof typeof statusPriority;
                const statusB = (b.driver_status || 'offline') as keyof typeof statusPriority;

                return (statusPriority[statusA] ?? 2) - (statusPriority[statusB] ?? 2);
            })
            .slice(0, 5);
    }, []);

    const getStatusColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "available":
                return "bg-emerald-100 text-emerald-600"; // Green
            case "busy":
                return "bg-purple-100 text-purple-600"; // Light purple/pinkish
            case "offline":
                return "bg-gray-100 text-secondary";
            default:
                return "bg-gray-100 text-secondary";
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Active Drivers</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
                {activeDrivers.map((driver) => (
                    <div
                        key={driver.id}
                        className="flex items-center p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-colors shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]"
                    >
                        {/* Avatar */}
                        <div className="relative h-10 w-10 mr-4 shrink-0">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                    src={driver.driver_image?.startsWith('/') ? driver.driver_image : "/drivers/driver.jpg"}
                                    alt={driver.driver_name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className={cn(
                                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
                                driver.driver_status === 'available' ? 'bg-emerald-500' :
                                    driver.driver_status === 'busy' ? 'bg-purple-500' : 'bg-gray-400'
                            )}></span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">
                                {driver.driver_name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                {driver.stats?.active_deliveries ?? 0} Ongoing deliveries
                            </p>
                        </div>

                        {/* Status */}
                        <div className="ml-4 shrink-0">
                            <span
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                    getStatusColor(driver.driver_status)
                                )}
                            >
                                {driver.driver_status || "Unknown"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-2 border-t border-gray-100 flex justify-center">
                <Link
                    href="/super-admin/drivers"
                    className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                >
                    View More
                </Link>
            </div>
        </div>
    );
}
