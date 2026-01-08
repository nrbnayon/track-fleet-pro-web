// components/Landing/ReportModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    riderName?: string;
}

export default function ReportModal({
    isOpen,
    onClose,
    riderName = "the rider",
}: ReportModalProps) {
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reportReasons = [
        { id: "scam", label: "Scam" },
        { id: "pretending", label: "Pretending to be someone" },
        { id: "late", label: "Did not appeared on time" },
        { id: "harassment", label: "Harassment" },
        { id: "hate-speech", label: "Hate Speech" },
        { id: "verbal-abuse", label: "Verbal Abuse" },
        { id: "other", label: "Other" },
    ];

    const toggleReason = (reasonId: string) => {
        setSelectedReasons((prev) =>
            prev.includes(reasonId)
                ? prev.filter((id) => id !== reasonId)
                : [...prev, reasonId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedReasons.length === 0) {
            toast.error("Please select at least one reason");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Report submitted:", {
            reasons: selectedReasons,
            additionalInfo,
            riderName,
        });

        toast.success("Report submitted successfully", {
            description: "We will review your report and take appropriate action.",
        });

        // Reset form
        setSelectedReasons([]);
        setAdditionalInfo("");
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl border-none">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Spam & Report
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Report Reasons */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-3">
                                Report an issue
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {reportReasons.map((reason) => (
                                    <button
                                        key={reason.id}
                                        type="button"
                                        onClick={() => toggleReason(reason.id)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedReasons.includes(reason.id)
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        disabled={isSubmitting}
                                    >
                                        {reason.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-3">
                                Tell us more
                            </h3>
                            <Textarea
                                placeholder="Please explain your reason in more detail"
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                className="min-h-[100px] resize-none"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Warning Message */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-xs text-amber-800">
                                We won't let the person know who reported them. If someone is in
                                immediate danger, call local emergency services. Don't wait.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full"
                            disabled={isSubmitting || selectedReasons.length === 0}
                        >
                            {isSubmitting ? "Submitting..." : "Submit My Report"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}