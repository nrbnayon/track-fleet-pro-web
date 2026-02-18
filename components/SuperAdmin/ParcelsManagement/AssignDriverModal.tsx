"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Parcel } from "@/types/parcel";
import { useGetNearestDriversQuery, useAssignDriverMutation } from "@/redux/services/parcelApi";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Package, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Driver } from "@/types/driver";

interface AssignDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    parcel: Parcel;
}

export function AssignDriverModal({ isOpen, onClose, parcel }: AssignDriverModalProps) {
    const [searchDriver, setSearchDriver] = useState("");
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

    const { data: drivers = [], isLoading } = useGetNearestDriversQuery(parcel.id);
    const [assignDriver, { isLoading: isAssigning }] = useAssignDriverMutation();

    const filteredDrivers = drivers.filter((driver: Driver) =>
        driver.driver_name.toLowerCase().includes(searchDriver.toLowerCase()) ||
        driver.current_location?.address?.toLowerCase().includes(searchDriver.toLowerCase())
    );

    const handleAssign = async () => {
        if (!selectedDriverId) return;
        try {
            await assignDriver({ parcelId: parcel.id, driverId: selectedDriverId }).unwrap();
            toast.success("Driver assigned successfully");
            onClose();
        } catch (error: any) {
            console.error("Failed to assign driver:", error);
            
            if (error?.data?.errors?.non_field_errors) {
                const nonFieldErrors = error.data.errors.non_field_errors;
                if (Array.isArray(nonFieldErrors) && nonFieldErrors.some(msg => typeof msg === 'string' && msg.includes("unique set"))) {
                    toast.error("This driver is already assigned to this parcel.");
                    return;
                }
                 toast.error(nonFieldErrors[0] || "Failed to assign driver");
                 return;
            }

            toast.error(error?.data?.message || "Failed to assign driver");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full md:min-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border border-border">
                <DialogHeader className="p-6 pb-2 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold">Assign Driver to Parcel</DialogTitle>
                </DialogHeader>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    {/* Parcel Details */}
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Parcel Details</h3>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-blue-600">{parcel.tracking_no}</p>
                                <p className="text-sm text-secondary mt-1">{parcel.pickup_location}</p>
                            </div>
                            <Badge variant="outline" className="bg-white">{parcel.parcel_status}</Badge>
                        </div>
                    </div>

                    {/* Drivers List */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Available Drivers ({filteredDrivers.length})</h3>
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search driver..."
                                    className="pl-9 h-9"
                                    value={searchDriver}
                                    onChange={(e) => setSearchDriver(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {isLoading ? (
                                <div className="text-center py-8 text-gray-400">Loading drivers...</div>
                            ) : filteredDrivers.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">No active drivers found matching your search.</div>
                            ) : (
                                filteredDrivers.map((driver: Driver) => (
                                <div
                                    key={driver.id}
                                    onClick={() => setSelectedDriverId(driver.id)}
                                    className={cn(
                                        "flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                                        selectedDriverId === driver.id
                                            ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500"
                                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                    )}
                                >
                                    <div className="relative h-12 w-12 mr-4 shrink-0">
                                        <Image
                                            src={driver.driver_image?.startsWith('/') ? driver?.driver_image : `${driver?.driver_image}` || "/drivers/driver.jpg"}
                                            alt={driver.driver_name}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-foreground">{driver.driver_name}</h4>
                                            <Badge variant={driver.driver_status === 'available' ? 'default' : 'secondary'} className={cn(
                                                "capitalize",
                                                driver.driver_status === 'available' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700'
                                            )}>
                                                {driver.driver_status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {driver.current_location?.address || 'Unknown Location'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Package className="h-3 w-3" />
                                                {driver.stats?.active_deliveries || 0} deliveries
                                                </span>
                                                {driver?.distance && (
                                                    <span className="flex items-center gap-1">
                                                        <Truck className="h-3 w-3" />
                                                        {driver?.distance} km
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            )))}
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-2 border-t border-gray-100 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isAssigning}>Cancel</Button>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-white"
                        disabled={!selectedDriverId || isAssigning}
                        onClick={handleAssign}
                    >
                        {isAssigning ? "Assigning..." : "Assign Driver"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
