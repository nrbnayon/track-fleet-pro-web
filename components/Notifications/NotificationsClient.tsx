"use client";

import { useState, useMemo } from "react";
import { useUser } from "@/hooks/useUser";
import { useGetNotificationsQuery, useGetSellerNotificationsQuery } from "@/redux/services/notificationApi";
import { Notification } from "@/types/notification";
import {
    Bell,
    Package,
    Truck,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    UserCheck,
    UserPlus,
    AlertOctagon,
    Clock,
    X,
    Calendar,
    User,
    Hash,
    Info,
    RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Shared/Pagination";

const NOTIFICATION_ICONS: Record<string, any> = {
    driver_assigned: Truck,
    parcel_delivered: CheckCircle2,
    parcel_picked_up: Package,
    delivery_request_accepted: CheckCircle2,
    delivery_request_rejected: XCircle,
    driver_location_off: AlertTriangle,
    emergency_alert: AlertOctagon,
    seller_verified: UserCheck,
    seller_suspended: XCircle,
    new_order: UserPlus,
    default: Bell
};

const PRIORITY_COLORS: Record<string, string> = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-blue-100 text-blue-700 border-blue-200"
};

export default function NotificationsClient() {
    const { role, isLoading: userLoading } = useUser();
    
    // Choose the appropriate query based on role
    const adminQuery = useGetNotificationsQuery(undefined, {
        skip: role !== "SUPER_ADMIN" || userLoading,
    });
    
    const sellerQuery = useGetSellerNotificationsQuery(undefined, {
        skip: role !== "SELLER" || userLoading,
    });

    const activeQuery = role === "SELLER" ? sellerQuery : adminQuery;
    const { data: notificationsRes, isLoading: notificationsLoading, isError, refetch } = activeQuery;
    
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    
    const notifications = notificationsRes?.data || [];
    const itemsPerPage = 8;

    const filteredNotifications = useMemo(() => {
        if (!role) return [];

        let roleNotifications = [...notifications];

        // Sort by created_at descending (latest first)
        roleNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Filter based on tab
        if (activeTab === "unread") {
            roleNotifications = roleNotifications.filter(n => n.status === "UNREAD" || n.status === "unread");
        }

        return roleNotifications;
    }, [role, activeTab, notifications]);

    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

    const getIcon = (type: string, status?: string) => {
        const typeLower = type.toLowerCase();
        const isUnread = status?.toLowerCase() === "unread";
        let iconKey = "default";
        
        // Determine Icon Key
        if (typeLower.includes("emergency") || typeLower.includes("spam")) iconKey = "emergency_alert";
        else if (typeLower.includes("accepted")) iconKey = "delivery_request_accepted";
        else if (typeLower.includes("rejected")) iconKey = "delivery_request_rejected";
        else if (typeLower.includes("delivered")) iconKey = "parcel_delivered";
        else if (typeLower.includes("assigned")) iconKey = "driver_assigned";
        else if (typeLower.includes("picked")) iconKey = "parcel_picked_up";

        const Icon = NOTIFICATION_ICONS[iconKey] || NOTIFICATION_ICONS.default;
        
        // Determine Color Class
        let colorClass = "";
        if (isUnread) {
            colorClass = "text-white";
        } else {
            if (iconKey === "emergency_alert" || iconKey === "delivery_request_rejected") {
                colorClass = "text-red-500";
            } else if (iconKey === "parcel_delivered" || iconKey === "delivery_request_accepted" || iconKey === "parcel_picked_up") {
                colorClass = "text-green-500";
            } else {
                colorClass = "text-gray-400";
            }
        }

        return <Icon className={cn("w-5 h-5", colorClass)} />;
    };

    const formatTimestamp = (timestamp?: string) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            weekday: 'long',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatFullTimestamp = (timestamp?: string) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toLocaleString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
        // Note: Mark as read endpoint not implemented in this step as not provided by user, 
        // but normally we'd call an api mutation here.
    };

    const closeModal = () => {
        setSelectedNotification(null);
    };

    const handleActionClick = (url?: string) => {
        if (url) {
            window.location.href = url;
        }
        closeModal();
    };

    const parseNotificationMessage = (message: string) => {
        if (!message) return null;
        
        // Check if it's a structured report message
        const isReport = message.includes("Reported By") || message.includes("Issue Type");
        if (!isReport) return null;

        const data: Record<string, string> = {};
        
        // Define common keys and their variations
        const keys = [
            { label: "Reported By", patterns: ["Reported By:"] },
            { label: "Driver", patterns: ["Driver Name:", "Driver_Name:"] },
            { label: "Issue", patterns: ["Issue Type:", "Issue_Type:"] },
            { label: "Description", patterns: ["Description:"] }
        ];

        let lastIndex = 0;
        const foundKeys: { label: string; start: number; end: number }[] = [];

        keys.forEach(key => {
            key.patterns.forEach(pattern => {
                const index = message.indexOf(pattern);
                if (index !== -1) {
                    foundKeys.push({ label: key.label, start: index, end: index + pattern.length });
                }
            });
        });

        // Sort keys by their appearance in the message
        foundKeys.sort((a, b) => a.start - b.start);

        foundKeys.forEach((key, i) => {
            const start = key.end;
            const nextKey = foundKeys[i + 1];
            const end = nextKey ? nextKey.start : message.length;
            
            let value = message.substring(start, end).trim();
            // Remove trailing dot or space
            if (value.endsWith('.') || value.endsWith(' ')) {
                value = value.replace(/[. ]+$/, '');
            }
            
            if (value) {
                data[key.label] = value;
            }
        });

        return Object.keys(data).length > 0 ? data : null;
    };

    const renderMessage = (notification: Notification) => {
        const parsed = parseNotificationMessage(notification.message);
        
        if (parsed) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(parsed).map(([key, value]) => (
                        <div key={key} className={cn(
                            "p-4 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-primary/20 hover:shadow-md",
                            key === "Description" ? "md:col-span-2 bg-red-50/10 border-red-100/50" : ""
                        )}>
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                {key === "Reported By" && <User className="w-3 h-3" />}
                                {key === "Driver" && <Truck className="w-3 h-3" />}
                                {key === "Issue" && <AlertTriangle className="w-3 h-3" />}
                                {key === "Description" && <Info className="w-3 h-3" />}
                                {key}
                            </p>
                            <p className={cn(
                                "text-sm font-semibold text-foreground leading-snug",
                                key === "Issue" ? "text-red-600" : ""
                            )}>
                                {value}
                            </p>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                    {notification.message}
                </p>
            </div>
        );
    };

    if (userLoading || notificationsLoading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-gray-50 shadow-sm">
                <Clock className="w-10 h-10 animate-spin text-primary" />
                <p className="text-secondary font-bold">Loading your notifications...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-20 text-center bg-white rounded-3xl border border-gray-50 shadow-sm">
                <AlertOctagon className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <p className="font-bold text-gray-800 mb-4">Internal Server error. Notification loading failed!</p>
                <button 
                    onClick={() => refetch()}
                    className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        );
    }


    return (
        <div className="min-h-screen">

            <div className="bg-white rounded-3xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-50 p-6 md:p-8 transition-all hover:shadow-[6px_6px_64px_0px_rgba(0,0,0,0.08)]">

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-100 mb-8">
                    <button
                        onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
                        className={cn(
                            "pb-4 text-sm font-bold transition-all relative min-w-fit cursor-pointer",
                            activeTab === "all" ? "text-primary" : "text-gray-400 hover:text-secondary"
                        )}
                    >
                        All Notifications
                        {activeTab === "all" && <div className="absolute -bottom-px left-0 w-full h-[3px] bg-primary rounded-full transition-all" />}
                    </button>
                </div>

                {/* List */}
                <div className="space-y-4 mb-8">
                    {currentData.length > 0 ? (
                        currentData.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={cn(
                                    "p-5 rounded-3xl border transition-all flex items-start gap-5 hover:shadow-xl group cursor-pointer active:scale-[0.99]",
                                    (notification.status?.toLowerCase() === "unread")
                                        ? "bg-blue-50/40 border-blue-100 shadow-sm"
                                        : "bg-white border-gray-100"
                                )}
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:rotate-6 shadow-sm",
                                    (notification.status?.toLowerCase() === "unread") ? "bg-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                                )}>
                                    {getIcon(notification.type, notification.status)}
                                </div>
                                <div className="flex-1 space-y-2 py-0.5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                                {notification.title}
                                            </h3>
                                            {notification.tracking_no && (
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md">
                                                    #{notification.tracking_no}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-secondary uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                            <Clock className="w-3 h-3" />
                                            {formatTimestamp(notification.created_at || notification.timestamp)}
                                        </div>
                                    </div>
                                    <p className="text-xs md:text-sm font-medium text-gray-500 line-clamp-2 transition-all group-hover:text-gray-700">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Bell className="w-10 h-10 text-gray-200" />
                            </div>
                            <p className="font-bold text-secondary text-lg">No notifications found</p>
                            <p className="text-sm text-gray-400 mt-1 font-medium">We'll alert you when something happens!</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pt-6 border-t border-gray-50">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredNotifications.length}
                            itemsPerPage={itemsPerPage}
                            currentItemsCount={currentData.length}
                        />
                    </div>
                )}
            </div>


            {/* Notification Details Modal */}
            {selectedNotification && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative p-8 border-b border-gray-50 bg-gradient-to-br from-white to-gray-50/50">
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center transition-all cursor-pointer hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95 group"
                            >
                                <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                            </button>

                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105",
                                    selectedNotification.type?.toLowerCase().includes("emergency") 
                                        ? "bg-red-500 text-white shadow-red-200" 
                                        : "bg-primary text-white shadow-primary/20"
                                )}>
                                    {getIcon(selectedNotification.type, "unread")}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={cn(
                                            "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-xs",
                                            selectedNotification.type?.toLowerCase().includes("emergency")
                                                ? "bg-red-100 text-red-700 border-red-200"
                                                : "bg-blue-100 text-blue-700 border-blue-200"
                                        )}>
                                            {selectedNotification.type?.replace(/[🚨\s]/g, '') || "NOTIFICATION"}
                                        </span>
                                        {selectedNotification.priority && (
                                            <span className={cn(
                                                "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-xs",
                                                PRIORITY_COLORS[selectedNotification.priority]
                                            )}>
                                                {selectedNotification.priority}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
                                        {selectedNotification.title}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-250px)] scrollbar-hide">
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 shadow-sm">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{formatFullTimestamp(selectedNotification.created_at || selectedNotification.timestamp)}</span>
                                </div>
                                {selectedNotification.tracking_no && (
                                    <div className="flex items-center gap-2.5 px-4 py-2.5 bg-primary/5 rounded-2xl border border-primary/10 text-sm font-bold text-primary shadow-sm">
                                        <Hash className="w-4 h-4" />
                                        <span>#{selectedNotification.tracking_no}</span>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Content Rendering */}
                            <div className="mb-8">
                                <h4 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Message Details
                                </h4>
                                {renderMessage(selectedNotification)}
                            </div>

                            {/* Additional Metadata Grid */}
                            {((selectedNotification.driver_name || selectedNotification.seller_name) || (selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0)) && (
                                <div className="space-y-6 pt-6 border-t border-gray-100">
                                    <h4 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Involved Entities
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedNotification.driver_name && (
                                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary border border-gray-100">
                                                    <Truck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Driver</p>
                                                    <p className="text-sm font-bold text-foreground">{selectedNotification.driver_name}</p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedNotification.seller_name && (
                                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary border border-gray-100">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seller</p>
                                                    <p className="text-sm font-bold text-foreground">{selectedNotification.seller_name}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Dynamic Metadata */}
                                        {selectedNotification.metadata && Object.entries(selectedNotification.metadata).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary border border-gray-100">
                                                    <Info className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                                                        {key.replace(/_/g, ' ')}
                                                    </p>
                                                    <p className="text-sm font-bold text-foreground truncate max-w-[200px]">
                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex gap-4">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-8 py-4 rounded-2xl bg-white border border-gray-200 text-sm font-black text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.98] cursor-pointer"
                            >
                                CLOSE VIEW
                            </button>
                            {selectedNotification.tracking_no && (
                                <button
                                    onClick={() => handleActionClick(`/track-parcel?tracking_id=${selectedNotification.tracking_no}`)}
                                    className="flex-1 px-8 py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                                >
                                    TRACK PARCEL
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}