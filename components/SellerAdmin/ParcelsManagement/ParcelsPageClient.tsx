"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Search, PackagePlus, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SellerParcelsTable from "./SellerParcelsTable";
import { AddParcelModal } from "./AddParcelModal";
import { useGetParcelsQuery } from "@/redux/services/parcelApi"; 

export default function ParcelsPageClient() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Debounce search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 when search changes
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch data from API with server-side pagination and search
    const { data: parcelsData, isLoading, isError, refetch } = useGetParcelsQuery({ 
        page, 
        limit: 10,
        search: debouncedSearch || undefined,
    });

    const parcels = parcelsData?.data || [];
    const meta = parcelsData?.meta;

    return (
        <div className="min-h-screen mb-12">
            <DashboardHeader
                title="Parcels Management"
                description="Manage and track all delivery parcels"
            />

            <div className="px-4 md:px-8 my-8 space-y-8">
                {/* Actions Bar */}
                <div className="bg-white p-4 rounded-lg border-none flex flex-col md:flex-row justify-between gap-4 items-center shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 font-bold" />
                        <Input
                            placeholder="Search by Tracking ID, Receiver Name..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            className="pl-9 bg-gray-50 border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                           variant="outline"
                           onClick={() => refetch()}
                           className="h-11 border-gray-200 text-secondary hover:text-white hover:bg-primary px-3 rounded-lg"
                        >
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full md:w-auto h-11 bg-primary hover:bg-primary/80 text-white font-bold p-3 rounded-lg flex items-center shadow-lg shadow-primary/25 transition-all active:scale-95"
                        >
                             <div className="rounded-md">
                                <PackagePlus className="h-4 w-4" />
                            </div>
                            Add New Parcel
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                {isError ? (
                    <div className="text-center py-10 text-red-500">
                        Failed to load parcels maybe server is down. Please try again.
                    </div>
                ) : (
                    <SellerParcelsTable
                        data={parcels}
                        isLoading={isLoading}
                        itemsPerPage={10}
                        currentPage={meta?.current_page || page}
                        totalPages={meta?.total_pages || 1}
                        totalItems={meta?.count || 0}
                        onPageChange={setPage}
                    />
                )}
            </div>

            <AddParcelModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
