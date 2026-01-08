// components/Landing/FeedbackModal.tsx
"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({
    isOpen,
    onClose,
}: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Feedback submitted:", { rating, feedback });

        toast.success("Thank you for your feedback!", {
            description: "Your feedback helps us improve our service.",
        });

        // Reset form
        setRating(0);
        setHoveredRating(0);
        setFeedback("");
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        We appreciate your feedback.
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-center text-gray-600 mb-6">
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
                            {isSubmitting ? "Submitting..." : "Submit My Feedback"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}