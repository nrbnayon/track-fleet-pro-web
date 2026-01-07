// components/Dashboard/DataManagement/DataManagementClient.tsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { landParcelsData } from "@/data/landParcelsData";
import TranslatedText from "@/components/Shared/TranslatedText";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LandParcel, LandParcelFormData } from "@/types/land-parcel";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddSquareIcon,
  FilterHorizontalIcon,
} from "@hugeicons/core-free-icons";
import LandParcelsTable from "@/components/Dashboard/Shared/LandParcelsTable";
import PropertyModal from "./PropertyModal";
import ExportDropdown from "./ExportDropdown";
import { useUser } from "@/hooks/useUser";

interface DataManagementClientProps {
  itemsPerPage?: number;
}

export default function DataManagementClient({
  itemsPerPage = 10,
}: DataManagementClientProps) {
  const { hasRole } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] =
    useState<LandParcel[]>(landParcelsData);
  const [searchParcelId, setSearchParcelId] = useState("");
  const [filterZone, setFilterZone] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterOwnership, setFilterOwnership] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProperty, setSelectedProperty] = useState<LandParcel | null>(
    null
  );

  const uniqueZones = Array.from(
    new Set(landParcelsData.map((p) => p.zone))
  ).sort();
  const uniqueTypes = Array.from(
    new Set(landParcelsData.map((p) => p.type))
  ).sort();
  const uniqueOwnerships = Array.from(
    new Set(landParcelsData.map((p) => p.ownership))
  ).sort();

  useEffect(() => {
    let filtered = landParcelsData;

    if (searchParcelId.trim()) {
      filtered = filtered.filter((parcel) =>
        parcel.parcelId.toLowerCase().includes(searchParcelId.toLowerCase())
      );
    }

    if (filterZone) {
      filtered = filtered.filter((parcel) => parcel.zone === filterZone);
    }

    if (filterType) {
      filtered = filtered.filter((parcel) => parcel.type === filterType);
    }

    if (filterOwnership) {
      filtered = filtered.filter(
        (parcel) => parcel.ownership === filterOwnership
      );
    }

    if (fromDate || toDate) {
      filtered = filtered.filter((parcel) => {
        const parcelDate = new Date(parcel.registrationDate);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && parcelDate < from) return false;
        if (to && parcelDate > to) return false;
        return true;
      });
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [
    searchParcelId,
    filterZone,
    filterType,
    filterOwnership,
    fromDate,
    toDate,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentPage, filteredData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSearchParcelId("");
    setFilterZone("");
    setFilterType("");
    setFilterOwnership("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handleAddProperty = () => {
    setModalMode("create");
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: LandParcel) => {
    setModalMode("edit");
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleSaveProperty = (data: LandParcelFormData) => {
    if (modalMode === "create") {
      console.log("Creating new property:", data);
      // Add logic to save new property
    } else {
      console.log("Updating property:", data);
      // Add logic to update existing property
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="rounded-lg border border-border p-6 bg-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon
              icon={FilterHorizontalIcon}
              size={24}
              color="#49AB41"
              strokeWidth={1.5}
            />
            <h3 className="text-lg font-semibold text-foreground">
              <TranslatedText text="Filters" />
            </h3>
          </div>
          <ExportDropdown data={filteredData} />
        </div>

        {/* Parcel ID Search */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              <TranslatedText text="Search by Parcel ID" />
            </span>
          </div>
          <Input
            type="text"
            placeholder="P000001"
            value={searchParcelId}
            onChange={(e) => setSearchParcelId(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Filter Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-secondary mb-2 block">
              <TranslatedText text="Zone" />
            </label>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="w-full h-11 px-3 py-1 rounded-md border border-input bg-transparent text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer"
            >
              <option value="">
                <TranslatedText text="All Zones" />
              </option>
              {uniqueZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-secondary mb-2 block">
              <TranslatedText text="Type" />
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full h-11 px-3 py-1 rounded-md border border-input bg-transparent text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer"
            >
              <option value="">
                <TranslatedText text="All Types" />
              </option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-secondary mb-2 block">
              <TranslatedText text="Ownership" />
            </label>
            <select
              value={filterOwnership}
              onChange={(e) => setFilterOwnership(e.target.value)}
              className="w-full h-11 px-3 py-1 rounded-md border border-input bg-transparent text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer"
            >
              <option value="">
                <TranslatedText text="All Ownerships" />
              </option>
              {uniqueOwnerships.map((ownership) => (
                <option key={ownership} value={ownership}>
                  {ownership}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-secondary mb-2 block">
              <TranslatedText text="From Date" />
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-secondary mb-2 block">
              <TranslatedText text="To Date" />
            </label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="text-sm"
        >
          <TranslatedText text="Clear Filters" />
        </Button>
      </div>

      {/* Search and Add Section */}
      {hasRole("admin") && (
        <div className="flex justify-between items-center gap-4 p-5 bg-white rounded-lg border border-border">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
            <Input
              type="text"
              placeholder="Search"
              value={searchParcelId}
              onChange={(e) => setSearchParcelId(e.target.value)}
              className="pl-10 w-full md:w-60"
            />
          </div>
          <Button
            className="bg-primary-green text-white hover:bg-green-600"
            onClick={handleAddProperty}
          >
            <HugeiconsIcon icon={AddSquareIcon} />
            <TranslatedText text="Add Property" />
          </Button>
        </div>
      )}

      {/* Data Table */}
      <LandParcelsTable
        data={filteredData}
        itemsPerPage={itemsPerPage}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onEdit={handleEditProperty}
      />

      {/* Property Modal */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProperty}
        property={selectedProperty}
        mode={modalMode}
      />
    </div>
  );
}
