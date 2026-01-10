
"use client";
import { Trash2, Eye } from "lucide-react";
import { Pagination } from "@/components/Shared/Pagination";
import TranslatedText from "@/components/Shared/TranslatedText";
import { Skeleton } from "@/components/ui/skeleton";
import { Driver } from "@/types/driver";

interface DriverTableProps {
  data: Driver[];
  itemsPerPage?: number;
  isLoading?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView?: (driver: Driver) => void;
  onDelete?: (driver: Driver) => void;
}

export default function DriverTable({
  data,
  itemsPerPage = 10,
  isLoading = false,
  currentPage,
  onPageChange,
  onView,
  onDelete,
}: DriverTableProps) {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-[#E6F4EA] text-[#1E8E3E]";
      case "busy":
      case "assigned":
        return "bg-[#E8F0FE] text-[#1976D2]";
      case "ongoing":
        return "bg-[#E8F0FE] text-[#1976D2]";
      case "delivered":
        return "bg-[#E6F4EA] text-[#1E8E3E]";
      case "pending":
        return "bg-[#FFF4E5] text-[#F2994A]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "busy":
        return "Assigned";
      case "available":
        return "Available";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-[#F1F1F1] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#E9F4FF] border-b border-[#F1F1F1]">
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#1F2937]">
                <TranslatedText text="Vehicle Number" />
              </th>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#1F2937]">
                <TranslatedText text="Driver's Name" />
              </th>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#1F2937]">
                <TranslatedText text="Email" />
              </th>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#1F2937]">
                <TranslatedText text="Phone" />
              </th>
              <th className="px-6 py-4 text-center text-[14px] font-semibold text-[#1F2937]">
                <TranslatedText text="Total Delivery" />
              </th>
              <th className="px-6 py-4 text-center text-[14px] font-semibold text-[#1F2937]">
                <TranslatedText text="Active Delivery" />
              </th>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#1F2937]">
                <TranslatedText text="Status" />
              </th>
              <th className="px-6 py-4 text-center text-[14px] font-semibold text-[#1F2937]">
                <TranslatedText text="Action" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[14px]">
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </td>
                </tr>
              ))
            ) : currentItems.length > 0 ? (
              currentItems.map((driver) => (
                <tr
                  key={driver.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-[#4B5563]">
                    {driver.vehicle_number || "N/A"}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#111827]">
                    {driver.driver_name}
                  </td>
                  <td className="px-6 py-4 text-[#4B5563]">
                    {driver.driver_email}
                  </td>
                  <td className="px-6 py-4 text-[#4B5563]">
                    {driver.driver_phone}
                  </td>
                  <td className="px-6 py-4 text-center text-[#4B5563]">
                    {driver.stats?.total_deliveries || 0}
                  </td>
                  <td className="px-6 py-4 text-center text-[#4B5563]">
                    {driver.stats?.active_deliveries || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-medium ${getStatusStyle(
                        driver.driver_status
                      )}`}
                    >
                      <TranslatedText text={getStatusText(driver.driver_status)} />
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      {onView && (
                        <button
                          onClick={() => onView(driver)}
                          className="p-1.5 text-[#3B82F6] hover:bg-blue-50 border border-[#E5E7EB] rounded-md transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(driver)}
                          className="p-1.5 text-[#EF4444] hover:bg-red-50 border border-[#E5E7EB] rounded-md transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-secondary"
                >
                  <div className="flex flex-col items-center gap-2">
                    <TranslatedText text="No drivers found" />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-50">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentItemsCount={currentItems.length}
        />
      </div>
    </div>
  );
}
