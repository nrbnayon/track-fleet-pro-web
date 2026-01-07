// components/Dashboard/DataManagement/ExportDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, FileText, Table, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import TranslatedText from "@/components/Shared/TranslatedText";
import { LandParcel } from "@/types/land-parcel";
import { exportToPDF, exportToCSV, exportToExcel } from "@/lib/exportUtils";

interface ExportDropdownProps {
  data: LandParcel[];
}

export default function ExportDropdown({ data }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = (format: "pdf" | "csv" | "excel") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `land_parcels_${timestamp}`;

    switch (format) {
      case "pdf":
        exportToPDF(data, `${filename}.pdf`);
        break;
      case "csv":
        exportToCSV(data, `${filename}.csv`);
        break;
      case "excel":
        exportToExcel(data, `${filename}.xlsx`);
        break;
    }

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md px-4 py-2 bg-green-50 text-primary-green hover:bg-green-100 hover:text-green-600 font-medium flex items-center gap-2"
      >
        <TranslatedText text="Export" />
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => handleExport("pdf")}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-foreground transition-colors"
          >
            <FileText className="w-4 h-4 text-red-500" />
            <TranslatedText text="Export as PDF" />
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-foreground transition-colors"
          >
            <Table className="w-4 h-4 text-green-500" />
            <TranslatedText text="Export as CSV" />
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-foreground transition-colors"
          >
            <Sheet className="w-4 h-4 text-blue-500" />
            <TranslatedText text="Export as Excel" />
          </button>
        </div>
      )}
    </div>
  );
}