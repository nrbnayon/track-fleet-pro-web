
"use client";
import React from "react";
import { X, AlertTriangle } from "lucide-react";
import TranslatedText from "@/components/Shared/TranslatedText";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    sellerName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    sellerName,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-end p-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-8 pb-10 text-center">
                    <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <h3 className="text-[22px] font-bold text-[#111827] mb-3">
                        <TranslatedText text="Delete Seller" />
                    </h3>
                    <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
                        <TranslatedText text="Are you sure you want to delete" />{" "}
                        <span className="font-semibold text-gray-900">"{sellerName}"</span>?{" "}
                        <TranslatedText text="This action cannot be undone." />
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 h-[52px] rounded-[12px] border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                            <TranslatedText text="No, Keep It" />
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 h-[52px] rounded-[12px] bg-red-500 text-white font-semibold hover:bg-red-600 transition-all shadow-md shadow-red-200"
                        >
                            <TranslatedText text="Yes, Delete" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
