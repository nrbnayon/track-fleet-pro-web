
"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { allSellersData } from "@/data/allSellersData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Seller } from "@/types/seller";
import SellerTable from "./SellerTable";
import SellerModal from "./SellerModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SellerManagementClientProps {
    itemsPerPage?: number;
}

export default function SellerManagementClient({
    itemsPerPage = 10,
}: SellerManagementClientProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [sellers, setSellers] = useState<Seller[]>(allSellersData);
    const [filteredData, setFilteredData] = useState<Seller[]>(allSellersData);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All Sellers");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [sellerToDelete, setSellerToDelete] = useState<Seller | null>(null);

    const statuses = ["All Sellers", "Active", "Inactive", "Suspended", "Pending Verification"];

    useEffect(() => {
        let filtered = sellers;

        // Filter by Status
        if (selectedStatus !== "All Sellers") {
            filtered = filtered.filter((seller) => {
                const status = seller.seller_status.toLowerCase();
                const target = selectedStatus.toLowerCase().replace(" ", "_");
                return status === target;
            });
        }

        // Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (seller) =>
                    seller.seller_name.toLowerCase().includes(query) ||
                    seller.business_name.toLowerCase().includes(query) ||
                    seller.seller_email.toLowerCase().includes(query) ||
                    seller.seller_id.toLowerCase().includes(query) ||
                    seller.seller_phone.includes(query)
            );
        }

        setFilteredData(filtered);
        setCurrentPage(1);

        // Trigger loading state for visual feedback
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedStatus, sellers]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 400);
    };

    const handleAddSeller = () => {
        setModalMode("create");
        setSelectedSeller(null);
        setIsModalOpen(true);
    };

    const handleViewSeller = (seller: Seller) => {
        setModalMode("view");
        setSelectedSeller(seller);
        setIsModalOpen(true);
    };

    const handleEditSeller = (seller: Seller) => {
        setModalMode("edit");
        setSelectedSeller(seller);
        setIsModalOpen(true);
    };

    const handleSaveSeller = (data: Partial<Seller>) => {
        if (modalMode === "create") {
            const newSeller: Seller = {
                id: `${sellers.length + 1}`,
                seller_id: `SLR${Math.floor(Math.random() * 900) + 100}`,
                seller_name: data.seller_name || "",
                business_name: data.business_name || "",
                seller_email: data.seller_email || "",
                seller_phone: data.seller_phone || "",
                seller_address: data.seller_address || "",
                seller_status: "active",
                stats: {
                    total_parcels: 0,
                    pending_parcels: 0,
                    completed_parcels: 0,
                    cancelled_parcels: 0,
                    total_revenue: 0,
                },
                createdAt: new Date().toISOString(),
            };
            setSellers([newSeller, ...sellers]);
            toast.success("Seller added successfully");
        } else if (modalMode === "edit" && selectedSeller) {
            const updatedSellers = sellers.map((seller) =>
                seller.id === selectedSeller.id ? { ...seller, ...data } : seller
            );
            setSellers(updatedSellers);
            toast.success("Seller updated successfully");
        }
    };

    const handleDeleteClick = (seller: Seller) => {
        setSellerToDelete(seller);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (sellerToDelete) {
            const updatedSellers = sellers.filter((s) => s.id !== sellerToDelete.id);
            setSellers(updatedSellers);
            setIsDeleteModalOpen(false);
            setSellerToDelete(null);
            toast.success("Seller deleted successfully");
        }
    };

    return (
        <div className="space-y-8">
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:flex-1 max-w-4xl">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-[52px] w-full rounded-lg border-border bg-white focus:ring-primary transition-all"
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center justify-between px-4 h-[52px] min-w-[140px] bg-white border border-border rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                {selectedStatus}
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            {statuses.map((status) => (
                                <DropdownMenuItem
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    {status}
                                    {selectedStatus === status && <Check className="w-4 h-4" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        className="bg-primary text-white hover:bg-primary/80 h-[52px] px-6 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-sm"
                        onClick={handleAddSeller}
                    >
                        <Plus className="w-5 h-5" />
                        Add Seller
                    </Button>
                </div>
            </div>

            {/* Sellers Table Section */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
                <h2 className="pb-4 text-xl font-bold text-foreground">
                    Sellers List
                </h2>
                <SellerTable
                    data={filteredData}
                    itemsPerPage={itemsPerPage}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onView={handleViewSeller}
                    onEdit={handleEditSeller}
                    onDelete={handleDeleteClick}
                />
            </div>

            {/* Seller Modal */}
            <SellerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSeller}
                seller={selectedSeller}
                mode={modalMode}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                sellerName={sellerToDelete?.seller_name || ""}
            />
        </div>
    );
}
