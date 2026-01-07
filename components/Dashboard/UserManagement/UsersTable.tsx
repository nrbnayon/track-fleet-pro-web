// components/Dashboard/UserManagement/UsersTable.tsx
"use client";

import { Trash2, Pencil } from "lucide-react";
import { Pagination } from "@/components/Shared/Pagination";
import TranslatedText from "@/components/Shared/TranslatedText";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/users";

interface UsersTableProps {
  data: User[];
  itemsPerPage?: number;
  isLoading?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UsersTable({
  data,
  itemsPerPage = 10,
  isLoading = false,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-[#799EFF] text-white";
      case "Analyst":
        return "bg-[#FF7782] text-white";
      case "Guest":
        return "bg-gray-400 text-white";
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
                <TranslatedText text="Name" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <TranslatedText text="Email" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <TranslatedText text="Role" />
              </th>
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  <TranslatedText text="Actions" />
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : currentItems.length > 0 ? (
              currentItems.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      <TranslatedText text={user.role} />
                    </span>
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(user)}
                            className="p-2 text-gray-400 hover:text-primary-green hover:bg-green-50 rounded-md transition-colors cursor-pointer"
                            title="Edit user"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(user)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={onEdit || onDelete ? 4 : 3}
                  className="px-6 py-8 text-center text-secondary"
                >
                  <TranslatedText text="No users found" />
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
