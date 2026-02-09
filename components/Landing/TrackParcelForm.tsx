// components/landing/TrackParcelForm.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TrackingResults from "./TrackingResults";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackParcelForm() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [searchedNumber, setSearchedNumber] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!trackingNumber.trim()) {
            return;
        }

        setIsSearching(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSearchedNumber(trackingNumber);
        setIsSearching(false);
    };

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
                            placeholder="S4768324HJFNHFIR5654"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="pl-12 pr-4 h-14 text-lg rounded-r-none focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:ring-1 transition-all"
                            disabled={isSearching}
                        />
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                size="lg"
                                className="h-14 bg-primary hover:bg-primary/80 rounded-l-none rounded-r-md text-white px-6 -ml-px transition-colors"
                                disabled={isSearching || !trackingNumber.trim()}
                            >
                                {isSearching ? "Searching..." : "Search"}
                            </Button>
                        </motion.div>
                    </div>
                </form>
            </motion.div>

            {/* Tracking Results */}
            <AnimatePresence mode="wait">
                {searchedNumber && (
                    <motion.div
                        key={searchedNumber}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <TrackingResults trackingNumber={searchedNumber} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
