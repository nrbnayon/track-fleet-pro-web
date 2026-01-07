// components\Dashboard\Home\LandParcelsTable.tsx
"use client";

import { useState, useEffect } from "react";
import { landParcelsData } from "@/data/landParcelsData";
import LandParcelsTable from "@/components/Dashboard/Shared/LandParcelsTable";

interface LandParcelsTableProps {
  itemsPerPage?: number;
}

export default function LandParcelsTableHome({ itemsPerPage = 10 }: LandParcelsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <LandParcelsTable
      data={landParcelsData}
      itemsPerPage={itemsPerPage}
      isLoading={isLoading}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
  );
}
