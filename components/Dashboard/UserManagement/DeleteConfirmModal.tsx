// components/Dashboard/UserManagement/DeleteConfirmModal.tsx
"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TranslatedText from "@/components/Shared/TranslatedText";
import { User } from "@/types/users";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  user,
}: DeleteConfirmModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                <TranslatedText text="Delete User" />
              </h3>
              <p className="text-sm text-secondary">
                <TranslatedText text="This action cannot be undone" />
              </p>
            </div>
          </div>

          <p className="text-sm text-secondary mb-6">
            <TranslatedText text="Are you sure you want to delete" />{" "}
            <span className="font-semibold text-foreground">{user.name}</span>?{" "}
            <TranslatedText text="All associated data will be permanently removed" />
            .
          </p>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              <TranslatedText text="Cancel" />
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
            >
              <TranslatedText text="Delete" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
