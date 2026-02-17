// components/landing/TrackingResults.tsx
"use client";

import { useState } from "react";
import { Package, Phone,  MessageCircleWarning, Home, Truck, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FeedbackModal from "./FeedbackModal";
import ReportModal from "./ReportModal";
import Image from "next/image";
import { motion } from "framer-motion";

import { TrackParcelResponse } from "@/types/parcel";

interface TrackingResultsProps {
    trackingData: TrackParcelResponse;
}

export default function TrackingResults({
    trackingData,
}: TrackingResultsProps) {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);

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
        <motion.div 
            className="space-y-6 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Header Info */}
            <motion.div 
                className="bg-white rounded-xl p-3 md:p-6 border border-border shadow-xs"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <motion.div 
                        className="text-sm text-secondary space-y-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <p>{trackingData.date}</p>
                        <p>Parcel Id : {trackingData.parcelId}</p>
                        {/* <p>Invoice : {trackingData.invoice}</p> */}
                        <p>Tracking Code : {trackingData.trackingCode}</p>
                    </motion.div>
                    <motion.div 
                        className="text-sm text-right space-y-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <p></p>
                        <p className="text-secondary">Weight (KG) : {trackingData.weight}</p>
                        {/* <p className="text-xl font-bold text-foreground mt-1">
                            COD : {trackingData.cod}
                        </p> */}
                        <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            {trackingData.status}
                        </Badge>
                    </motion.div>
                </div>

                {/* Customer Info */}
                <motion.div 
                    className="rounded-lg my-8 gap-4 md:gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
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
                </motion.div>

                {/* Sender Info */}
                <motion.div 
                    className="rounded-lg my-8 gap-4 md:gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
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
                </motion.div>

                {/* Assigned To */}
                <motion.div 
                    className="rounded-lg mt-8 gap-4 md:gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="w-full bg-primary/30 p-2 rounded-lg mb-6">
                        <h3 className="text-center font-semibold text-foreground">
                            Assigned to
                        </h3></div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                {trackingData.assignedTo?.avatar && trackingData.assignedTo.avatar.startsWith('/') || trackingData.assignedTo?.avatar?.startsWith('http') ? (
                                    <Image 
                                        src={trackingData.assignedTo.avatar} 
                                        alt="driver" 
                                        width={200} 
                                        height={200} 
                                        quality={100}
                                        unoptimized
                                        className="rounded-full w-full h-full object-cover" 
                                    />
                                ) : (
                                    <Image 
                                        src="/drivers/driver.jpg" 
                                        alt="driver" 
                                        width={200} 
                                        height={200} 
                                        quality={100}
                                        unoptimized
                                        className="rounded-full w-full h-full object-cover" 
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="font-medium">{trackingData.assignedTo?.name || "Not assigned yet"}</p>
                                {trackingData.assignedTo?.phone && (
                                    <div className="flex items-center gap-1">
                                        <div className="flex items-center bg-primary/20 rounded-lg p-2"><Phone className="h-4 w-4 text-secondary fill-white" /></div>
                                        <p className="text-sm text-secondary flex items-center gap-1">
                                            {trackingData.assignedTo.phone}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <motion.button
                                onClick={() => setIsReportOpen(true)}
                                className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-1 border border-red-300 cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <MessageCircleWarning className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                                onClick={() => setIsFeedbackOpen(true)}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-400 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Review
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Tracking Updates */}
            <motion.div 
                className="mt-8 md:mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
                <motion.h2 
                    className="text-2xl font-bold text-center mb-6 md:mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    Tracking Updates
                </motion.h2>
                <motion.div 
                    className="bg-white rounded-2xl shadow-xs p-4 md:p-10 border border-border"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                >
                    <div className="w-full mx-auto">
                        {trackingData.updates.map((update, index) => {
                            const isFirst = index === 0;
                            const isLast = index === trackingData.updates.length - 1;
                            return (
                                <motion.div 
                                    key={index} 
                                    className="relative flex gap-3 md:gap-6 pb-10 md:pb-12 last:pb-0"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ 
                                        duration: 0.5, 
                                        delay: 1 + index * 0.1,
                                        ease: "easeOut" 
                                    }}
                                >
                                    {/* Timeline with Icon */}
                                    <div className="flex flex-col items-center relative">
                                        <motion.div
                                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${isFirst
                                                ? 'bg-primary shadow-lg shadow-primary/50 scale-105 md:scale-110'
                                                : 'bg-white border-2 border-primary'
                                                }`}
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: isFirst ? [1, 1.1, 1] : 1, rotate: 0 }}
                                            transition={{ 
                                                duration: 0.6, 
                                                delay: 1 + index * 0.1 + 0.2,
                                                scale: isFirst ? {
                                                    repeat: Infinity,
                                                    repeatDelay: 2,
                                                    duration: 1
                                                } : {}
                                            }}
                                            whileHover={{ scale: 1.15, rotate: 360, transition: { duration: 0.5 } }}
                                        >
                                            <div className="scale-75 md:scale-100">
                                                {getStatusIcon(update.icon, isFirst)}
                                            </div>
                                        </motion.div>
                                        {!isLast && (
                                            <motion.div 
                                                className="absolute top-10 md:top-12 bottom-0 w-0.5 bg-linear-to-b from-primary to-blue-300"
                                                initial={{ scaleY: 0, originY: 0 }}
                                                animate={{ scaleY: 1 }}
                                                transition={{ duration: 0.5, delay: 1 + index * 0.1 + 0.3 }}
                                            />
                                        )}
                                    </div>

                                    {/* Content Card */}
                                    <motion.div 
                                        className={`flex-1 transition-all duration-300 ${isFirst ? 'transform md:scale-[1.02]' : ''}`}
                                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                    >
                                        <div className={`rounded-xl p-4 md:p-5 border-2 transition-all duration-300 ${isFirst
                                            ? 'bg-blue-50 border-blue-300 shadow-md'
                                            : 'bg-gray-50 border-gray-200 hover:border-blue-200 hover:shadow-sm'
                                            }`}>
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 mb-2">
                                                <p className={`font-semibold ${isFirst ? 'text-blue-600 text-base md:text-lg' : 'text-primary'}`}>
                                                    {update.date}
                                                </p>
                                                {isFirst && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 0.3, delay: 1 + index * 0.1 + 0.4 }}
                                                    >
                                                        <Badge className="bg-green-500 text-white px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs w-fit">
                                                            Latest
                                                        </Badge>
                                                    </motion.div>
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
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>

            {/* Modals */}
            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
            <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                riderName={trackingData.assignedTo?.name || "Rider"}
            />
        </motion.div>
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