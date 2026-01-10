"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { allDriversData } from "@/data/allDriversData";
import TranslatedText from "@/components/Shared/TranslatedText";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types/driver";
import DriverTable from "./DriverTable";
import DriverModal from "./DriverModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface DriverManagementClientProps {
  itemsPerPage?: number;
}

export default function DriverManagementClient({
  itemsPerPage = 10,
}: DriverManagementClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>(allDriversData);
  const [filteredData, setFilteredData] = useState<Driver[]>(allDriversData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view">("create");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  useEffect(() => {
    let filtered = drivers;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (driver) =>
          driver.driver_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.driver_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.vehicle_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.driver_phone.includes(searchQuery)
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, drivers]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddDriver = () => {
    setModalMode("create");
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  const handleViewDriver = (driver: Driver) => {
    setModalMode("view");
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleSaveDriver = (data: Partial<Driver>) => {
    if (modalMode === "create") {
      const newDriver: Driver = {
        id: `${drivers.length + 1}`,
        driver_id: `DRV${2024000 + drivers.length + 1}`,
        driver_name: data.driver_name || "",
        driver_email: data.driver_email || "",
        driver_phone: data.driver_phone || "",
        driver_status: "available",
        vehicle_type: "bike",
        vehicle_number: data.vehicle_number || "",
        isActive: true,
        stats: {
          total_deliveries: 0,
          active_deliveries: 0,
        },
        createdAt: new Date().toISOString(),
      };
      setDrivers([newDriver, ...drivers]);
    }
  };

  const handleDeleteClick = (driver: Driver) => {
    setDriverToDelete(driver);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (driverToDelete) {
      const updatedDrivers = drivers.filter((d) => d.id !== driverToDelete.id);
      setDrivers(updatedDrivers);
      setIsDeleteModalOpen(false);
      setDriverToDelete(null);
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
            className="pl-12 h-[52px] w-full rounded-[12px] border-[#E5E7EB] bg-white focus:ring-[#3B82F6] transition-all"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex items-center justify-between px-4 h-[52px] min-w-[140px] bg-white border border-[#E5E7EB] rounded-[12px] text-gray-700 font-medium">
            <TranslatedText text="All Drivers" />
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          <Button
            className="bg-[#0081FE] text-white hover:bg-[#0070E0] h-[52px] px-6 rounded-[12px] flex items-center gap-2 font-semibold transition-all shadow-sm"
            onClick={handleAddDriver}
          >
            <Plus className="w-5 h-5" />
            <TranslatedText text="Add Driver" />
          </Button>
        </div>
      </div>

      {/* Drivers Table Section */}
      <div className="space-y-4 bg-white p-6 rounded-[24px] shadow-sm border border-[#F1F1F1]">
        <h2 className="text-[20px] font-bold text-[#111827]">
          <TranslatedText text="Drivers List" />
        </h2>
        <DriverTable
          data={filteredData}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onView={handleViewDriver}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Driver Modal */}
      <DriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDriver}
        driver={selectedDriver}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        driverName={driverToDelete?.driver_name || ""}
      />
    </div>
  );
}
