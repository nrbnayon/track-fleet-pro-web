"use client";

import { useState, useMemo } from "react";
import { Package } from "lucide-react";
import { allParcelsData } from "@/data/allParcelsData";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function RecentParcels() {
    const [filter, setFilter] = useState("all");

    const filteredParcels = useMemo(() => {
        let data = [...allParcelsData];

        // Sort by date (newest first)
        data.sort((a, b) => {
            const dateA = new Date(a.createdAt || '').getTime();
            const dateB = new Date(b.createdAt || '').getTime();
            return dateB - dateA;
        });

        // Filter by status
        if (filter !== "all") {
            data = data.filter(
                (parcel) => parcel.parcel_status?.toLowerCase() === filter.toLowerCase()
            );
        }

        return data.slice(0, 5);
    }, [filter]);

    const getStatusColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "ongoing":
                return "bg-blue-100 text-blue-600";
            case "pending":
                return "bg-amber-100 text-amber-600";
            case "delivered":
                return "bg-emerald-100 text-emerald-600";
            case "return":
                return "bg-red-100 text-red-600";
            case "cancelled":
                return "bg-gray-100 text-secondary";
            default:
                return "bg-gray-100 text-secondary";
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Parcels</h2>
                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                    >
                        <option value="all">All Parcels</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
                {filteredParcels.map((parcel) => (
                    <div
                        key={parcel.id}
                        className="flex items-center p-3 rounded-lg shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                    >
                        {/* Icon */}
                        <div className="h-10 w-10 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-500 mr-4 shrink-0 group-hover:bg-blue-200/50 transition-colors">
                            <Package className="h-5 w-5" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">
                                {parcel.tracking_no}
                            </h3>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                {parcel.senderInfo?.name || "Unknown Sender"}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                {parcel.pickup_location || "Unknown Location"}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="ml-4 shrink-0">
                            <span
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                    getStatusColor(parcel.parcel_status)
                                )}
                            >
                                {parcel.parcel_status || "Unknown"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-2 border-t border-gray-100 flex justify-center">
                <Link
                    href="/super-admin/parcels"
                    className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                >
                    View More
                </Link>
            </div>
        </div>
    );
}
