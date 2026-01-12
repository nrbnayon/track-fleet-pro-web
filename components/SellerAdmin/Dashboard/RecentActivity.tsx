"use client";

import { useSellerData } from "@/hooks/useSellerData";
import { useMemo } from "react";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecentActivity() {
    const { parcels } = useSellerData();

    const activities = useMemo(() => {
        // Flatten tracking history to get events
        const allEvents = parcels.flatMap((parcel) =>
            (parcel.trackingHistory || []).map((history) => ({
                ...history,
                tracking_no: parcel.tracking_no,
            }))
        );

        // Sort by timestamp
        return allEvents
            .sort((a, b) => {
                const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, 4);
    }, [parcels]);

    const getIcon = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "pending": return Clock;
            case "ongoing": return Truck;
            case "delivered": return CheckCircle;
            default: return Package;
        }
    };

    const getIconColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "pending": return "text-amber-500 bg-amber-50";
            case "ongoing": return "text-blue-500 bg-blue-50";
            case "delivered": return "text-emerald-500 bg-emerald-50";
            default: return "text-gray-500 bg-gray-50";
        }
    };

    const getBadgeColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-amber-100 text-amber-600";
            case "ongoing": return "bg-blue-100 text-blue-600";
            case "delivered": return "bg-emerald-100 text-emerald-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const formatRelativeTime = (timestamp: string | undefined) => {
        if (!timestamp) return "Unknown";
        const diff = Date.now() - new Date(timestamp).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return "Just now";
    };

    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

            <div className="space-y-6 flex-1">
                {activities.map((activity, index) => {
                    const Icon = getIcon(activity.status);
                    return (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-2 rounded-lg", getIconColor(activity.status))}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        Parcel {activity.tracking_no} {activity.status}
                                    </p>
                                    <p className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
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

            <div className="mt-8 flex items-center justify-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                    <span className="sr-only">Previous</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 text-xs font-bold hover:bg-gray-50">2</button>
                <span className="text-gray-400 text-xs">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 text-xs font-bold hover:bg-gray-50">9</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 text-xs font-bold hover:bg-gray-50">10</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                    <span className="sr-only">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
