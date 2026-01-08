// app/(roles)/admin/upload-data/page.tsx
"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";
import DataManagementClient from "@/components/Dashboard/DataManagement/DataManagementClient";
import DataUploadClient from "@/components/Dashboard/DataManagement/DataUploadClient";
import ExportDropdown from "@/components/Dashboard/DataManagement/ExportDropdown";
import { landParcelsData } from "@/data/landParcelsData";
import TranslatedText from "@/components/Shared/TranslatedText";

export default function UploadDataPage() {
  const [activeTab, setActiveTab] = useState<"management" | "upload">(
    "management"
  );

  return (
    <div className="h-screen">
      <DashboardHeader
        title="Data Management"
        description="Add, edit, and manage property records"
      />

      <div className="p-4 md:px-8 md:py-6">
        {/* Tabs and Export Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 bg-white rounded-lg p-1 border border-border">
            <button
              onClick={() => setActiveTab("management")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "management"
                ? "bg-primary-green text-white"
                : "text-secondary hover:text-foreground"
                }`}
            >
              <TranslatedText text="Data Management" />
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "upload"
                ? "bg-primary-green text-white"
                : "text-secondary hover:text-foreground"
                }`}
            >
              <TranslatedText text="Data Upload" />
            </button>
          </div>

          {activeTab === "management" && (
            <ExportDropdown data={landParcelsData} />
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "management" ? (
          <DataManagementClient itemsPerPage={10} />
        ) : (
          <DataUploadClient />
        )}
      </div>
    </div>
  );
}
