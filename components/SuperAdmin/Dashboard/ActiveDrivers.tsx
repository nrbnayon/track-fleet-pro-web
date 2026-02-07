"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { ActiveDriver } from "@/types/dashboard";

interface ActiveDriversProps {
    drivers?: ActiveDriver[];
}

export default function ActiveDrivers({ drivers = [] }: ActiveDriversProps) {

    const activeDrivers = useMemo(() => {
        return drivers
            .map(driver => {
                let status = 'offline';
                if (driver.active_delivery > 2) status = 'busy';
                else if (driver.is_available) status = 'available'; // Assuming is_available implies online and ready

                 // Or strictly follow is_online logic if needed, but 'available' usually means ready for tasks
                 // API has is_available and is_online.
                 // Let's deduce:
                 // if active_delivery > 2 -> busy
                 // else if is_available -> available
                 // else if is_online -> online (but maybe not available?) -> treat as available or idle?
                 // Let's stick to simplest mapping.
                 
                return {
                    ...driver,
                    derivedStatus: status
                };
            })
            // Sort or filter if needed? The API "active_drivers" list likely already filters for active ones.
            // But if we want to sort:
            .sort((a, b) => {
                 const statusPriority: Record<string, number> = { busy: 0, available: 1, offline: 2 };
                 return (statusPriority[a.derivedStatus] ?? 2) - (statusPriority[b.derivedStatus] ?? 2);
            })
            .slice(0, 8); 
    }, [drivers]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-emerald-100 text-emerald-600"; 
            case "busy":
                return "bg-purple-100 text-purple-600"; 
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
                {activeDrivers.length === 0 ? (
                     <div className="text-center text-gray-500 py-4">No active drivers</div>
                ) : (
                    activeDrivers.map((driver, index) => (
                        <div
                            key={index}
                            className="flex items-center p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-colors shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]"
                        >
                            {/* Avatar */}
                            <div className="relative h-10 w-10 mr-4 shrink-0">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                    src={driver.profile_image || "/drivers/driver.jpg"}
                                    alt={driver.full_name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                                <span className={cn(
                                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
                                    driver.derivedStatus === 'available' ? 'bg-emerald-500' :
                                        driver.derivedStatus === 'busy' ? 'bg-purple-500' : 'bg-gray-400'
                                )}></span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-foreground truncate">
                                    {driver.full_name}
                                </h3>
                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {driver.active_delivery} Ongoing deliveries
                                </p>
                            </div>

                            {/* Status */}
                            <div className="ml-4 shrink-0">
                                <span
                                    className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                        getStatusColor(driver.derivedStatus)
                                    )}
                                >
                                    {driver.derivedStatus}
                                </span>
                            </div>
                        </div>
                    ))
                )}
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

