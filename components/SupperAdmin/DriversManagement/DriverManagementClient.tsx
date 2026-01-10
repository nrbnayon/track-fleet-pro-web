"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { allDriversData } from "@/data/allDriversData";
import TranslatedText from "@/components/Shared/TranslatedText";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types/driver";
import DriverTable from "./DriverTable";
import DriverModal from "./DriverModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [selectedStatus, setSelectedStatus] = useState("All Drivers");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const statuses = ["All Drivers", "Available", "Assigned", "Busy", "Ongoing", "Delivered", "Offline"];

  useEffect(() => {
    let filtered = drivers;

    // Filter by Status
    if (selectedStatus !== "All Drivers") {
      filtered = filtered.filter((driver) => {
        const status = driver.driver_status.toLowerCase();
        const target = selectedStatus.toLowerCase();
        if (target === "assigned" || target === "busy") {
          return status === "busy" || status === "assigned";
        }
        return status === target;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (driver) =>
          driver.driver_name.toLowerCase().includes(query) ||
          driver.driver_email.toLowerCase().includes(query) ||
          driver.driver_id.toLowerCase().includes(query) ||
          (driver.vehicle_number && driver.vehicle_number.toLowerCase().includes(query)) ||
          driver.driver_phone.includes(query)
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
  }, [searchQuery, selectedStatus, drivers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 400);
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

  const handleEditDriver = (driver: Driver) => {
    setModalMode("edit");
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
      toast.success("Driver added successfully");
    } else if (modalMode === "edit" && selectedDriver) {
      const updatedDrivers = drivers.map((driver) =>
        driver.id === selectedDriver.id ? { ...driver, ...data } : driver
      );
      setDrivers(updatedDrivers);
      toast.success("Driver updated successfully");
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
      toast.success("Driver deleted successfully");
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
                <TranslatedText text={selectedStatus} />
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[140px]">
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <TranslatedText text={status} />
                  {selectedStatus === status && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="bg-primary text-white hover:bg-primary/80 h-[52px] px-6 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-sm"
            onClick={handleAddDriver}
          >
            <Plus className="w-5 h-5" />
            <TranslatedText text="Add Driver" />
          </Button>
        </div>
      </div>

      {/* Drivers Table Section */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
        <h2 className="pb-4 text-xl font-bold text-foreground">
          <TranslatedText text="Drivers List" />
        </h2>
        <DriverTable
          data={filteredData}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onView={handleViewDriver}
          onEdit={handleEditDriver}
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
