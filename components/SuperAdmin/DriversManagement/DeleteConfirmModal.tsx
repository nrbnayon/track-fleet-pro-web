"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driverName: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  driverName,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-[2px]">
      <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <AlertTriangle className="w-5 h-5" />
            Delete Driver
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8">
          <p className="text-[#4B5563] text-center mb-8 leading-relaxed">
            Are you sure you want to delete driver{" "}
            " <span className="font-bold text-[#111827]">{driverName}</span> "?{" "}
            <br />
            This action cannot be undone and all data will be removed.
          </p>

          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-[48px] rounded-[12px] border-[#E5E7EB] text-[#374151] font-semibold"
            >
              No, Keep It
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 h-[48px] rounded-[12px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold shadow-sm transition-all"
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
