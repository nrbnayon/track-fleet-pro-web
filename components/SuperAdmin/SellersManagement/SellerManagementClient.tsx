
"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Seller, CreateSellerRequest, UpdateSellerRequest } from "@/types/seller";
import SellerTable from "./SellerTable";
import SellerModal from "./SellerModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  useGetSellersQuery,
  useCreateSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
} from "@/redux/services/sellerApi";

interface SellerManagementClientProps {
  itemsPerPage?: number;
}

export default function SellerManagementClient({
  itemsPerPage = 10,
}: SellerManagementClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // API Hooks
  const { data: sellersData, isLoading, refetch } = useGetSellersQuery({
    page: 1,
    limit: 1000,
  });

  const [createSeller, { isLoading: isCreating }] = useCreateSellerMutation();
  const [updateSeller, { isLoading: isUpdating }] = useUpdateSellerMutation();
  const [deleteSeller] = useDeleteSellerMutation();

  const sellers = sellersData?.data || [];
  const [filteredData, setFilteredData] = useState<Seller[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [sellerToDelete, setSellerToDelete] = useState<Seller | null>(null);

  useEffect(() => {
    let filtered = sellers;

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
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, sellers]); 

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const handleSaveSeller = async (data: Partial<Seller>) => {
    try {
      if (modalMode === "create") {
        const createPayload: CreateSellerRequest = {
          full_name: data.seller_name!,
          email_address: data.seller_email!,
          address: data.seller_address!,
          phone_number: data.seller_phone!,
          business_name: data.business_name!,
        };
        await createSeller(createPayload).unwrap();

        toast.success("Seller added successfully! Password sent to email.");
      } else if (modalMode === "edit" && selectedSeller) {
        const updatePayload: UpdateSellerRequest = {
          full_name: data.seller_name!,
          email_address: data.seller_email!,
          address: data.seller_address!,
          phone_number: data.seller_phone!,
          business_name: data.business_name!,
        };
        await updateSeller({ id: selectedSeller.id, data: updatePayload }).unwrap();
        toast.success("Seller updated successfully");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save seller:", error);
      if (error?.data?.errors) {
         // Display specific validation errors
         Object.values(error.data.errors).forEach((err: any) => {
             toast.error(Array.isArray(err) ? err[0] : err);
         });
      } else {
        toast.error(error?.data?.message || "Failed to save seller");
      }
    }
  };

  const handleDeleteClick = (seller: Seller) => {
    setSellerToDelete(seller);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (sellerToDelete) {
      try {
        await deleteSeller(sellerToDelete.id).unwrap();
        toast.success("Seller deleted successfully");
        setIsDeleteModalOpen(false);
        setSellerToDelete(null);
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete seller");
      }
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
                isLoading={isCreating || isUpdating}
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
