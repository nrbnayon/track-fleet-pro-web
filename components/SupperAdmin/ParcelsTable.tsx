"use client";

import { useState } from "react";
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
import { useMemo } from "react";
import { Pagination } from "@/components/Shared/Pagination";
import { AssignDriverModal } from "@/components/SupperAdmin/AssignDriverModal";
import { TrackParcelModal } from "@/components/SupperAdmin/TrackParcelModal";

interface ParcelsTableProps {
    data: Parcel[];
}

export default function ParcelsTable({ data }: ParcelsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedParcelForAssign, setSelectedParcelForAssign] = useState<Parcel | null>(null);
    const [selectedParcelForTrack, setSelectedParcelForTrack] = useState<Parcel | null>(null);

    const filteredData = useMemo(() => {
        return data.filter(parcel => {
            const matchesSearch =
                parcel.tracking_no.toLowerCase().includes(search.toLowerCase()) ||
                parcel.senderInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
                parcel.receiverInfo?.name?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = filterStatus === "all" || parcel.parcel_status.toLowerCase() === filterStatus.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [data, search, filterStatus]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "ongoing": return "bg-blue-100 text-blue-600";
            case "delivered": return "bg-emerald-100 text-emerald-600";
            case "pending": return "bg-amber-100 text-amber-600";
            case "cancelled": return "bg-red-100 text-red-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
            {/* Header Controls */}
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Parcel list</h2>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-blue-50/50">
                        <TableRow>
                            <TableHead className="font-semibold text-blue-600">Tracking Number</TableHead>
                            <TableHead className="font-semibold text-blue-600">Sender</TableHead>
                            <TableHead className="font-semibold text-blue-600">Receiver</TableHead>
                            <TableHead className="font-semibold text-blue-600">Delivery Address</TableHead>
                            <TableHead className="font-semibold text-blue-600">Weight</TableHead>
                            <TableHead className="font-semibold text-blue-600">Driver</TableHead>
                            <TableHead className="font-semibold text-blue-600">Status</TableHead>
                            <TableHead className="font-semibold text-blue-600">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.map((parcel) => (
                            <TableRow key={parcel.id} className="hover:bg-gray-50/50">
                                <TableCell className="font-medium text-gray-700">{parcel.tracking_no}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{parcel.senderInfo?.name || "N/A"}</span>
                                        <span className="text-xs text-gray-400">{parcel.senderInfo?.phone || "N/A"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{parcel.receiverInfo?.name || "N/A"}</span>
                                        <span className="text-xs text-gray-400">{parcel.receiverInfo?.phone || "N/A"}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate text-gray-600" title={parcel.delivery_location}>
                                    {parcel.delivery_location}
                                </TableCell>
                                <TableCell className="text-gray-600">{parcel.parcel_weight} Kg</TableCell>
                                <TableCell>
                                    {parcel.riderInfo ? (
                                        <span className="text-gray-700">{parcel.riderInfo.rider_name}</span>
                                    ) : (
                                        <span className="text-gray-400 italic">Unassigned</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(parcel.parcel_status))}>
                                        {parcel.parcel_status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedParcelForTrack(parcel)}
                                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors border border-gray-200"
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
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                currentItemsCount={currentData.length}
            />

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
