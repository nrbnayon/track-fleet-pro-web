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
import { useCreateParcelMutation, useUpdateParcelMutation } from "@/redux/services/parcelApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Parcel } from "@/types/parcel"; 

interface AddParcelModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Parcel | null; // Optional initial data for editing
}

export function AddParcelModal({ isOpen, onClose, initialData }: AddParcelModalProps) {
    const [createParcel, { isLoading: isCreating }] = useCreateParcelMutation();
    const [updateParcel, { isLoading: isUpdating }] = useUpdateParcelMutation();

    const [pickupLocation, setPickupLocation] = useState<{ address: string; lat?: number; lng?: number } | undefined>(undefined);
    const [deliveryLocation, setDeliveryLocation] = useState<{ address: string; lat?: number; lng?: number } | undefined>(undefined);
    const [recipientName, setRecipientName] = useState("");
    const [recipientNumber, setRecipientNumber] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [parcelType, setParcelType] = useState("");
    const [parcelWeight, setParcelWeight] = useState("");
    const [notes, setNotes] = useState("");
    const [estimatedDate, setEstimatedDate] = useState("");
    const [approximateDistance, setApproximateDistance] = useState<string>("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Reset or Populate form when modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Edit Mode: Pre-fill data
                setRecipientName(initialData.receiverInfo?.name || "");
                setRecipientNumber(initialData.receiverInfo?.phone || "");
                setRecipientEmail(initialData.receiverInfo?.email_address || "");
                setParcelType(initialData.parcel_type || "");
                setParcelWeight(initialData.parcel_weight?.toString() || "");
                setNotes(initialData.special_instructions || "");
                
                // Format date for input type="date" (YYYY-MM-DD)
                if (initialData.estimated_delivary_date) {
                    const date = new Date(initialData.estimated_delivary_date);
                    setEstimatedDate(date.toISOString().split('T')[0]);
                } else {
                    setEstimatedDate("");
                }

                // Set Locations
                if (initialData.pickup_location) {
                    setPickupLocation({
                        address: initialData.pickup_location,
                        lat: initialData.pickup_coordinates?.lat,
                        lng: initialData.pickup_coordinates?.lng
                    });
                }
                if (initialData.delivery_location) {
                    setDeliveryLocation({
                        address: initialData.delivery_location,
                        lat: initialData.delivery_coordinates?.lat,
                        lng: initialData.delivery_coordinates?.lng
                    });
                }
                setApproximateDistance(initialData.appoximate_distance || "");

            } else {
                // Add Mode: Clear form
                resetForm();
            }
            setErrors({});
        }
    }, [isOpen, initialData]);

    const resetForm = () => {
        setPickupLocation(undefined);
        setDeliveryLocation(undefined);
        setRecipientName("");
        setRecipientNumber("");
        setRecipientEmail("");
        setParcelType("");
        setParcelWeight("");
        setNotes("");
        setEstimatedDate("");
        setApproximateDistance("");
    };

    // Calculate distance when both locations are set
    useEffect(() => {
         // Only calculate if locations changed and both exist
        if (pickupLocation?.lat && pickupLocation?.lng && deliveryLocation?.lat && deliveryLocation?.lng) {
             // Avoid recalculating if we just loaded initialData which might already have distance
             // But usually safe to recalculate to ensure accuracy
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
        if (!recipientEmail.trim()) {
            newErrors.recipientEmail = "Recipient email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
            newErrors.recipientEmail = "Please enter a valid email address.";
        }
        if (!parcelType.trim()) {
            newErrors.parcelType = "Parcel type is required.";
        }
        if (!parcelWeight.trim()) {
            newErrors.parcelWeight = "Parcel weight is required.";
        }
        if (!estimatedDate.trim()) {
            newErrors.estimatedDate = "Estimated delivery date is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        // Construct the full parcel object matching API requirements
        // We can safely assert non-null values here because validateForm checked them
        const fullParcelData: any = { 
            receiverInfo: {
                name: recipientName,
                phone: recipientNumber,
                address: deliveryLocation?.address,
                email_address: recipientEmail
            },
            pickup_location: pickupLocation?.address,
            pickup_coordinates: {
                lat: pickupLocation!.lat!,
                lng: pickupLocation!.lng!
            },
            delivery_location: deliveryLocation?.address,
            delivery_coordinates: {
                lat: deliveryLocation!.lat!,
                lng: deliveryLocation!.lng!
            },
            parcel_type: parcelType,
            parcel_weight: parseFloat(parcelWeight) || 0,
            estimated_delivary_date: estimatedDate,
            special_instructions: notes,
            appoximate_distance: approximateDistance,
        };
        
        try {
            if (initialData) {
                 // Update existing parcel
                 await updateParcel({ id: initialData.id, data: fullParcelData }).unwrap();
                 toast.success("Parcel updated successfully");
            } else {
                // Create new parcel
                await createParcel(fullParcelData).unwrap();
                toast.success("Parcel created successfully");
            }
            onClose();
            if (!initialData) resetForm(); // Only reset if adding new, otherwise useEffect handles it
        } catch (error) {
            console.error("Failed to save parcel:", error);
            toast.error("Failed to save parcel. Please try again.");
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-6 rounded-2xl border-none max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-foreground mb-4">
                        {initialData ? "Edit Parcel" : "Add New Parcel"}
                    </DialogTitle>
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

                    {/* Recipient Email */}
                    <div className="space-y-2">
                        <Label htmlFor="recipientEmail" className="text-sm font-semibold text-gray-700">
                            Recipient Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="recipientEmail"
                            type="email"
                            placeholder="example@email.com"
                            value={recipientEmail}
                            onChange={(e) => {
                                setRecipientEmail(e.target.value);
                                if (e.target.value) setErrors({ ...errors, recipientEmail: "" });
                            }}
                            className={`bg-gray-50 border-gray-100 rounded-lg h-11 ${errors.recipientEmail ? "border-red-500" : ""}`}
                        />
                        {errors.recipientEmail && <p className="text-xs text-red-500">{errors.recipientEmail}</p>}
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

                    {/* Estimated Date */}
                    <div className="space-y-2">
                        <Label htmlFor="estimatedDate" className="text-sm font-semibold text-gray-700">
                            Estimated Delivery Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="estimatedDate"
                            type="date"
                            value={estimatedDate}
                            onChange={(e) => {
                                setEstimatedDate(e.target.value);
                                if (e.target.value) setErrors({ ...errors, estimatedDate: "" });
                            }}
                            className={`bg-gray-50 border-gray-100 rounded-lg h-11 ${errors.estimatedDate ? "border-red-500" : ""}`}
                        />
                        {errors.estimatedDate && <p className="text-xs text-red-500">{errors.estimatedDate}</p>}
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
                        disabled={isSubmitting}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg h-11 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? "Saving..." : (initialData ? "Save Changes" : "Add Parcel")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
