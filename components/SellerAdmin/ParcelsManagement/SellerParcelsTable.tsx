"use client";

import { useState } from "react";
import { MapPin, Eye } from "lucide-react";
import { Parcel } from "@/types/parcel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Shared/Pagination";
import { SellerTrackParcelModal } from "./SellerTrackParcelModal";
import { SellerParcelDetailsModal } from "./SellerParcelDetailsModal";
import { AddParcelModal } from "./AddParcelModal";

interface SellerParcelsTableProps {
    data: Parcel[];
    itemsPerPage?: number;
    isLoading?: boolean;
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
}

export default function SellerParcelsTable({ 
    data, 
    itemsPerPage = 10, 
    isLoading = false,
    currentPage: externalPage,
    totalPages: externalTotalPages,
    totalItems,
    onPageChange: externalOnPageChange
}: SellerParcelsTableProps) {
    const [internalPage, setInternalPage] = useState(1);
    const [selectedParcelForTrack, setSelectedParcelForTrack] = useState<Parcel | null>(null);
    const [selectedParcelForView, setSelectedParcelForView] = useState<Parcel | null>(null);
    const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);

    console.log("all data:: ", data);
    
    // Determine if using server-side or client-side pagination
    const isServerSide = externalPage !== undefined && externalTotalPages !== undefined;
    
    // Use external props if available, otherwise internal state
    const currentPage = isServerSide ? externalPage : internalPage;
    const totalPages = isServerSide ? externalTotalPages : Math.ceil(data.length / itemsPerPage);
    
    const handlePageChange = (page: number) => {
        if (isServerSide && externalOnPageChange) {
            externalOnPageChange(page);
        } else {
            setInternalPage(page);
        }
    };

    // If server-side, data is already sliced. If client-side, slice it.
    const currentData = isServerSide ? data : data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    // Calculate total items for pagination display
    const displayTotalItems = isServerSide && totalItems !== undefined ? totalItems : data.length;

    const getStatusColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "ongoing": 
            case "assigned": return "bg-blue-100 text-primary";
            case "pending": return "bg-amber-100 text-amber-600";
            case "delivered": return "bg-emerald-100 text-emerald-600";
            case "return": return "bg-red-100 text-red-600";
            case "cancelled": return "bg-gray-100 text-secondary";
            default: return "bg-gray-100 text-secondary";
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
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-foreground">Parcel List</h2>
            </div>

            <div className="flex-1 overflow-auto">
                {/* Desktop View */}
                <table className="w-full text-left hidden lg:table">
                    <thead className="bg-[#E8F4FD]">
                        <tr>
                            <th className="px-8 py-5 text-sm font-bold text-primary uppercase tracking-wider">Tracking Number</th>
                            <th className="px-6 py-5 text-sm font-bold text-primary uppercase tracking-wider">Receiver</th>
                            <th className="px-6 py-5 text-sm font-bold text-primary uppercase tracking-wider">Delivery Address</th>
                            {/* <th className="px-6 py-5 text-sm font-bold text-primary uppercase tracking-wider">Distance</th> */}
                            <th className="px-6 py-5 text-sm font-bold text-primary uppercase tracking-wider">Parcel Weight</th>
                            <th className="px-6 py-5 text-sm font-bold text-primary uppercase tracking-wider">Assigned Driver</th>
                            <th className="px-6 py-5 text-sm font-bold text-primary uppercase tracking-wider">Status</th>
                            <th className="px-6 py-5 text-sm font-bold text-primary uppercase tracking-wider text-center">Action</th>
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
                                <tr key={parcel.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-8 py-5 text-sm font-bold text-secondary">{parcel.tracking_no}</td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-foreground">{parcel.receiverInfo?.name}</p>
                                            <p className="text-xs font-bold text-gray-400">{parcel.receiverInfo?.phone || "000-0000-000"}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-semibold text-secondary">{parcel.delivery_location}</td>
                                    {/* <td className="px-6 py-5 text-sm font-bold text-secondary">18.2 Km</td> */}
                                    <td className="px-6 py-5 text-sm font-bold text-secondary">{parcel.parcel_weight} Kg</td>
                                    <td className="px-6 py-5 text-sm font-bold text-secondary">
                                        {parcel.riderInfo?.rider_name || <span className="text-gray-400 italic font-medium">Unassigned</span>}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", getStatusColor(parcel.parcel_status))}>
                                            {parcel.parcel_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => setSelectedParcelForTrack(parcel)}
                                                className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-white hover:shadow-md transition-all cursor-pointer hover:border-primary hover:text-primary"
                                            >
                                                <MapPin className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setSelectedParcelForView(parcel)}
                                                className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-white hover:shadow-md transition-all cursor-pointer hover:border-primary hover:text-primary"
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
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking Number</p>
                                        <p className="text-sm font-bold text-foreground">{parcel.tracking_no}</p>
                                    </div>
                                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", getStatusColor(parcel.parcel_status))}>
                                        {parcel.parcel_status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Receiver</p>
                                        <p className="text-xs font-bold text-gray-800">{parcel.receiverInfo?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                                        <p className="text-xs font-bold text-gray-800">{parcel.parcel_weight} Kg</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                    <p className="text-xs font-semibold text-secondary line-clamp-1">{parcel.delivery_location}</p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 rounded-lg h-10 gap-2 text-xs font-bold border-gray-100 cursor-pointer hover:border-primary hover:text-white"
                                        onClick={() => setSelectedParcelForTrack(parcel)}
                                    >
                                        <MapPin className="w-3 h-3" />
                                        Track
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 rounded-lg h-10 gap-2 text-xs font-bold border-gray-100 cursor-pointer hover:border-primary hover:text-white"
                                        onClick={() => setSelectedParcelForView(parcel)}
                                    >
                                        <Eye className="w-3 h-3" />
                                        View
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-secondary font-medium">
                          <Eye className="w-6 h-6" />  No parcels found
                        </div>
                    )}
                </div>
            </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={displayTotalItems}
                    itemsPerPage={itemsPerPage}
                    currentItemsCount={currentData.length}
                />

            <SellerTrackParcelModal
                isOpen={!!selectedParcelForTrack}
                onClose={() => setSelectedParcelForTrack(null)}
                parcel={selectedParcelForTrack}
            />

            <SellerParcelDetailsModal
                isOpen={!!selectedParcelForView}
                onClose={() => setSelectedParcelForView(null)}
                parcel={selectedParcelForView}
                onEdit={() => {
                    setEditingParcel(selectedParcelForView);
                    setSelectedParcelForView(null);
                }}
            />

            {/* Reuse AddParcelModal for Editing */}
            <AddParcelModal
                isOpen={!!editingParcel}
                onClose={() => setEditingParcel(null)}
                initialData={editingParcel}
            />
        </div>
    );
}
