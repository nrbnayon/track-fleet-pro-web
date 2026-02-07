"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Parcel } from "@/types/parcel";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, Phone } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/SuperAdmin/ParcelsManagement/ParcelMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Loading map...</p>
        </div>
    ),
});

interface TrackParcelModalProps {
    isOpen: boolean;
    onClose: () => void;
    parcel: Parcel;
}

export function TrackParcelModal({ isOpen, onClose, parcel }: TrackParcelModalProps) {
    // Get coordinates for pickup and delivery locations
    const { pickupCoords, deliveryCoords, currentLocation } = useMemo(() => {
        // Mock coordinates based on location names
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

        // Calculate current position based on parcel status
        let current = pickup;
        if (parcel.parcel_status === "ongoing" && parcel.riderInfo) {
            // Simulate driver position between pickup and delivery
            current = {
                lat: pickup.lat + (delivery.lat - pickup.lat) * 0.6,
                lng: pickup.lng + (delivery.lng - pickup.lng) * 0.6,
            };
        } else if (parcel.parcel_status === "delivered") {
            current = delivery;
        }

        return {
            pickupCoords: pickup,
            deliveryCoords: delivery,
            currentLocation: current,
        };
    }, [parcel]);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "ongoing": return "bg-blue-100 text-blue-700";
            case "delivered": return "bg-emerald-100 text-emerald-700";
            case "pending": return "bg-amber-100 text-amber-700";
            case "cancelled": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full md:min-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border border-border">
                <DialogHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        Track Parcel
                        <Badge variant="secondary" className={`font-normal text-sm ${getStatusColor(parcel.parcel_status)}`}>
                            {parcel.parcel_status}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                    {/* Map Area */}
                    <div className="w-full md:flex-1 h-[350px] md:h-auto md:min-h-[400px] bg-gray-100 relative order-1 md:order-1">
                        <MapComponent
                            pickupLocation={pickupCoords}
                            deliveryLocation={deliveryCoords}
                            currentLocation={currentLocation}
                            parcelStatus={parcel.parcel_status}
                            driverAssigned={!!parcel.riderInfo}
                        />
                    </div>

                    {/* Sidebar Details */}
                    <div className="w-full md:w-[380px] bg-white border-t md:border-t-0 md:border-l border-gray-100 flex flex-col flex-1 md:flex-none overflow-y-auto order-2 md:order-2 h-full md:h-auto">
                        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                            {/* Header Info */}
                            <div>
                                <p className="text-sm text-secondary mb-1">Tracking Number</p>
                                <h3 className="font-bold text-lg text-foreground">{parcel.tracking_no}</h3>
                            </div>

                            {/* Parcel Info */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <h4 className="font-semibold text-sm mb-2">Parcel Details</h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Name:</span>
                                    <span className="font-medium text-right">{parcel.parcel_name || "N/A"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Weight:</span>
                                    <span className="font-medium text-right">{parcel.parcel_weight} Kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Type:</span>
                                    <span className="font-medium capitalize text-right">{parcel.parcel_type || "Package"}</span>
                                </div>
                            </div>

                            {/* Driver Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Truck className="h-4 w-4" /> Assigned Driver
                                </h4>
                                {parcel.riderInfo ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
                                                <Image
                                                    src={parcel.riderInfo.rider_image || "/drivers/driver.jpg"}
                                                    alt="Driver"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{parcel.riderInfo.rider_name}</p>
                                                <p className="text-xs text-secondary truncate">
                                                    {parcel.riderInfo.rider_vehicle || "None"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 h-8 text-xs gap-1"
                                                onClick={() => window.open(`tel:${parcel.riderInfo?.rider_phone}`)}
                                            >
                                                <Phone className="h-3 w-3" />
                                                Call
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 h-8 text-xs"
                                            >
                                                Message
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-secondary italic">No driver assigned yet.</p>
                                )}
                            </div>

                            {/* Route Info */}
                            <div className="space-y-6 relative pl-4 border-l-2 border-gray-200 ml-2">
                                {/* Pickup */}
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                                    <p className="text-xs text-secondary mb-0.5">Pickup Location</p>
                                    <h4 className="font-semibold text-sm">{parcel.pickup_location}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{formatDate(parcel.createdAt)}</p>
                                </div>

                                {/* Delivery */}
                                <div className="relative">
                                    <span className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${parcel.parcel_status === "delivered" ? "bg-green-500" : "bg-gray-300"
                                        }`} />
                                    <p className="text-xs text-secondary mb-0.5">Delivery Location</p>
                                    <h4 className="font-semibold text-sm">{parcel.delivery_location}</h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {parcel.parcel_status === "delivered"
                                            ? `Delivered: ${formatDate(parcel.actual_delivery)}`
                                            : `Estimated: ${formatDate(parcel.estimated_delivery)}`
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Receiver Info */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <h4 className="font-semibold text-sm mb-2">Receiver Information</h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Name:</span>
                                    <span className="font-medium">{parcel.receiverInfo?.name || "N/A"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Phone:</span>
                                    <span className="font-medium">{parcel.receiverInfo?.phone || "N/A"}</span>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            {parcel.special_instructions && (
                                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                                    <p className="text-xs font-semibold text-amber-900 mb-1">Special Instructions</p>
                                    <p className="text-sm text-amber-800">{parcel.special_instructions}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto p-4 border-t border-gray-100">
                            <Button className="w-full" onClick={onClose}>Close</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}