// components/landing/TrackParcelForm.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TrackingResults from "./TrackingResults";
import { motion, AnimatePresence } from "framer-motion";
import { useTrackParcelQuery } from "@/redux/services/parcelApi";
import { Loader2, AlertCircle } from "lucide-react";

interface TrackParcelFormProps {
    initialTrackingId?: string;
}

export default function TrackParcelForm({ initialTrackingId }: TrackParcelFormProps) {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [searchedNumber, setSearchedNumber] = useState("");

    const { data: trackingData, isLoading, isFetching, error } = useTrackParcelQuery(searchedNumber, {
        skip: !searchedNumber,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingNumber.trim()) {
            setSearchedNumber(trackingNumber.trim());
        }
    };

    useEffect(() => {
        if (initialTrackingId) {
            setTrackingNumber(initialTrackingId);
            setSearchedNumber(initialTrackingId);
        }
    }, [initialTrackingId]);

    return (
        <div className="w-full mx-auto">
            {/* Search Form */}
            <motion.div 
                className="bg-white max-w-4xl mx-auto shadow-none mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <form onSubmit={handleSearch} className="flex items-center justify-center w-full rounded-md">
                    <div className="relative flex items-center flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                        <Input
                            type="text"
                            placeholder="Enter Tracking Number (e.g. TRK000000000)"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="pl-12 pr-4 h-14 text-lg rounded-r-none focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:ring-1 transition-all"
                            disabled={isLoading || isFetching}
                        />
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                size="lg"
                                className="h-14 bg-primary hover:bg-primary/80 rounded-l-none rounded-r-md text-white px-6 -ml-px transition-colors min-w-[120px]"
                                disabled={isLoading || isFetching || !trackingNumber.trim()}
                            >
                                {isLoading || isFetching ? (
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                ) : "Search"}
                            </Button>
                        </motion.div>
                    </div>
                </form>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700"
                    >
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>Could not find any parcel with tracking number <span className="font-bold">{searchedNumber}</span>. Please check the number and try again.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tracking Results */}
            <AnimatePresence mode="wait">
                {trackingData && !error && (
                    <motion.div
                        key={searchedNumber}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <TrackingResults trackingData={trackingData} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
