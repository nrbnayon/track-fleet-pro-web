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
import { AssignDriverModal } from "@/components/SupperAdmin/AssignDriverModal";
import { TrackParcelModal } from "@/components/SupperAdmin/TrackParcelModal";

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

            {/* Table Container */}
            <div className="overflow-x-auto rounded-none border-none">
                <Table>
                    <TableHeader className="bg-[#E8F4FD]">
                        <TableRow className="border-none hover:bg-[#E8F4FD]">
                            <TableHead className="font-semibold text-primary">Tracking Number</TableHead>
                            <TableHead className="font-semibold text-primary">Sender</TableHead>
                            <TableHead className="font-semibold text-primary">Receiver</TableHead>
                            <TableHead className="font-semibold text-primary">Delivery Address</TableHead>
                            <TableHead className="font-semibold text-primary">Weight</TableHead>
                            <TableHead className="font-semibold text-primary">Driver</TableHead>
                            <TableHead className="font-semibold text-primary">Status</TableHead>
                            <TableHead className="font-semibold text-primary">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.length > 0 ? (
                            currentData.map((parcel) => (
                                <TableRow
                                    key={parcel.id}
                                    className="border-b border-[#F3EEE7] hover:bg-blue-50/30 transition-colors"
                                >
                                    <TableCell className="font-medium text-secondary">{parcel.tracking_no}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{parcel.senderInfo?.name || "N/A"}</span>
                                            <span className="text-xs text-secondary">{parcel.senderInfo?.phone || "N/A"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{parcel.receiverInfo?.name || "N/A"}</span>
                                            <span className="text-xs text-secondary">{parcel.receiverInfo?.phone || "N/A"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-secondary" title={parcel.delivery_location}>
                                        {parcel.delivery_location}
                                    </TableCell>
                                    <TableCell className="text-secondary">{parcel.parcel_weight} Kg</TableCell>
                                    <TableCell>
                                        {parcel.riderInfo ? (
                                            <span className="text-secondary">{parcel.riderInfo.rider_name}</span>
                                        ) : (
                                            <span className="text-secondary italic">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(parcel.parcel_status))}>
                                            {parcel.parcel_status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
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
                </Table>
            </div>

            {/* Pagination - Only show if data exceeds itemsPerPage */}
            {showPagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={data.length}
                    itemsPerPage={itemsPerPage}
                    currentItemsCount={currentData.length}
                />
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