"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LocationPicker } from "@/components/Shared/LocationPicker";
import { useState, useEffect } from "react";

interface AddParcelModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddParcelModal({ isOpen, onClose }: AddParcelModalProps) {
    const [pickupLocation, setPickupLocation] = useState<{ address: string; lat?: number; lng?: number } | undefined>(undefined);
    const [deliveryLocation, setDeliveryLocation] = useState<{ address: string; lat?: number; lng?: number } | undefined>(undefined);
    const [recipientName, setRecipientName] = useState("");
    const [recipientNumber, setRecipientNumber] = useState("");
    const [parcelType, setParcelType] = useState("");
    const [parcelWeight, setParcelWeight] = useState("");
    const [notes, setNotes] = useState("");
    const [approximateDistance, setApproximateDistance] = useState<string>("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Calculate distance when both locations are set
    useEffect(() => {
        if (pickupLocation?.lat && pickupLocation?.lng && deliveryLocation?.lat && deliveryLocation?.lng) {
            calculateDistance(
                { lat: pickupLocation.lat, lng: pickupLocation.lng },
                { lat: deliveryLocation.lat, lng: deliveryLocation.lng }
            );
        }
    }, [pickupLocation, deliveryLocation]);

    const calculateDistance = async (
        start: { lat: number; lng: number },
        end: { lat: number; lng: number }
    ) => {
        try {
            const { importLibrary } = await import("@googlemaps/js-api-loader");
            const { DirectionsService } = await importLibrary("routes") as google.maps.RoutesLibrary;
            
            const directionsService = new DirectionsService();
            const result = await directionsService.route({
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING,
            });

            if (result.routes[0] && result.routes[0].legs[0]) {
                const route = result.routes[0].legs[0];
                if (route.distance?.text) {
                    setApproximateDistance(route.distance.text);
                    console.log("Calculated Distance:", route.distance.text);
                }
            }
        } catch (error) {
            console.error("Error calculating distance:", error);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!pickupLocation?.address || !pickupLocation?.lat || !pickupLocation?.lng) {
            newErrors.pickupLocation = "Pickup location is required and must be valid.";
        }
        if (!deliveryLocation?.address || !deliveryLocation?.lat || !deliveryLocation?.lng) {
            newErrors.deliveryLocation = "Delivery location is required and must be valid.";
        }
        if (!recipientName.trim()) {
            newErrors.recipientName = "Recipient name is required.";
        }
        if (!recipientNumber.trim()) {
            newErrors.recipientNumber = "Recipient number is required.";
        }
        if (!parcelType.trim()) {
            newErrors.parcelType = "Parcel type is required.";
        }
        if (!parcelWeight.trim()) {
            newErrors.parcelWeight = "Parcel weight is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        // Construct the full parcel object
        const fullParcelData: any = { 
            receiverInfo: {
                name: recipientName,
                phone: recipientNumber,
                address: deliveryLocation?.address
            },
            pickup_location: pickupLocation?.address,
            pickup_coordinates: pickupLocation?.lat && pickupLocation?.lng ? {
                lat: pickupLocation.lat,
                lng: pickupLocation.lng
            } : undefined,
            delivery_location: deliveryLocation?.address,
            delivery_coordinates: deliveryLocation?.lat && deliveryLocation?.lng ? {
                lat: deliveryLocation.lat,
                lng: deliveryLocation.lng
            } : undefined,
            parcel_type: parcelType,
            parcel_weight: parseFloat(parcelWeight) || 0,
            special_instructions: notes,
            appoximate_distance: approximateDistance,
        };
        
        console.log("Full Submitable Data:", fullParcelData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-6 rounded-2xl border-none max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-foreground mb-4">Add New Parcel</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Recipient Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipientName" className="text-sm font-semibold text-gray-700">
                                Recipient Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="recipientName"
                                placeholder="John Doe"
                                value={recipientName}
                                onChange={(e) => {
                                    setRecipientName(e.target.value);
                                    if (e.target.value) setErrors({ ...errors, recipientName: "" });
                                }}
                                className={`bg-gray-50 border-gray-100 rounded-lg h-11 ${errors.recipientName ? "border-red-500" : ""}`}
                            />
                            {errors.recipientName && <p className="text-xs text-red-500">{errors.recipientName}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="recipientNumber" className="text-sm font-semibold text-gray-700">
                                Recipient Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="recipientNumber"
                                placeholder="000-0000-000"
                                value={recipientNumber}
                                onChange={(e) => {
                                    setRecipientNumber(e.target.value);
                                    if (e.target.value) setErrors({ ...errors, recipientNumber: "" });
                                }}
                                className={`bg-gray-50 border-gray-100 rounded-lg h-11 ${errors.recipientNumber ? "border-red-500" : ""}`}
                            />
                             {errors.recipientNumber && <p className="text-xs text-red-500">{errors.recipientNumber}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="parcelType" className="text-sm font-semibold text-gray-700">
                                Parcel Type <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="parcelType"
                                placeholder="e.g. Fragile, Electronics, Document..."
                                value={parcelType}
                                onChange={(e) => {
                                    setParcelType(e.target.value);
                                    if (e.target.value) setErrors({ ...errors, parcelType: "" });
                                }}
                                className={`bg-gray-50 border-gray-100 rounded-lg h-11 ${errors.parcelType ? "border-red-500" : ""}`}
                            />
                             {errors.parcelType && <p className="text-xs text-red-500">{errors.parcelType}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parcelWeight" className="text-sm font-semibold text-gray-700">
                                Parcel Weight (kg) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="parcelWeight"
                                placeholder="2.5 Kg"
                                value={parcelWeight}
                                onChange={(e) => {
                                    setParcelWeight(e.target.value);
                                    if (e.target.value) setErrors({ ...errors, parcelWeight: "" });
                                }}
                                className={`bg-gray-50 border-gray-100 rounded-lg h-11 ${errors.parcelWeight ? "border-red-500" : ""}`}
                            />
                             {errors.parcelWeight && <p className="text-xs text-red-500">{errors.parcelWeight}</p>}
                        </div>
                    </div>

                     {/* Location Section - Mandatory */}
                    <div className="space-y-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-center border-b border-blue-200 pb-2 mb-2">
                             <h3 className="text-md font-bold text-blue-900">Location Details</h3>
                             {approximateDistance && (
                                 <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                                     Approx Distance: {approximateDistance}
                                 </span>
                             )}
                        </div>
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <LocationPicker
                                label="Pickup Point"
                                required={true}
                                placeholder="Search pickup location..."
                                value={pickupLocation}
                                onChange={(val) => {
                                    setPickupLocation(val);
                                    if (val?.address) setErrors({ ...errors, pickupLocation: "" });
                                }}
                                error={errors.pickupLocation}
                            />
                            <LocationPicker
                                label="Recipient Address / Delivery Point"
                                required={true}
                                placeholder="Search delivery location..."
                                value={deliveryLocation}
                                onChange={(val) => {
                                    setDeliveryLocation(val);
                                    if (val?.address) setErrors({ ...errors, deliveryLocation: "" });
                                }}
                                error={errors.deliveryLocation}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add a note (e.g., Gate code, Special instructions)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-gray-50 border-gray-100 rounded-lg min-h-[100px] resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <Button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg h-11 transition-all shadow-lg shadow-blue-500/25"
                    >
                        Add Parcel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
