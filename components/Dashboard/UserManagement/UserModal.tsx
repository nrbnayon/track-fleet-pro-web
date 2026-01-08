// components/Dashboard/UserManagement/UserModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TranslatedText from "@/components/Shared/TranslatedText";
import { User, UserFormData } from "@/types/users";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  user: User | null;
  mode: "create" | "edit";
}

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  user,
  mode,
}: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "Admin",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    role?: string;
  }>({});

  useEffect(() => {
    if (mode === "edit" && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "Admin",
      });
    }
    setErrors({});
  }, [mode, user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // if (!formData.role) {
    //   newErrors.role = "Role is required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-foreground">
            <TranslatedText
              text={mode === "create" ? "Add User" : "Edit User"}
            />
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              <TranslatedText text="Name" />{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              <TranslatedText text="Email" />{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@city.gov"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              <TranslatedText text="Role" />
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full h-11 px-3 py-1 rounded-md border border-input bg-transparent text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer"
            >
              <option value="Analyst">Analyst</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <TranslatedText text="Cancel" />
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-primary-green text-white hover:bg-green-600"
            >
              <TranslatedText text="Save" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
