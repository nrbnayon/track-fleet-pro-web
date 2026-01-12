"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Parcel } from "@/types/parcel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/SupperAdmin/ParcelsManagement/ParcelMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
            <p className="text-gray-500">Loading map...</p>
        </div>
    ),
});

interface TrackParcelModalProps {
    isOpen: boolean;
    onClose: () => void;
    parcel: Parcel | null;
}

export function SellerTrackParcelModal({ isOpen, onClose, parcel }: TrackParcelModalProps) {
    const { pickupCoords, deliveryCoords, currentLocation } = useMemo(() => {
        if (!parcel) return { pickupCoords: { lat: 0, lng: 0 }, deliveryCoords: { lat: 0, lng: 0 }, currentLocation: { lat: 0, lng: 0 } };

        const getCoordinates = (location: string) => {
            const locationMap: { [key: string]: { lat: number; lng: number } } = {
                "Gulshan 1, Dhaka": { lat: 23.7808, lng: 90.4217 },
                "Gulshan 2, Dhaka": { lat: 23.7925, lng: 90.4078 },
                "Shyamoli, Dhaka": { lat: 23.7679, lng: 90.3698 },
                "Dhanmondi, Dhaka": { lat: 23.7461, lng: 90.3742 },
                "Uttara, Dhaka": { lat: 23.8759, lng: 90.3795 },
                "Mirpur 10, Dhaka": { lat: 23.8067, lng: 90.3685 },
                "Banani, Dhaka": { lat: 23.7937, lng: 90.4066 },
                "Bashundhara, Dhaka": { lat: 23.8223, lng: 90.4241 },
                "Mohammadpur, Dhaka": { lat: 23.7617, lng: 90.3570 },
                "Lalmatia, Dhaka": { lat: 23.7515, lng: 90.3715 },
                "Motijheel, Dhaka": { lat: 23.7330, lng: 90.4172 },
                "Karwan Bazar, Dhaka": { lat: 23.7505, lng: 90.3929 },
                "Nilkhet, Dhaka": { lat: 23.7359, lng: 90.3897 },
                "Azimpur, Dhaka": { lat: 23.7281, lng: 90.3854 },
                "Baridhara, Dhaka": { lat: 23.8103, lng: 90.4255 },
                "Mirpur 2, Dhaka": { lat: 23.8050, lng: 90.3548 },
            };
            return locationMap[location] || { lat: 23.8103, lng: 90.4125 };
        };

        const pickup = getCoordinates(parcel.pickup_location || "");
        const delivery = getCoordinates(parcel.delivery_location || "");
        let current = pickup;
        if (parcel.parcel_status === "ongoing") {
            current = {
                lat: pickup.lat + (delivery.lat - pickup.lat) * 0.6,
                lng: pickup.lng + (delivery.lng - pickup.lng) * 0.6,
            };
        } else if (parcel.parcel_status === "delivered") {
            current = delivery;
        }

        return { pickupCoords: pickup, deliveryCoords: delivery, currentLocation: current };
    }, [parcel]);

    if (!parcel) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "ongoing": return "bg-blue-100 text-blue-600";
            case "delivered": return "bg-emerald-100 text-emerald-600";
            case "pending": return "bg-amber-100 text-amber-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[750px] p-0 rounded-3xl border-none overflow-hidden bg-white shadow-2xl">
                <DialogHeader className="absolute top-0 right-0 z-50 p-4">
                    {/* The close button is handled by DialogContent internally but we can style if needed */}
                </DialogHeader>

                <div className="flex flex-col">
                    {/* Header */}
                    <div className="p-6 pb-2">
                        <DialogTitle className="text-xl font-bold text-gray-900 mb-4">Track Parcel</DialogTitle>
                    </div>

                    {/* Map Section */}
                    <div className="px-6 pb-6">
                        <div className="w-full h-[320px] bg-gray-100 rounded-2xl relative overflow-hidden shadow-inner">
                            <MapComponent
                                pickupLocation={pickupCoords}
                                deliveryLocation={deliveryCoords}
                                currentLocation={currentLocation}
                                parcelStatus={parcel.parcel_status}
                                driverAssigned={!!parcel.riderInfo}
                            />
                        </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="px-8 pb-8 space-y-8">
                        {/* Tracking ID and Driver Info Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-gray-900">Tracking Number #{parcel.tracking_no}</h3>
                                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", getStatusColor(parcel.parcel_status))}>
                                        {parcel.parcel_status}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-gray-700">
                                        Assigned Driver : <span className="font-bold text-gray-900">{parcel.riderInfo?.rider_name || "Unassigned"}</span>
                                    </p>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Vehicle Number #{parcel.riderInfo?.rider_vehicle || "N/A"}
                                    </p>
                                </div>
                            </div>
                            {parcel.riderInfo && (
                                <Button variant="outline" className="rounded-full border-gray-200 text-gray-700 font-bold px-6 h-10 hover:bg-gray-50 transition-all">
                                    Contact Driver
                                </Button>
                            )}
                        </div>

                        {/* Location Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">From</p>
                                <p className="text-sm font-bold text-gray-800">{parcel.pickup_location?.split(',')[0] || "Unknown"}</p>
                                <p className="text-xs font-semibold text-gray-500">{parcel.pickup_location?.split(',')[1]?.trim() || "Dhaka"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">To</p>
                                <p className="text-sm font-bold text-gray-800">{parcel.delivery_location?.split(',')[0] || "Unknown"}</p>
                                <p className="text-xs font-semibold text-gray-500">{parcel.delivery_location?.split(',')[1]?.trim() || "Dhaka"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Current Location</p>
                                <p className="text-sm font-bold text-gray-800">{parcel.parcel_status === "ongoing" ? "Mirpur" : parcel.delivery_location?.split(',')[0]}</p>
                                <p className="text-xs font-semibold text-gray-500">Dhaka</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total Distance</p>
                                <p className="text-xl font-black text-gray-900">40 Km</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                onClick={onClose}
                                className="w-full md:w-auto md:float-right bg-blue-500 hover:bg-blue-600 text-white font-black py-6 px-12 rounded-xl h-12 transition-all shadow-lg shadow-blue-500/25"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
