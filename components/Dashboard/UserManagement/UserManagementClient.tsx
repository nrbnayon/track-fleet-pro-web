// components/Dashboard/UserManagement/UserManagementClient.tsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { usersData } from "@/data/usersData";
import TranslatedText from "@/components/Shared/TranslatedText";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, UserFormData } from "@/types/users";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
import UsersTable from "./UsersTable";
import UserModal from "./UserModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface UserManagementClientProps {
  itemsPerPage?: number;
}

export default function UserManagementClient({
  itemsPerPage = 10,
}: UserManagementClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(usersData);
  const [filteredData, setFilteredData] = useState<User[]>(usersData);
  const [searchUser, setSearchUser] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    let filtered = users;

    if (searchUser.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
          user.email.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchUser, users]);

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

  const handleAddUser = () => {
    setModalMode("create");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (data: UserFormData) => {
    if (modalMode === "create") {
      const newUser: User = {
        id: `${users.length + 1}`,
        name: data.name,
        email: data.email,
        role: data.role,
        status: "Active",
        date: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
      console.log("Creating new user:", newUser);
    } else if (selectedUser) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, name: data.name, email: data.email, role: data.role }
          : user
      );
      setUsers(updatedUsers);
      console.log("Updating user:", { ...selectedUser, ...data });
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      console.log("Deleting user:", userToDelete);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Add Section */}
      <div className="flex justify-between items-center gap-4 p-5 bg-white rounded-lg border border-border">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
          <Input
            type="text"
            placeholder="Search"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="pl-10 w-full md:w-60"
          />
        </div>
        <Button
          className="bg-primary-green text-white hover:bg-green-600"
          onClick={handleAddUser}
        >
          <HugeiconsIcon icon={AddSquareIcon} />
          <TranslatedText text="Add User" />
        </Button>
      </div>

      {/* Users Table */}
      <UsersTable
        data={filteredData}
        itemsPerPage={itemsPerPage}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onEdit={handleEditUser}
        onDelete={handleDeleteClick}
      />

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        user={userToDelete}
      />
    </div>
  );
}
