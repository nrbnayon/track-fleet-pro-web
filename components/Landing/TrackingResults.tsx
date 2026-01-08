// components/landing/TrackingResults.tsx
"use client";

import { useState } from "react";
import { Package, MapPin, Clock, User, Phone, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FeedbackModal from "./FeedbackModal";
import ReportModal from "./ReportModal";

interface TrackingResultsProps {
    trackingNumber: string;
}

export default function TrackingResults({
    trackingNumber,
}: TrackingResultsProps) {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);

    // Mock data - replace with actual API call
    const trackingData = {
        date: "Dec 30, 2025 12:20 pm",
        parcelId: "12143253",
        invoice: "-",
        trackingCode: trackingNumber,
        weight: "1.5",
        cod: "$490",
        status: "Delivered",
        customer: {
            name: "Jahid Khan",
            address: "****Shyamoli, Dhaka",
            phone: "000-0000-000",
        },
        sender: {
            name: "Asif",
            address: "****Savar, Dhaka",
            phone: "000-0000-000",
        },
        assignedTo: {
            name: "Rahul",
            phone: "09234345345",
            avatar: "/avatars/rider.png",
        },
        updates: [
            {
                date: "Dec 30, 2025",
                time: "05:30 pm",
                status: "Consignment has been marked as delivered by rider.",
            },
            {
                date: "Dec 30, 2025",
                time: "03:30 pm",
                status: "Assigned to rider",
            },
            {
                date: "Dec 30, 2025",
                time: "02:30 pm",
                status: "Consignment has been received at DHANMONDI",
            },
            {
                date: "Dec 29, 2025",
                time: "05:30 pm",
                status: "Consignment sent to DHANMONDI Dispatch ID : 382526",
            },
            {
                date: "Dec 29, 2025",
                time: "05:30 pm",
                status: "Consignment sent to SAVAR WAREHOUSE Dispatch ID : 242526",
            },
            {
                date: "Dec 27, 2025",
                time: "03:30 pm",
                status: "Consignment status has been updated as pending",
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="text-sm text-secondary">
                        <p>{trackingData.date}</p>
                        <p>Parcel Id : {trackingData.parcelId}</p>
                        <p>Invoice : {trackingData.invoice}</p>
                        <p>Tracking Code : {trackingData.trackingCode}</p>
                    </div>
                    <div className="text-sm text-right">
                        <p className="text-secondary">Weight (KG) : {trackingData.weight}</p>
                        <p className="text-xl font-bold text-foreground mt-1">
                            COD : {trackingData.cod}
                        </p>
                        <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            {trackingData.status}
                        </Badge>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h3 className="text-center font-semibold text-foreground mb-3">
                        Customer Info
                    </h3>
                    <div className="space-y-1 text-sm">
                        <p>
                            <span className="font-medium">Name :</span>{" "}
                            {trackingData.customer.name}
                        </p>
                        <p>
                            <span className="font-medium">Address :</span>{" "}
                            {trackingData.customer.address}
                        </p>
                        <p>
                            <span className="font-medium">Phone Number :</span>{" "}
                            {trackingData.customer.phone}
                        </p>
                    </div>
                </div>

                {/* Sender Info */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h3 className="text-center font-semibold text-foreground mb-3">
                        Sender Info
                    </h3>
                    <div className="space-y-1 text-sm">
                        <p>
                            <span className="font-medium">Name :</span>{" "}
                            {trackingData.sender.name}
                        </p>
                        <p>
                            <span className="font-medium">Address :</span>{" "}
                            {trackingData.sender.address}
                        </p>
                        <p>
                            <span className="font-medium">Phone Number :</span>{" "}
                            {trackingData.sender.phone}
                        </p>
                    </div>
                </div>

                {/* Assigned To */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-center font-semibold text-foreground mb-3">
                        Assigned to
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                                <p className="font-medium">{trackingData.assignedTo.name}</p>
                                <p className="text-sm text-secondary flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    {trackingData.assignedTo.phone}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsFeedbackOpen(true)}
                                className="px-4 py-2 bg-blue-100 text-primary rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Feedback
                            </button>
                            <button
                                onClick={() => setIsReportOpen(true)}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                                Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Updates */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Tracking Updates
                </h2>
                <div className="relative">
                    {trackingData.updates.map((update, index) => (
                        <div key={index} className="flex gap-6 pb-8 last:pb-0">
                            {/* Timeline */}
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                                {index !== trackingData.updates.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-300 mt-2" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-2">
                                <p className="text-sm font-medium text-primary mb-1">
                                    {update.date}
                                </p>
                                <p className="text-sm text-secondary mb-2">{update.time}</p>
                                <p className="text-foreground">{update.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
            <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                riderName={trackingData.assignedTo.name}
            />
        </div>
    );
}