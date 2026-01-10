
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TranslatedText from "@/components/Shared/TranslatedText";
import { Seller } from "@/types/seller";

interface SellerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Seller>) => void;
    seller: Seller | null;
    mode: "create" | "view" | "edit";
}

export default function SellerModal({
    isOpen,
    onClose,
    onSave,
    seller,
    mode,
}: SellerModalProps) {
    const [formData, setFormData] = useState<Partial<Seller>>({
        seller_name: "",
        seller_email: "",
        seller_phone: "",
        seller_address: "",
        business_name: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if ((mode === "view" || mode === "edit") && seller) {
            setFormData({
                seller_name: seller.seller_name,
                seller_email: seller.seller_email,
                seller_phone: seller.seller_phone,
                seller_address: seller.seller_address,
                business_name: seller.business_name,
                stats: seller.stats,
            });
        } else {
            setFormData({
                seller_name: "",
                seller_email: "",
                seller_phone: "",
                seller_address: "",
                business_name: "",
            });
        }
        setErrors({});
    }, [mode, seller, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.seller_name?.trim()) {
            newErrors.seller_name = "Seller name is required";
        }

        if (!formData.seller_email?.trim()) {
            newErrors.seller_email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.seller_email)) {
            newErrors.seller_email = "Invalid email format";
        }

        if (!formData.seller_phone?.trim()) {
            newErrors.seller_phone = "Phone is required";
        }

        if (!formData.seller_address?.trim()) {
            newErrors.seller_address = "Address is required";
        }

        if (!formData.business_name?.trim()) {
            newErrors.business_name = "Business name is required";
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
                                    ? "Add New Seller"
                                    : mode === "edit"
                                        ? "Edit Seller"
                                        : "Seller Details"
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
                        {/* Seller Name */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                                <TranslatedText text="Seller Name" />
                            </label>
                            <Input
                                type="text"
                                name="seller_name"
                                value={formData.seller_name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                disabled={mode === "view"}
                                className={`h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 focus:ring-[#3B82F6] ${errors.seller_name ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.seller_name && (
                                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.seller_name}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                                <TranslatedText text="Address" />
                            </label>
                            <Input
                                type="text"
                                name="seller_address"
                                value={formData.seller_address}
                                onChange={handleChange}
                                placeholder="Shyamoli, Dhaka"
                                disabled={mode === "view"}
                                className={`h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 focus:ring-[#3B82F6] ${errors.seller_address ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.seller_address && (
                                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.seller_address}</p>
                            )}
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                                <TranslatedText text="Email Address" />
                            </label>
                            <Input
                                type="email"
                                name="seller_email"
                                value={formData.seller_email}
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                disabled={mode === "view"}
                                className={`h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 focus:ring-[#3B82F6] ${errors.seller_email ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.seller_email && (
                                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.seller_email}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                                <TranslatedText text="Phone Number" />
                            </label>
                            <Input
                                type="text"
                                name="seller_phone"
                                value={formData.seller_phone}
                                onChange={handleChange}
                                placeholder="000-0000-000"
                                disabled={mode === "view"}
                                className={`h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 focus:ring-[#3B82F6] ${errors.seller_phone ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.seller_phone && (
                                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.seller_phone}</p>
                            )}
                        </div>

                        {/* Business Name */}
                        <div className={mode === "view" ? "" : "md:col-span-2"}>
                            <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                                <TranslatedText text="Business Name" />
                            </label>
                            <Input
                                type="text"
                                name="business_name"
                                value={formData.business_name}
                                onChange={handleChange}
                                placeholder="Natives"
                                disabled={mode === "view"}
                                className={`h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 focus:ring-[#3B82F6] ${errors.business_name ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.business_name && (
                                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.business_name}</p>
                            )}
                        </div>

                        {/* Total Delivery Only in View Mode */}
                        {mode === "view" && (
                            <div>
                                <label className="block text-sm font-semibold text-[#374151] mb-2.5">
                                    <TranslatedText text="Total Delivery" />
                                </label>
                                <Input
                                    type="text"
                                    value={formData.stats?.total_parcels || 0}
                                    disabled
                                    className="h-[52px] rounded-[12px] border-[#E5E7EB] bg-white px-4 opacity-100"
                                />
                            </div>
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
                                        ? "Add Seller"
                                        : mode === "edit"
                                            ? "Update Seller"
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
