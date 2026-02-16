"use client";

import { Package, Truck, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { SellerRecentActivity } from "@/redux/services/dashboardApi";

interface RecentActivityProps {
    activities?: SellerRecentActivity[];
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter logic: show ASSIGNED (as ongoing), PENDING. Delivered is usually separate list or handled elsewhere if desired, 
    // but user request implies matching the JSON which has ASSIGNED and PENDING.
    const filteredActivities = activities; 

    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

    const getIcon = (status: string | undefined) => {
        switch (status?.toUpperCase()) {
            case "PENDING": return Clock;
            case "ASSIGNED": return Truck; // Map ASSIGNED to Truck
            case "ONGOING": return Truck;
            case "DELIVERED": return CheckCircle;
            default: return Package;
        }
    };

    const getIconColor = (status: string | undefined) => {
        switch (status?.toUpperCase()) {
            case "PENDING": return "text-amber-500 bg-amber-50";
            case "ASSIGNED": return "text-blue-500 bg-blue-50";
            case "ONGOING": return "text-blue-500 bg-blue-50";
            case "DELIVERED": return "text-emerald-500 bg-emerald-50";
            default: return "text-gray-500 bg-gray-50";
        }
    };

    const getBadgeColor = (status: string | undefined) => {
        switch (status?.toUpperCase()) {
            case "PENDING": return "bg-amber-100 text-amber-600";
            case "ASSIGNED": return "bg-blue-100 text-blue-600";
            case "ONGOING": return "bg-blue-100 text-blue-600";
            case "DELIVERED": return "bg-emerald-100 text-emerald-600";
            default: return "bg-gray-100 text-secondary";
        }
    };

    const formatDaysAgo = (days: number) => {
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] h-full flex flex-col">
            <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>

            <div className="space-y-6 flex-1">
                {currentActivities.map((activity, index) => {
                    const Icon = getIcon(activity.status);
                    return (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-2 rounded-lg", getIconColor(activity.status))}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Parcel {activity.tracking_id} {activity.status}
                                    </p>
                                    <p className="text-xs text-gray-500">{formatDaysAgo(activity.days_ago)}</p>
                                </div>
                            </div>
                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getBadgeColor(activity.status))}>
                                {activity.status}
                            </span>
                        </div>
                    );
                })}
                {activities.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">No recent activity</div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                         // Simple pagination logic: show all pages if <= 5, otherwise simplistic view
                         // For a small widget, typically we only show a few dots or just prev/next if many pages.
                         // Here we'll just show numbers if total pages are small, or just current page.
                         <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors",
                                currentPage === page ? "bg-blue-50 text-primary" : "text-gray-400 hover:bg-gray-50"
                            )}
                         >
                            {page}
                         </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
