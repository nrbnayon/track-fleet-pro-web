"use client";

import { useState } from "react";
import { MapPin, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Parcel } from "@/types/parcel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SellerTrackParcelModal } from "./SellerTrackParcelModal";
import { SellerParcelDetailsModal } from "./SellerParcelDetailsModal";

interface SellerParcelsTableProps {
    data: Parcel[];
    itemsPerPage?: number;
    isLoading?: boolean;
}

export default function SellerParcelsTable({ data, itemsPerPage = 10, isLoading = false }: SellerParcelsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedParcelForTrack, setSelectedParcelForTrack] = useState<Parcel | null>(null);
    const [selectedParcelForView, setSelectedParcelForView] = useState<Parcel | null>(null);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const getStatusColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "ongoing": return "bg-blue-100 text-blue-600";
            case "pending": return "bg-amber-100 text-amber-600";
            case "delivered": return "bg-emerald-100 text-emerald-600";
            case "return": return "bg-red-100 text-red-600";
            case "cancelled": return "bg-gray-100 text-gray-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const LoadingSkeleton = () => (
        <div className="space-y-4">
            {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="grid grid-cols-8 gap-4 p-4 items-center border-b border-gray-50">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-50 flex flex-col min-h-[600px]">
            <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Parcel List</h2>
            </div>

            <div className="flex-1 overflow-x-auto">
                {/* Desktop View */}
                <table className="w-full text-left hidden lg:table">
                    <thead className="bg-blue-50/50">
                        <tr>
                            <th className="px-8 py-5 text-sm font-bold text-blue-600 uppercase tracking-wider">Tracking Number</th>
                            <th className="px-6 py-5 text-sm font-bold text-blue-600 uppercase tracking-wider">Receiver</th>
                            <th className="px-6 py-5 text-sm font-bold text-blue-600 uppercase tracking-wider">Delivery Address</th>
                            <th className="px-6 py-5 text-sm font-bold text-blue-600 uppercase tracking-wider">Distance</th>
                            <th className="px-6 py-5 text-sm font-bold text-blue-600 uppercase tracking-wider">Parcel Weight</th>
                            <th className="px-6 py-5 text-sm font-bold text-blue-600 uppercase tracking-wider">Assigned Driver</th>
                            <th className="px-6 py-5 text-sm font-bold text-blue-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-5 text-sm font-bold text-blue-600 uppercase tracking-wider text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="p-0">
                                    <LoadingSkeleton />
                                </td>
                            </tr>
                        ) : currentData.length > 0 ? (
                            currentData.map((parcel) => (
                                <tr key={parcel.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-8 py-5 text-sm font-bold text-gray-700">{parcel.tracking_no}</td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-gray-900">{parcel.receiverInfo?.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400">{parcel.receiverInfo?.phone || "000-0000-000"}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-semibold text-gray-600">{parcel.delivery_location}</td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-700">18.2 Km</td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-700">{parcel.parcel_weight} Kg</td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-700">
                                        {parcel.riderInfo?.rider_name || <span className="text-gray-400 italic font-medium">Unassigned</span>}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getStatusColor(parcel.parcel_status))}>
                                            {parcel.parcel_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => setSelectedParcelForTrack(parcel)}
                                                className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-blue-500 hover:bg-white hover:shadow-md transition-all"
                                            >
                                                <MapPin className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setSelectedParcelForView(parcel)}
                                                className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-blue-500 hover:bg-white hover:shadow-md transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-4 bg-gray-50 rounded-full">
                                            <Eye className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No parcels found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Mobile/Tablet View */}
                <div className="lg:hidden p-4 space-y-4">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 rounded-2xl border border-gray-100 space-y-3">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-8 w-full rounded-xl" />
                            </div>
                        ))
                    ) : currentData.length > 0 ? (
                        currentData.map((parcel) => (
                            <div key={parcel.id} className="p-6 rounded-3xl border border-gray-50 shadow-sm space-y-4 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking Number</p>
                                        <p className="text-sm font-bold text-gray-900">{parcel.tracking_no}</p>
                                    </div>
                                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", getStatusColor(parcel.parcel_status))}>
                                        {parcel.parcel_status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Receiver</p>
                                        <p className="text-xs font-bold text-gray-800">{parcel.receiverInfo?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                                        <p className="text-xs font-bold text-gray-800">{parcel.parcel_weight} Kg</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                    <p className="text-xs font-semibold text-gray-600 line-clamp-1">{parcel.delivery_location}</p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 rounded-xl h-10 gap-2 text-xs font-bold border-gray-100"
                                        onClick={() => setSelectedParcelForTrack(parcel)}
                                    >
                                        <MapPin className="w-3 h-3" />
                                        Track
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 rounded-xl h-10 gap-2 text-xs font-bold border-gray-100"
                                        onClick={() => setSelectedParcelForView(parcel)}
                                    >
                                        <Eye className="w-3 h-3" />
                                        View
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-400 font-medium">
                            No parcels found
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-8 border-t border-gray-50 flex items-center justify-center gap-3">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-blue-500 disabled:opacity-50 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={cn(
                                    "w-10 h-10 rounded-xl text-sm font-bold transition-all",
                                    currentPage === i + 1
                                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                                        : "text-gray-400 hover:bg-gray-50"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-blue-500 disabled:opacity-50 transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            <SellerTrackParcelModal
                isOpen={!!selectedParcelForTrack}
                onClose={() => setSelectedParcelForTrack(null)}
                parcel={selectedParcelForTrack}
            />

            <SellerParcelDetailsModal
                isOpen={!!selectedParcelForView}
                onClose={() => setSelectedParcelForView(null)}
                parcel={selectedParcelForView}
            />
        </div>
    );
}
