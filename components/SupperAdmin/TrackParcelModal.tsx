"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Parcel } from "@/types/parcel";
import { Button } from "@/components/ui/button";
import { MapPin, Truck } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface TrackParcelModalProps {
    isOpen: boolean;
    onClose: () => void;
    parcel: Parcel;
}

export function TrackParcelModal({ isOpen, onClose, parcel }: TrackParcelModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        Track Parcel
                        <Badge variant="secondary" className="font-normal text-sm bg-blue-100 text-blue-700">
                            {parcel.parcel_status}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Map Area (Placeholder) */}
                    <div className="flex-1 bg-gray-100 relative">
                        <Image
                            src="/images/map-placeholder.png"
                            alt="Map"
                            fill
                            className="object-cover opacity-50"
                        />
                        {/* Visual Mockup of a route */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center max-w-sm">
                                <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                <h3 className="font-bold text-gray-900">Live Tracking</h3>
                                <p className="text-sm text-gray-500 mb-2">Driver is on the way to delivery location</p>
                                <p className="text-xs text-gray-400">Estimated Arrival: 15 mins</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Details */}
                    <div className="w-[350px] bg-white border-l border-gray-100 flex flex-col overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Header Info */}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                                <h3 className="font-bold text-lg text-gray-900">{parcel.tracking_no}</h3>
                            </div>

                            {/* Driver Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Truck className="h-4 w-4" /> Assigned Driver
                                </h4>
                                {parcel.riderInfo ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                                            <Image
                                                src={parcel.riderInfo?.rider_image || "/drivers/driver.jpg"}
                                                alt="Driver"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{parcel.riderInfo.rider_name}</p>
                                            <p className="text-xs text-gray-500">{parcel.riderInfo.rider_vehicle}</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="ml-auto h-8 text-xs">Contact</Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No driver assigned yet.</p>
                                )}
                            </div>

                            {/* Route Info */}
                            <div className="space-y-6 relative pl-4 border-l border-gray-200 ml-2">
                                {/* Pickup */}
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                                    <p className="text-xs text-gray-500 mb-0.5">From</p>
                                    <h4 className="font-semibold text-sm">{parcel.pickup_location}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(parcel.createdAt || new Date()).toLocaleDateString()}</p>
                                </div>

                                {/* Delivery */}
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white" />
                                    <p className="text-xs text-gray-500 mb-0.5">To</p>
                                    <h4 className="font-semibold text-sm">{parcel.delivery_location}</h4>
                                    <p className="text-xs text-gray-400 mt-1">Estimated: {new Date(parcel.estimated_delivery || new Date()).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Total Distance</p>
                                    <p className="font-semibold">12.5 km</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Est. Time</p>
                                    <p className="font-semibold">45 mins</p>
                                </div>
                            </div>
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
