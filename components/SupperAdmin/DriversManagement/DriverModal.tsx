"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TranslatedText from "@/components/Shared/TranslatedText";
import { Driver } from "@/types/driver";

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Driver>) => void;
  driver: Driver | null;
  mode: "create" | "view" | "edit";
}

export default function DriverModal({
  isOpen,
  onClose,
  onSave,
  driver,
  mode,
}: DriverModalProps) {
  const [formData, setFormData] = useState<Partial<Driver>>({
    driver_name: "",
    driver_email: "",
    driver_phone: "",
    vehicle_number: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && driver) {
      setFormData({
        driver_name: driver.driver_name,
        driver_email: driver.driver_email,
        driver_phone: driver.driver_phone,
        vehicle_number: driver.vehicle_number,
        stats: driver.stats,
      });
    } else {
      setFormData({
        driver_name: "",
        driver_email: "",
        driver_phone: "",
        vehicle_number: "",
      });
    }
    setErrors({});
  }, [mode, driver, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.driver_name?.trim()) {
      newErrors.driver_name = "Name is required";
    }

    if (!formData.driver_email?.trim()) {
      newErrors.driver_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.driver_email)) {
      newErrors.driver_email = "Invalid email format";
    }

    if (!formData.driver_phone?.trim()) {
      newErrors.driver_phone = "Phone is required";
    }

    if (!formData.vehicle_number?.trim()) {
      newErrors.vehicle_number = "Vehicle number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") {
      onClose();
      return;
    }
    if (validateForm()) {
      onSave(formData);
      onClose();
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-[2px]">
      <div className="bg-white rounded-[24px] w-full max-w-[650px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
          <h2 className="text-[20px] font-bold text-[#111827]">
            <TranslatedText
              text={
                mode === "create"
                  ? "Add New Driver"
                  : mode === "edit"
                    ? "Edit Driver"
                    : "Driver Details"
              }
            />
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Name */}
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                <TranslatedText text="Driver Name" />
              </label>
              <Input
                type="text"
                name="driver_name"
                value={formData.driver_name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={mode === "view"}
                className={`h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 focus:ring-[#3B82F6] ${errors.driver_name ? "border-red-500" : ""
                  }`}
              />
              {errors.driver_name && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.driver_name}</p>
              )}
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                <TranslatedText text="Vehicle Number" />
              </label>
              <Input
                type="text"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                placeholder="DRV2024001"
                disabled={mode === "view"}
                className={`h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 focus:ring-[#3B82F6] ${errors.vehicle_number ? "border-red-500" : ""
                  }`}
              />
              {errors.vehicle_number && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.vehicle_number}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                <TranslatedText text="Email Address" />
              </label>
              <Input
                type="email"
                name="driver_email"
                value={formData.driver_email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                disabled={mode === "view"}
                className={`h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 focus:ring-[#3B82F6] ${errors.driver_email ? "border-red-500" : ""
                  }`}
              />
              {errors.driver_email && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.driver_email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                <TranslatedText text="Phone" />
              </label>
              <Input
                type="text"
                name="driver_phone"
                value={formData.driver_phone}
                onChange={handleChange}
                placeholder="000-0000-000"
                disabled={mode === "view"}
                className={`h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 focus:ring-[#3B82F6] ${errors.driver_phone ? "border-red-500" : ""
                  }`}
              />
              {errors.driver_phone && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.driver_phone}</p>
              )}
            </div>

            {/* Stats Only in View Mode */}
            {mode === "view" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                    <TranslatedText text="Total Delivery" />
                  </label>
                  <Input
                    type="text"
                    value={formData.stats?.total_deliveries || 0}
                    disabled
                    className="h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 opacity-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                    <TranslatedText text="Active Delivery" />
                  </label>
                  <Input
                    type="text"
                    value={formData.stats?.active_deliveries || 0}
                    disabled
                    className="h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 opacity-100"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="h-[48px] px-8 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-[10px] font-semibold text-[15px] transition-all"
            >
              <TranslatedText
                text={
                  mode === "create"
                    ? "Add Driver"
                    : mode === "edit"
                      ? "Update Driver"
                      : "Done"
                }
              />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
