"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, Check } from "lucide-react";
import { toast } from "sonner";

import { Driver } from "@/types/driver";
import { useGetDriversQuery, useCreateDriverMutation, useUpdateDriverMutation, useDeleteDriverMutation } from "@/redux/services/driverApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Drivers");
  
  // Use API - Fetch all drivers for client-side filtering
  const { data: driversData, isLoading: isDriversLoading, refetch } = useGetDriversQuery({ 
      page: 1, 
      limit: 1000, 
  });
  
  const [createDriver, { isLoading: isCreating }] = useCreateDriverMutation();
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation();
  const [deleteDriver] = useDeleteDriverMutation();

  const drivers = driversData?.data || [];
  const [filteredData, setFilteredData] = useState<Driver[]>([]);

  useEffect(() => {
    let result = drivers;

    // Filter by Status
    if (selectedStatus !== "All Drivers") {
      result = result.filter((driver) => {
        const status = driver.driver_status.toLowerCase();
        const target = selectedStatus.toLowerCase();
        return status === target;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (driver) =>
          driver.driver_name.toLowerCase().includes(query) ||
          driver.driver_email.toLowerCase().includes(query) ||
          driver.driver_phone.includes(query) ||
          (driver.vehicle_number && driver.vehicle_number.toLowerCase().includes(query))
      );
    }

    setFilteredData(result);
    setCurrentPage(1); 
  }, [drivers, searchQuery, selectedStatus]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const statuses = ["All Drivers", "Available", "Assigned", "Busy", "Ongoing", "Offline"];

  // Debounce search could be added, but hook handles refetch on state change automatically.

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

  const handleEditDriver = (driver: Driver) => {
    setModalMode("edit");
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleSaveDriver = async (data: Partial<Driver>) => {
    try {
      if (modalMode === "create") {
         await createDriver({
             full_name: data.driver_name || "",
             vehicle_number: data.vehicle_number || "",
             phone_number: data.driver_phone || "",
             email_address: data.driver_email || ""
         }).unwrap();
         toast.success("Driver added successfully");
      } else if (modalMode === "edit" && selectedDriver) {
         await updateDriver({
             id: selectedDriver.id,
             data: {
                 full_name: data.driver_name || selectedDriver.driver_name,
                 vehicle_number: data.vehicle_number || selectedDriver.vehicle_number || "",
                 phone_number: data.driver_phone || selectedDriver.driver_phone,
                 email_address: data.driver_email || selectedDriver.driver_email,
             }
         }).unwrap();
         toast.success("Driver updated successfully");
      }
      setIsModalOpen(false);
      refetch(); 
    } catch (error: any) {
        console.error("Failed to save driver:", error);
         if (error?.data?.errors) {
            const validationErrors = error.data.errors;
            const messages = Object.values(validationErrors).flat();
            if (messages.length > 0) {
                 toast.error(messages[0] as string);
            } else {
                 toast.error("Validation failed");
            }
        } else {
            toast.error(error?.data?.message || "Operation failed");
        }
    }
  };

  const handleDeleteClick = (driver: Driver) => {
    setDriverToDelete(driver);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (driverToDelete) {
      try {
          await deleteDriver(driverToDelete.id).unwrap();
          toast.success("Driver deleted successfully");
          setIsDeleteModalOpen(false);
          setDriverToDelete(null);
          refetch();
      } catch (error: any) {
          console.error("Failed to delete driver:", error);
          toast.error(error?.data?.message || "Failed to delete driver");
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between px-4 h-[52px] min-w-[140px] bg-white border border-border rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                {selectedStatus}
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
                  {status}
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
            Add Driver
          </Button>
        </div>
      </div>

      {/* Drivers Table Section */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
        <h2 className="pb-4 text-xl font-bold text-foreground">
          Drivers List
        </h2>
        <DriverTable
          data={filteredData}
          itemsPerPage={itemsPerPage}
          isLoading={isDriversLoading}
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
        isLoading={isCreating || isUpdating}
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
