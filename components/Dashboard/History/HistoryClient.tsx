// components/Dashboard/History/HistoryClient.tsx
"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { historyData } from "@/data/historyData";
import TranslatedText from "@/components/Shared/TranslatedText";
import { HistoryRecord } from "@/types/history";
import { HugeiconsIcon } from "@hugeicons/react";
import { DownloadIcon } from "@hugeicons/core-free-icons";

interface HistoryClientProps {
  itemsPerPage?: number;
}

export default function HistoryClient({
  itemsPerPage = 10,
}: HistoryClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] =
    useState<HistoryRecord[]>(historyData);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Success" | "Warning" | "Error"
  >("All");
  const [searchFileName, setSearchFileName] = useState("");

  // Simulate loading
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Filter data based on status and search
  useEffect(() => {
    let filtered = historyData;

    if (statusFilter !== "All") {
      filtered = filtered.filter((record) => record.status === statusFilter);
    }

    if (searchFileName.trim()) {
      filtered = filtered.filter((record) =>
        record.fileName.toLowerCase().includes(searchFileName.toLowerCase())
      );
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredData(filtered);
  }, [statusFilter, searchFileName]);

  const getStatusIcon = (status: string) => {
    if (status === "Success") {
      return (
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            Success
          </span>
        </div>
      );
    } else if (status === "Warning") {
      return (
        <div className="flex items-center gap-2">
          <AlertCircleIcon className="w-5 h-5 text-yellow-500" />
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
            Warning
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <AlertCircleIcon className="w-5 h-5 text-red-500" />
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
            Error
          </span>
        </div>
      );
    }
  };

  const displayedRecords = filteredData.slice(0, itemsPerPage);

  return (
    <div className="space-y-6">

      {/* Filters Section */}
      <div className="rounded-lg border border-border p-6 bg-white">
        <div className="space-y-6">
          {/* Search Section */}
          <div>
            <label className="text-sm font-medium text-secondary mb-2 block">
              <TranslatedText text="Search by File Name" />
            </label>
            <input
              type="text"
              placeholder="land_data_september_2024.xlsx"
              value={searchFileName}
              onChange={(e) => setSearchFileName(e.target.value)}
              className="w-full max-w-sm px-4 py-2 rounded-md border border-input bg-transparent text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-secondary mb-3 block">
              <TranslatedText text="Filter by Status" />
            </label>
            <div className="flex flex-wrap gap-3">
              {(["All", "Success", "Warning", "Error"] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-green-100 text-green-700 border-green-300 border"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-150"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="rounded-lg border border-border p-6 bg-white">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          <TranslatedText text="Details" />
        </h2>
        <p className="text-secondary text-sm mb-6">
          <TranslatedText text="Update your photo and categories details here." />
        </p>

        {/* Records List */}
        <div className="space-y-4">
          {isLoading ? (
            // Skeleton Loaders
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border border-border rounded-lg p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : displayedRecords.length > 0 ? (
            displayedRecords.map((record) => (
              <div
                key={record.id}
                className={`border rounded-lg p-6 transition-all hover:shadow-md ${
                  record.status === "Warning"
                    ? "border-yellow-300 bg-yellow-50"
                    : record.status === "Error"
                    ? "border-red-300 bg-red-50"
                    : "border-border bg-white"
                }`}
              >
                {/* File Name and Status */}
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <HugeiconsIcon
                      icon={DownloadIcon}
                      size={20}
                      color="#49AB41"
                      strokeWidth={1.5}
                    />
                    <span className="font-semibold text-foreground truncate">
                      {record.fileName}
                    </span>
                  </div>
                  {getStatusIcon(record.status)}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <p className="text-xs text-secondary font-medium mb-1">
                      <TranslatedText text="Upload Date" />
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {record.uploadDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-medium mb-1">
                      <TranslatedText text="Uploaded By" />
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {record.uploadedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-medium mb-1">
                      <TranslatedText text="Record Count" />
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {record.recordCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-medium mb-1">
                      <TranslatedText text="Status" />
                    </p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {record.status}
                    </p>
                  </div>
                </div>

                {/* Issues Section */}
                {record.issues && record.issues.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-yellow-700 font-semibold mb-2">
                      <TranslatedText text="Issues detected:" />
                    </p>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {record.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary">
                <TranslatedText text="No records found." />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
