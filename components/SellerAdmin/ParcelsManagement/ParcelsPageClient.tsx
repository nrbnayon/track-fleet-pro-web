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
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-gray-50 border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

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

                {/* Table Section */}
                <SellerParcelsTable
                    data={filteredData}
                    isLoading={isLoading}
                    itemsPerPage={5}
                />
            </div>

            <AddParcelModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
