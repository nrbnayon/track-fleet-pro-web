// components/SupperAdmin/ParcelsPageClient.tsx
"use client";

import { useState, useMemo } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import ParcelsTable from "@/components/SupperAdmin/ParcelsManagement/ParcelsTable";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Parcel } from "@/types/parcel";

interface ParcelsPageClientProps {
    data: Parcel[];
}

export default function ParcelsPageClient({ data }: ParcelsPageClientProps) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

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

    return (
        <div className="min-h-screen space-y-6">
            <DashboardHeader
                title="Parcels Management"
                description="Manage and track all delivery parcels"
            />

            {/* Filter and Search Bar */}
            <div className="px-4 md:px-8 mt-6">
                <div className="bg-white p-4 rounded-lg border-none flex flex-col md:flex-row justify-between gap-4 items-center shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
                    <div className="relative w-full md:w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by tracking number, sender, or receiver..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-gray-50 border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    <div className="w-full md:w-auto">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full md:w-40 h-11 bg-white border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center gap-2 text-secondary">
                                    <Filter className="h-4 w-4" />
                                    <SelectValue placeholder="Filter" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Results Summary */}
                {search.length > 0 && <div className="mt-4 text-sm text-secondary">
                    Showing {filteredData.length} of {data.length} parcels
                </div>}
            </div>

            <div className="px-4 md:px-8 pb-8">
                <ParcelsTable data={filteredData} itemsPerPage={7} />
            </div>
        </div>
    );
}