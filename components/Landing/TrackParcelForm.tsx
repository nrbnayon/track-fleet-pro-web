// components/landing/TrackParcelForm.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TrackingResults from "./TrackingResults";

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
        <div className="max-w-3xl mx-auto">
            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="S4768324HJFNHFIR5654"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="pl-12 pr-4 h-14 text-lg rounded-xl"
                            disabled={isSearching}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 text-lg rounded-xl"
                        disabled={isSearching || !trackingNumber.trim()}
                    >
                        {isSearching ? "Searching..." : "Search"}
                    </Button>
                </form>
            </div>

            {/* Tracking Results */}
            {searchedNumber && (
                <TrackingResults trackingNumber={searchedNumber} />
            )}
        </div>
    );
}


//Replace mock data with real API calls:

// import { GoogleMap, Marker } from '@react-google-maps/api';

// const mapOptions = {
//     center: { lat: 29.7604, lng: -95.3698 }, // Houston
//     zoom: 10,
// };

// const handleSearch = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsSearching(true);

//   try {
//     const response = await fetch(`/api/tracking/${trackingNumber}`);
//     const data = await response.json();
//     setSearchedNumber(trackingNumber);
//     // Handle data
//   } catch (error) {
//     toast.error("Tracking number not found");
//   } finally {
//     setIsSearching(false);
//   }
// };