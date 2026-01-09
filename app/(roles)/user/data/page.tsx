// app/(roles)/user/data/page.tsx
"use client";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import DataManagementClient from "@/components/Dashboard/DataManagement/DataManagementClient";
import ExportDropdown from "@/components/Dashboard/DataManagement/ExportDropdown";
import { landParcelsData } from "@/data/landParcelsData";

export default function DataPage() {

  return (
    <div className="h-screen">
      <DashboardHeader
        title="Data Management"
        description="Add, edit, and manage property records"
      />

      <div className="p-4 md:px-8 md:py-6">
        {/* Tabs and Export Button */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <ExportDropdown data={landParcelsData} />
        </div>
        <DataManagementClient itemsPerPage={10} />
      </div>
    </div>
  );
}
