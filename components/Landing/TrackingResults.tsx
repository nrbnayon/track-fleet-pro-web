// components/landing/TrackingResults.tsx
"use client";

import { useState } from "react";
import { Package, Phone, MessageCircle, MessageCircleWarning, Home, Truck, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FeedbackModal from "./FeedbackModal";
import ReportModal from "./ReportModal";
import Image from "next/image";

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
            address: "Shyamoli, Dhaka",
            phone: "000-0000-000",
        },
        sender: {
            name: "Asif",
            address: "Savar, Dhaka",
            phone: "000-0000-000",
        },
        assignedTo: {
            name: "Rider Name",
            phone: "09234345345",
            avatar: "/images/avatar.png",
        },
        updates: [
            {
                date: "Dec 30, 2025",
                time: "05:30 pm",
                status: "Consignment has been marked as delivered by rider.",
                icon: "delivered",
            },
            {
                date: "Dec 30, 2025",
                time: "03:30 pm",
                status: "Assigned to rider",
                icon: "rider",
            },
            {
                date: "Dec 30, 2025",
                time: "02:30 pm",
                status: "Consignment has been received at DHANMONDI",
                icon: "warehouse",
            },
            {
                date: "Dec 29, 2025",
                time: "05:30 pm",
                status: "Consignment sent to DHANMONDI Dispatch ID : 382526",
                icon: "transit",
            },
            {
                date: "Dec 28, 2025",
                time: "05:30 pm",
                status: "Consignment sent to SAVAR WAREHOUSE Dispatch ID : 242526",
                icon: "transit",
            },
            {
                date: "Dec 27, 2025",
                time: "03:30 pm",
                status: "Consignment status has been updated as pending",
                icon: "pending",
            },
        ],
    };

    const getStatusIcon = (iconType: string, isActive: boolean) => {
        const iconClass = `${isActive ? 'text-white' : 'text-primary'}`;
        const size = 20;

        switch (iconType) {
            case "delivered":
                return <Home className={iconClass} size={size} />;
            case "rider":
                return <Truck className={iconClass} size={size} />;
            case "warehouse":
                return <MapPin className={iconClass} size={size} />;
            case "transit":
                return <Package className={iconClass} size={size} />;
            case "pending":
                return <Clock className={iconClass} size={size} />;
            default:
                return <Package className={iconClass} size={size} />;
        }
    };

    return (
        <div className="space-y-6 mt-16">
            {/* Header Info */}
            <div className="bg-white rounded-xl p-3 md:p-6 border border-border shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="text-sm text-secondary space-y-4">
                        <p>{trackingData.date}</p>
                        <p>Parcel Id : {trackingData.parcelId}</p>
                        <p>Invoice : {trackingData.invoice}</p>
                        <p>Tracking Code : {trackingData.trackingCode}</p>
                    </div>
                    <div className="text-sm text-right space-y-4">
                        <p></p>
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
                <div className="rounded-lg my-8 gap-4 md:gap-8">
                    <div className="w-full bg-[#DDEFFC] p-2 rounded-lg mb-6">
                        <h3 className="text-center font-semibold text-foreground">
                            Customer Info
                        </h3></div>
                    <div className="space-y-4 text-sm">
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
                <div className="rounded-lg my-8 gap-4 md:gap-8">
                    <div className="w-full bg-purple-200 p-2 rounded-lg mb-6">
                        <h3 className="text-center font-semibold text-foreground">
                            Sender Info
                        </h3></div>
                    <div className="space-y-4 text-sm">
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
                <div className="rounded-lg mt-8 gap-4 md:gap-8">
                    <div className="w-full bg-primary/30 p-2 rounded-lg mb-6">
                        <h3 className="text-center font-semibold text-foreground">
                            Assigned to
                        </h3></div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-300 flex items-center justify-center">
                                <Image src={trackingData.assignedTo.avatar} alt="driver" width={500} height={500} className="rounded-full" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="font-medium">{trackingData.assignedTo.name}</p>
                                <div className="flex items-center gap-1">
                                    <div className="flex items-center bg-primary/20 rounded-lg p-2"><Phone className="h-4 w-4 text-secondary fill-white" /></div>
                                    <p className="text-sm text-secondary flex items-center gap-1">
                                        {trackingData.assignedTo.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsReportOpen(true)}
                                className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-1 border border-red-300 cursor-pointer"
                            >
                                <MessageCircleWarning className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setIsFeedbackOpen(true)}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-400 transition-colors cursor-pointer"
                            >
                                Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Updates */}
            <div className="mt-8 md:mt-16">
                <h2 className="text-2xl font-bold text-center mb-6 md:mb-10">
                    Tracking Updates
                </h2>
                <div className="bg-white rounded-2xl shadow-xs p-4 md:p-10 border border-border">
                    <div className="w-full mx-auto">
                        {trackingData.updates.map((update, index) => {
                            const isFirst = index === 0;
                            const isLast = index === trackingData.updates.length - 1;
                            return (
                                <div key={index} className="relative flex gap-3 md:gap-6 pb-10 md:pb-12 last:pb-0">
                                    {/* Timeline with Icon */}
                                    <div className="flex flex-col items-center relative">
                                        <div
                                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${isFirst
                                                ? 'bg-primary shadow-lg shadow-primary/50 scale-105 md:scale-110'
                                                : 'bg-white border-2 border-primary'
                                                }`}
                                        >
                                            <div className="scale-75 md:scale-100">
                                                {getStatusIcon(update.icon, isFirst)}
                                            </div>
                                        </div>
                                        {!isLast && (
                                            <div className="absolute top-10 md:top-12 bottom-0 w-0.5 bg-linear-to-b from-primary to-blue-300" />
                                        )}
                                    </div>

                                    {/* Content Card */}
                                    <div className={`flex-1 transition-all duration-300 ${isFirst ? 'transform md:scale-[1.02]' : ''}`}>
                                        <div className={`rounded-xl p-4 md:p-5 border-2 transition-all duration-300 ${isFirst
                                            ? 'bg-blue-50 border-blue-300 shadow-md'
                                            : 'bg-gray-50 border-gray-200 hover:border-blue-200 hover:shadow-sm'
                                            }`}>
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 mb-2">
                                                <p className={`font-semibold ${isFirst ? 'text-blue-600 text-base md:text-lg' : 'text-primary'}`}>
                                                    {update.date}
                                                </p>
                                                {isFirst && (
                                                    <Badge className="bg-green-500 text-white px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs w-fit">
                                                        Latest
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs md:text-sm text-secondary mb-2 md:mb-3 flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                {update.time}
                                            </p>
                                            <p className={`text-sm md:text-base ${isFirst ? 'text-foreground font-medium' : 'text-gray-700'}`}>
                                                {update.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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

// ----- original design
{/* <div className="flex flex-col items-center gap-12 w-full max-w-[1200px]">
    <h2 className="[font-family:'Inter',Helvetica] font-semibold text-blackblack-500 text-[26px] text-center tracking-[0] leading-[normal]">
        Tracking Updates
    </h2>

    <Card className="w-full rounded-2xl border border-border">
        <CardContent className="flex items-center justify-center gap-[140px] px-0 py-[60px]">
            <div className="flex flex-col items-start gap-12">
                {trackingUpdates.map((update, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-start justify-center gap-2"
                    >
                        <p className="[font-family:'Inter',Helvetica] font-medium text-bluenormal text-base tracking-[0] leading-[normal] whitespace-nowrap">
                            {update.date}
                        </p>
                        <p className="[font-family:'Inter',Helvetica] font-medium text-bluenormal text-base tracking-[0] leading-[normal] whitespace-nowrap">
                            {update.time}
                        </p>
                    </div>
                ))}
            </div>

            <img
                className="flex-shrink-0"
                alt="Timeline"
                src="/frame-2147229846.svg"
            />

            <div className="flex flex-col items-start gap-[75px] w-[482px]">
                {trackingUpdates.map((update, index) => (
                    <p
                        key={index}
                        className="[font-family:'Inter',Helvetica] font-normal text-blackblack-400 text-base tracking-[0] leading-[19.2px]"
                    >
                        {update.description}
                    </p>
                ))}
            </div>
        </CardContent>
    </Card>
</div> */}