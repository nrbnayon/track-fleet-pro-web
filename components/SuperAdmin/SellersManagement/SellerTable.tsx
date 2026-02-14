
"use client";
import { Trash2, Eye, Pencil } from "lucide-react";
import { Pagination } from "@/components/Shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Seller } from "@/types/seller";

interface SellerTableProps {
    data: Seller[];
    itemsPerPage?: number;
    isLoading?: boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
    onView?: (seller: Seller) => void;
    onEdit?: (seller: Seller) => void;
    onDelete?: (seller: Seller) => void;
}

export default function SellerTable({
    data,
    itemsPerPage = 10,
    isLoading = false,
    currentPage,
    onPageChange,
    onView,
    onEdit,
    onDelete,
}: SellerTableProps) {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    return (
        <div className="bg-white rounded-none shadow-none border border-none overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#E8F4FD] border-none">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                                Seller's Name
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                                Business Name
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                                Phone
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                                Address
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-foreground whitespace-nowrap">
                                Total Delivery
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-foreground whitespace-nowrap">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {isLoading ? (
                            Array.from({ length: itemsPerPage }).map((_, index) => (
                                <tr key={`skeleton-${index}`}>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                                    <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded" />
                                            <Skeleton className="h-8 w-8 rounded" />
                                            <Skeleton className="h-8 w-8 rounded" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : currentItems.length > 0 ? (
                            currentItems.map((seller) => (
                                <tr
                                    key={seller.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        {seller.seller_name}
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        {seller.business_name}
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        {seller.seller_email}
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        {seller.seller_phone}
                                    </td>
                                    <td className="px-6 py-4 text-secondary max-w-xs truncate">
                                        {seller.seller_address || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-center text-secondary">
                                        {seller.stats?.total_parcels || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            {onView && (
                                                <button
                                                    onClick={() => onView(seller)}
                                                    className="p-1.5 text-primary hover:bg-blue-50 border border-[#E5E7EB] rounded-md transition-colors cursor-pointer"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(seller)}
                                                    className="p-1.5 text-orange-500 hover:bg-orange-50 border border-[#E5E7EB] rounded-md transition-colors cursor-pointer"
                                                    title="Edit Seller"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(seller)}
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
                                    colSpan={7}
                                    className="px-6 py-12 text-center text-secondary"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        No sellers found
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
