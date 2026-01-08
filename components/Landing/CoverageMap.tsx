// components/landing/CoverageMap.tsx
"use client";

import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CoverageMap() {
    // Mock location data
    const locations = [
        {
            id: 1,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
        },
        {
            id: 2,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
        },
        {
            id: 3,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
        },
        {
            id: 4,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
        },
        {
            id: 5,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location List */}
            <div className="space-y-4 lg:order-1 order-2">
                {locations.map((location) => (
                    <div
                        key={location.id}
                        className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    {location.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                                <p className="text-sm text-gray-600">{location.phone}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-white flex items-center gap-1 flex-shrink-0"
                            >
                                <Navigation className="h-4 w-4" />
                                Direction
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Map Placeholder */}
            <div className="lg:order-2 order-1">
                <div className="bg-gray-200 rounded-lg overflow-hidden h-[400px] lg:h-full min-h-[400px] relative">
                    {/* Map placeholder - Replace with actual map implementation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Navigation className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-gray-600 font-medium">Map View</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Integrate Google Maps or Mapbox here
                            </p>
                        </div>
                    </div>

                    {/* Mock map markers */}
                    <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute top-2/3 left-2/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute top-1/3 left-2/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute top-3/4 left-1/4 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>
            </div>
        </div>
    );
}