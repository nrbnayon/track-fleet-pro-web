"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Search, PackagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SellerParcelsTable from "./SellerParcelsTable";
import { AddParcelModal } from "./AddParcelModal";
import { useSellerData } from "@/hooks/useSellerData";

export default function ParcelsPageClient() {
    const { parcels, isLoading: userDataLoading } = useSellerData();
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Simulate initial data loading delay for aesthetic skeleton effect
    useEffect(() => {
        if (!userDataLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [userDataLoading]);

    const filteredData = useMemo(() => {
        return parcels.filter(parcel => {
            const searchLower = search.toLowerCase();
            return (
                parcel.tracking_no.toLowerCase().includes(searchLower) ||
                parcel.receiverInfo?.name?.toLowerCase().includes(searchLower) ||
                parcel.delivery_location?.toLowerCase().includes(searchLower)
            );
        });
    }, [parcels, search]);

    return (
        <div className="min-h-screen pb-12">
            <DashboardHeader
                title="Parcels Management"
                description="Manage and track all delivery parcels"
            />

            <div className="px-4 md:px-8 mt-8 space-y-8">
                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-3xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 font-bold" />
                        <Input
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border-none h-14 pl-12 rounded-2xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] focus-visible:ring-primary/20 text-gray-700 font-medium placeholder:text-gray-400 placeholder:font-medium"
                        />
                    </div>

                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full md:w-auto bg-primary hover:bg-primary/80 text-white font-bold h-14 px-8 rounded-2xl flex items-center gap-3 shadow-lg shadow-primary/25 transition-all active:scale-95"
                    >
                        <div className="bg-white/20 p-1 rounded-md">
                            <PackagePlus className="h-4 w-4" />
                        </div>
                        Add New Parcel
                    </Button>
                </div>

                {/* Table Section */}
                <SellerParcelsTable
                    data={filteredData}
                    isLoading={isLoading}
                    itemsPerPage={10}
                />
            </div>

            <AddParcelModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
