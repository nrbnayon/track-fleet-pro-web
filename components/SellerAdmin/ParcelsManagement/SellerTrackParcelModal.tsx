"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Parcel } from "@/types/parcel";
import { Button } from "@/components/ui/button";
import { Truck, Phone } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
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
    parcel: Parcel | null;
}

export function SellerTrackParcelModal({ isOpen, onClose, parcel }: TrackParcelModalProps) {
    // Get coordinates for pickup and delivery locations
    const { pickupCoords, deliveryCoords, currentLocation } = useMemo(() => {
        if (!parcel) return { pickupCoords: { lat: 23.8103, lng: 90.4125 }, deliveryCoords: { lat: 23.8103, lng: 90.4125 }, currentLocation: { lat: 23.8103, lng: 90.4125 } };

        // Use coordinates from parcel data
        const pickup = parcel.pickup_coordinates || { lat: 23.8103, lng: 90.4125 };
        const delivery = parcel.delivery_coordinates || { lat: 23.8103, lng: 90.4125 };

        // Calculate current position based on parcel status
        let current = pickup;
        
        if (["delivered", "DELIVERED"].includes(parcel.parcel_status)) {
            current = delivery;
        } else if (parcel.riderInfo?.lat && parcel.riderInfo?.lng) {
            // Use driver's real-time location if available
            current = {
                lat: parcel.riderInfo.lat,
                lng: parcel.riderInfo.lng
            };
        } else if (["ongoing", "ONGOING", "assigned", "ASSIGNED"].includes(parcel.parcel_status)) {
             // If ongoing but no driver location, simulate mid-point
            current = {
                lat: pickup.lat + (delivery.lat - pickup.lat) * 0.5,
                lng: pickup.lng + (delivery.lng - pickup.lng) * 0.5,
            };
        }

        return {
            pickupCoords: pickup,
            deliveryCoords: delivery,
            currentLocation: current,
        };
    }, [parcel]);

    if (!parcel) return null;

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
            case "ongoing":
            case "assigned": return "bg-blue-100 text-blue-700";
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
                            driverId={parcel.riderInfo?.rider_id}
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
                                                    src={getImageUrl(parcel.riderInfo.rider_image)}
                                                    alt="Driver"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{parcel.riderInfo.rider_name}</p>
                                                <p className="text-xs text-secondary truncate">
                                                    {parcel.riderInfo?.rider_vehicle || parcel.riderInfo?.rider_phone || parcel.riderInfo?.rider_email || "None"}
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
                                                Call Driver
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
                                    <span className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${["delivered", "DELIVERED"].includes(parcel.parcel_status) ? "bg-green-500" : "bg-gray-300"
                                        }`} />
                                    <p className="text-xs text-secondary mb-0.5">Delivery Location</p>
                                    <h4 className="font-semibold text-sm">{parcel.delivery_location}</h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {["delivered", "DELIVERED"].includes(parcel.parcel_status)
                                            ? `Delivered: ${formatDate(parcel.actual_delivery)}`
                                            : `Estimated: ${formatDate(parcel.estimated_delivary_date)}`
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


// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Parcel } from "@/types/parcel";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { Truck, Phone } from "lucide-react";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import dynamic from "next/dynamic";
// import { useMemo } from "react";

// // Dynamically import the map component to avoid SSR issues
// const MapComponent = dynamic(() => import("@/components/SuperAdmin/ParcelsManagement/ParcelMap"), {
//     ssr: false,
//     loading: () => (
//         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//             <p className="text-gray-500">Loading map...</p>
//         </div>
//     ),
// });

// interface TrackParcelModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     parcel: Parcel | null;
// }

// export function SellerTrackParcelModal({ isOpen, onClose, parcel }: TrackParcelModalProps) {
//     // Get coordinates for pickup and delivery locations
//     const { pickupCoords, deliveryCoords, currentLocation } = useMemo(() => {
//         if (!parcel) return { pickupCoords: { lat: 23.8103, lng: 90.4125 }, deliveryCoords: { lat: 23.8103, lng: 90.4125 }, currentLocation: { lat: 23.8103, lng: 90.4125 } };

//         // Use coordinates from parcel data
//         const pickup = parcel.pickup_coordinates || { lat: 23.8103, lng: 90.4125 };
//         const delivery = parcel.delivery_coordinates || { lat: 23.8103, lng: 90.4125 };

//         // Calculate current position based on parcel status
//         let current = pickup;
        
//         if (["delivered", "DELIVERED"].includes(parcel.parcel_status)) {
//             current = delivery;
//         } else if (parcel.riderInfo?.lat && parcel.riderInfo?.lng) {
//             // Use driver's real-time location if available
//             current = {
//                 lat: parcel.riderInfo.lat,
//                 lng: parcel.riderInfo.lng
//             };
//         } else if (["ongoing", "ONGOING", "assigned", "ASSIGNED"].includes(parcel.parcel_status)) {
//              // If ongoing but no driver location, simulate mid-point
//             current = {
//                 lat: pickup.lat + (delivery.lat - pickup.lat) * 0.5,
//                 lng: pickup.lng + (delivery.lng - pickup.lng) * 0.5,
//             };
//         }

//         return {
//             pickupCoords: pickup,
//             deliveryCoords: delivery,
//             currentLocation: current,
//         };
//     }, [parcel]);

//     if (!parcel) return null;

//     const formatDate = (dateString: string | undefined) => {
//         if (!dateString) return "N/A";
//         return new Date(dateString).toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//             year: "numeric",
//         });
//     };

//     const getStatusColor = (status: string) => {
//         switch (status.toLowerCase()) {
//             case "ongoing":
//             case "assigned": return "bg-blue-100 text-blue-700";
//             case "delivered": return "bg-emerald-100 text-emerald-700";
//             case "pending": return "bg-amber-100 text-amber-700";
//             case "cancelled": return "bg-red-100 text-red-700";
//             default: return "bg-gray-100 text-gray-700";
//         }
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-3xl p-0 rounded-xl border-none overflow-hidden bg-white shadow-2xl">
//                 <DialogHeader className="absolute top-0 right-0 z-0 p-4">
//                     {/* The close button is handled by DialogContent internally but we can style if needed */}
//                 </DialogHeader>

//                 <div className="flex flex-col">
//                     {/* Header */}
//                     <div className="p-6 pb-2">
//                         <DialogTitle className="text-xl font-bold text-foreground mb-4">Track Parcel</DialogTitle>
//                     </div>

//                     {/* Map Section */}
//                     <div className="px-6 pb-6">
//                         <div className="w-full h-[320px] bg-gray-100 rounded-2xl relative overflow-hidden shadow-inner">
//                             <MapComponent
//                                 pickupLocation={pickupCoords}
//                                 deliveryLocation={deliveryCoords}
//                                 currentLocation={currentLocation}
//                                 parcelStatus={parcel.parcel_status}
//                                 driverAssigned={!!parcel.riderInfo}
//                             />
//                         </div>
//                     </div>

//                     {/* Bottom Content */}
//                     <div className="px-8 pb-8 space-y-8">
//                         {/* Tracking ID and Driver Info Row */}
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
//                             <div className="space-y-4">
//                                 <div className="flex items-center gap-3">
//                                     <h3 className="text-lg font-bold text-foreground">Tracking Number #{parcel.tracking_no}</h3>
//                                     <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", getStatusColor(parcel.parcel_status))}>
//                                         {parcel.parcel_status}
//                                     </span>
//                                 </div>
//                                 <div className="space-y-1">
//                                     <p className="text-sm font-semibold text-gray-700">
//                                         Assigned Driver : <span className="font-bold text-foreground">{parcel.riderInfo?.rider_name || "Unassigned"}</span>
//                                     </p>
//                                     <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
//                                         Vehicle Number #{parcel.riderInfo?.rider_vehicle || "N/A"}
//                                     </p>
//                                 </div>
//                             </div>
//                             {parcel.riderInfo && (
//                                 <Button variant="outline" onClick={() => window.open(`tel:${parcel.riderInfo?.rider_phone}`)} className="rounded-full border-gray-200 text-gray-700 font-bold px-6 h-10 transition-all">
//                                     Call Driver
//                                 </Button>
//                                 // it call to dirver phone number
//                             )}
//                         </div>

//                         {/* Location Details Grid */}
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                             <div>
//                                 <p className="text-xs font-bold text-gray-400 uppercase mb-2">From</p>
//                                 <p className="text-sm font-bold text-foreground">{parcel.pickup_location?.split(',')[0] || "Unknown"}</p>
//                                 <p className="text-xs font-semibold text-secondary">{parcel.pickup_location?.split(',')[1]?.trim() || "Dhaka"}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs font-bold text-gray-400 uppercase mb-2">To</p>
//                                 <p className="text-sm font-bold text-foreground">{parcel.delivery_location?.split(',')[0] || "Unknown"}</p>
//                                 <p className="text-xs font-semibold text-secondary">{parcel.delivery_location?.split(',')[1]?.trim() || "Dhaka"}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs font-bold text-gray-400 uppercase mb-2">Current Location</p>
//                                 <p className="text-sm font-bold text-foreground">{parcel.parcel_status === "ongoing" ? "Mirpur" : parcel.delivery_location?.split(',')[0]}</p>
//                                 <p className="text-xs font-semibold text-secondary">Dhaka</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total Distance</p>
//                                 <p className="text-xl font-black text-foreground">{parcel.appoximate_distance || "40 Km"}</p>
//                             </div>
//                         </div>

//                         <div className="pt-2">
//                             <Button
//                                 onClick={onClose}
//                                 className="w-full md:w-auto md:float-right bg-primary hover:bg-primary/80 text-white font-black py-6 px-12 rounded-xl h-12 transition-all shadow-lg shadow-primary/25"
//                             >
//                                 Close
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
