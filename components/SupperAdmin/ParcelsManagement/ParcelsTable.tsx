// components/SupperAdmin/ParcelsTable.tsx

"use client";
import { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Car, MapPin } from "lucide-react";
import { Parcel } from "@/types/parcel";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Shared/Pagination";
import { AssignDriverModal } from "@/components/SupperAdmin/ParcelsManagement/AssignDriverModal";
import { TrackParcelModal } from "@/components/SupperAdmin/ParcelsManagement/TrackParcelModal";

interface ParcelsTableProps {
    data: Parcel[];
    itemsPerPage?: number;
}

export default function ParcelsTable({ data, itemsPerPage = 10 }: ParcelsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedParcelForAssign, setSelectedParcelForAssign] = useState<Parcel | null>(null);
    const [selectedParcelForTrack, setSelectedParcelForTrack] = useState<Parcel | null>(null);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    // Reset to page 1 when data changes (from filtering)
    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "ongoing": return "bg-blue-100 text-blue-700";
            case "delivered": return "bg-emerald-100 text-emerald-700";
            case "pending": return "bg-amber-100 text-amber-700";
            case "cancelled": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const showPagination = data.length > itemsPerPage;

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-lg font-semibold text-foreground">Parcel List</h2>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <div className="relative w-full overflow-x-auto overflow-y-auto rounded-none border-none max-h-[70vh]">
                    <table className="w-full caption-bottom text-sm">
                        <TableHeader className="bg-[#E8F4FD] sticky top-0 z-10 shadow-sm">
                            <TableRow className="border-none hover:bg-[#E8F4FD]">
                                <TableHead className="font-semibold text-primary whitespace-nowrap">Tracking Number</TableHead>
                                <TableHead className="font-semibold text-primary whitespace-nowrap">Sender</TableHead>
                                <TableHead className="font-semibold text-primary whitespace-nowrap">Receiver</TableHead>
                                <TableHead className="font-semibold text-primary whitespace-nowrap">Delivery Address</TableHead>
                                <TableHead className="font-semibold text-primary whitespace-nowrap">Weight</TableHead>
                                <TableHead className="font-semibold text-primary whitespace-nowrap">Driver</TableHead>
                                <TableHead className="font-semibold text-primary whitespace-nowrap">Status</TableHead>
                                <TableHead className="font-semibold text-primary whitespace-nowrap">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.length > 0 ? (
                                currentData.map((parcel) => (
                                    <TableRow
                                        key={parcel.id}
                                        className="border-b border-[#F3EEE7] hover:bg-blue-50/30 transition-colors"
                                    >
                                        <TableCell className="font-medium text-secondary whitespace-nowrap">{parcel.tracking_no}</TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{parcel.senderInfo?.name || "N/A"}</span>
                                                <span className="text-xs text-secondary">{parcel.senderInfo?.phone || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{parcel.receiverInfo?.name || "N/A"}</span>
                                                <span className="text-xs text-secondary">{parcel.receiverInfo?.phone || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate text-secondary" title={parcel.delivery_location}>
                                            {parcel.delivery_location}
                                        </TableCell>
                                        <TableCell className="text-secondary whitespace-nowrap">{parcel.parcel_weight} Kg</TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {parcel.riderInfo ? (
                                                <span className="text-secondary">{parcel.riderInfo.rider_name}</span>
                                            ) : (
                                                <span className="text-secondary italic">Unassigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(parcel.parcel_status))}>
                                                {parcel.parcel_status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setSelectedParcelForTrack(parcel)}
                                                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors border border-border hover:border-primary cursor-pointer"
                                                    title="Track Parcel"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                </button>
                                                <Button
                                                    size="sm"
                                                    className="bg-primary hover:bg-primary/90 text-white gap-2 px-3 h-8"
                                                    onClick={() => setSelectedParcelForAssign(parcel)}
                                                >
                                                    <Car className="w-4 h-4" />
                                                    Assign
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-secondary">
                                        No parcels found matching your criteria
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {currentData.length > 0 ? (
                    currentData.map((parcel) => (
                        <div key={parcel.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Tracking ID</p>
                                    <p className="font-semibold text-gray-900">{parcel.tracking_no}</p>
                                </div>
                                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(parcel.parcel_status))}>
                                    {parcel.parcel_status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500">Sender</p>
                                        <p className="font-medium truncate">{parcel.senderInfo?.name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Receiver</p>
                                        <p className="font-medium truncate">{parcel.receiverInfo?.name || "N/A"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Delivery Address</p>
                                    <p className="text-sm text-gray-700">{parcel.delivery_location}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500">Weight</p>
                                        <p className="font-medium">{parcel.parcel_weight} Kg</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Driver</p>
                                        <p className="font-medium">
                                            {parcel.riderInfo ? parcel.riderInfo.rider_name : <span className="italic text-gray-400">Unassigned</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-2"
                                    onClick={() => setSelectedParcelForTrack(parcel)}
                                >
                                    <MapPin className="w-4 h-4" />
                                    Track
                                </Button>
                                <Button
                                    size="sm"
                                    className="flex-1 bg-primary text-white gap-2"
                                    onClick={() => setSelectedParcelForAssign(parcel)}
                                >
                                    <Car className="w-4 h-4" />
                                    Assign Rider
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-secondary bg-gray-50 rounded-lg">
                        No parcels found matching your criteria
                    </div>
                )}
            </div>

            {/* Pagination - Only show if data exceeds itemsPerPage */}
            {showPagination && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={data.length}
                        itemsPerPage={itemsPerPage}
                        currentItemsCount={currentData.length}
                    />
                </div>
            )}

            {/* Modals */}
            {selectedParcelForAssign && (
                <AssignDriverModal
                    isOpen={!!selectedParcelForAssign}
                    onClose={() => setSelectedParcelForAssign(null)}
                    parcel={selectedParcelForAssign}
                />
            )}

            {selectedParcelForTrack && (
                <TrackParcelModal
                    isOpen={!!selectedParcelForTrack}
                    onClose={() => setSelectedParcelForTrack(null)}
                    parcel={selectedParcelForTrack}
                />
            )}
        </div>
    );
}