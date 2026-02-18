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

import { useReportIssueMutation } from "@/redux/services/parcelApi";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    driverId?: string;
    riderName?: string;
}

export default function ReportModal({
    isOpen,
    onClose,
    driverId,
}: ReportModalProps) {
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [additionalInfo, setAdditionalInfo] = useState("");
    const router = useRouter();

    const [reportIssue, { isLoading: isSubmitting }] = useReportIssueMutation();

    const reportReasons = [
        { id: "SCAM", label: "Scam" },
        { id: "PRETENDING TO BE SOMEONE", label: "Pretending to be someone" },
        { id: "LATE", label: "Did not appeared on time" },
        { id: "HARASSMENT", label: "Harassment" },
        { id: "HATE SPEECH", label: "Hate Speech" },
        { id: "VERBAL ABUSE", label: "Verbal Abuse" },
        { id: "OTHERS", label: "Other" },
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

        if (!driverId) {
            toast.error("Driver information missing");
            return;
        }

        if (selectedReasons.length === 0) {
            toast.error("Please select at least one reason");
            return;
        }

        try {
            const result = await reportIssue({
                driverId,
                report: selectedReasons.join(", "),
                comment: additionalInfo,
            }).unwrap();

            toast.success("Report submitted successfully", {
                description: result.message || "We will review your report and take appropriate action.",
            });

            // Reset form
            setSelectedReasons([]);
            setAdditionalInfo("");
            onClose();
        } catch (error: any) {
            console.error("Report submission error:", error);
            
            if (error?.status === 401) {
                toast.error("Authentication required", {
                    description: "Please login to report an issue.",
                });
                router.push("/login");
            } else {
                toast.error(error?.data?.message || "Could not submit your report. Please try again later.");
            }
        }
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
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : "Submit My Report"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}