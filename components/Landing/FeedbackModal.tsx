// components/Landing/FeedbackModal.tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useCreateReviewMutation } from "@/redux/services/parcelApi";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    driverId?: string;
    driverName?: string;
}

export default function FeedbackModal({
    isOpen,
    onClose,
    driverId,
    driverName,
}: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const router = useRouter();
    
    const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!driverId) {
            toast.error("Driver information missing");
            return;
        }

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        try {
            const result = await createReview({
                driverId,
                rating,
                comment: feedback,
            }).unwrap();

            if (result.success) {
                toast.success("Thank you for your feedback!", {
                    description: result.message || `Review submitted for ${driverName}`,
                });
                
                // Reset form
                setRating(0);
                setHoveredRating(0);
                setFeedback("");
                onClose();
            }
        } catch (error: any) {
            console.error("Feedback submission error:", error);
            
            if (error?.status === 401) {
                toast.error("Authentication required", {
                    description: "Please login to provide a rating and review.",
                });
                router.push("/login");
            } else {
                toast.error(error?.data?.message || "Could not submit your feedback. Please try again later.");
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl border-none">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        We appreciate your feedback.
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-center text-secondary mb-6">
                        We are always looking for ways to improve your experience. Please
                        take a moment to evaluate and tell us what you think.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Star Rating */}
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Feedback Textarea */}
                        <div>
                            <Textarea
                                placeholder="What can we do to improve your experience?"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="min-h-[120px] resize-none"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full"
                            disabled={isSubmitting || rating === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : "Submit My Feedback"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}