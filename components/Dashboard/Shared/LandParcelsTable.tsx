// components/Dashboard/Shared/LandParcelsTable.tsx
"use client";
import { Pagination } from "@/components/Shared/Pagination";
import TranslatedText from "@/components/Shared/TranslatedText";
import { Skeleton } from "@/components/ui/skeleton";
import { LandParcel } from "@/types/land-parcel";
import { useUser } from "@/hooks/useUser";

interface LandParcelsTableProps {
  data: LandParcel[];
  itemsPerPage?: number;
  isLoading?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit?: (property: LandParcel) => void;
}

export default function LandParcelsTable({
  data,
  itemsPerPage = 10,
  isLoading = false,
  currentPage,
  onPageChange,
  onEdit,
}: LandParcelsTableProps) {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { hasRole } = useUser();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Agricultural":
        return "bg-[#F3F1FF] text-[#BB65FF]";
      case "Commercial":
        return "bg-[#DFECFF] text-[#799EFF]";
      case "Industrial":
        return "bg-[#E7E7FF] text-[#615FFF]";
      case "Residential":
        return "bg-[#DFFFEB] text-[#11B751]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getOwnershipColor = (status: string) => {
    switch (status) {
      case "Leased":
        return "bg-[#FF7782] text-white";
      case "Owned":
        return "bg-[#799EFF] text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <TranslatedText text="Parcel ID" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <TranslatedText text="Owner Name" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <TranslatedText text="Area (m²)" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <TranslatedText text="Zone" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <TranslatedText text="Type" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <TranslatedText text="Ownership" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <TranslatedText text="Registration Date" />
              </th>
              {onEdit && hasRole("admin") && (
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  <TranslatedText text="Action" />
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-16 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  {onEdit && hasRole("admin") && (
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded" />
                    </td>
                  )}
                </tr>
              ))
            ) : currentItems.length > 0 ? (
              currentItems.map((parcel) => (
                <tr
                  key={parcel.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-secondary">
                    {parcel.parcelId}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {parcel.ownerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {parcel.area.toLocaleString()} m²
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {parcel.zone}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getTypeColor(
                        parcel.type
                      )}`}
                    >
                      <TranslatedText text={parcel.type} />
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-medium ${getOwnershipColor(
                        parcel.ownership
                      )}`}
                    >
                      <TranslatedText text={parcel.ownership} />
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {parcel.registrationDate}
                  </td>
                  {onEdit && hasRole("admin") && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onEdit(parcel)}
                        className="px-3 py-1 text-xs font-medium rounded-md bg-primary-green text-white hover:bg-green-600 transition-colors"
                      >
                        <TranslatedText text="Edit" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={onEdit && hasRole("admin") ? 8 : 7}
                  className="px-6 py-8 text-center text-secondary"
                >
                  <TranslatedText text="No records found" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentItemsCount={currentItems.length}
      />
    </div>
  );
}
