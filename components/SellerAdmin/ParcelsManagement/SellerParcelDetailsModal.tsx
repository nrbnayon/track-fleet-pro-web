"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Parcel } from "@/types/parcel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, MapPin, Package, Phone, Mail, Clock, ShieldCheck, Info, Car } from "lucide-react";

interface SellerParcelDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    parcel: Parcel | null;
}

export function SellerParcelDetailsModal({ isOpen, onClose, parcel }: SellerParcelDetailsModalProps) {
    if (!parcel) return null;

    const getStatusColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "ongoing": return "bg-blue-100 text-blue-600 border-blue-200";
            case "delivered": return "bg-emerald-100 text-emerald-600 border-emerald-200";
            case "pending": return "bg-amber-100 text-amber-600 border-amber-200";
            case "cancelled": return "bg-red-100 text-red-600 border-red-200";
            case "return": return "bg-rose-100 text-rose-600 border-rose-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const DetailItem = ({ icon: Icon, label, value, subValue }: { icon: any, label: string, value: string | number | undefined, subValue?: string }) => (
        <div className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-gray-900">{value || "N/A"}</p>
                {subValue && <p className="text-[10px] font-medium text-gray-400 mt-0.5">{subValue}</p>}
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-0 rounded-[2.5rem] border-none overflow-hidden bg-white shadow-2xl">
                <div className="flex flex-col max-h-[90vh]">
                    {/* Header Section */}
                    <div className="bg-blue-50/50 p-8 border-b border-blue-100/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Parcel Details</h2>
                                    <span className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border", getStatusColor(parcel.parcel_status))}>
                                        {parcel.parcel_status}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-gray-500">Tracking Number: <span className="text-blue-600">#{parcel.tracking_no}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Created At</p>
                                <p className="text-sm font-bold text-gray-900">{parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Receiver & Delivery */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Receiver Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <DetailItem icon={User} label="Name" value={parcel.receiverInfo?.name} />
                                    <DetailItem icon={Phone} label="Phone Number" value={parcel.receiverInfo?.phone} />
                                    <DetailItem icon={MapPin} label="Delivery Address" value={parcel.delivery_location} />
                                </div>

                                <div className="flex items-center gap-2 mt-8 mb-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Parcel Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <DetailItem icon={Package} label="Parcel Name" value={parcel.parcel_name || "Gift Package"} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <DetailItem icon={ShieldCheck} label="Type" value={parcel.parcel_type} />
                                        <DetailItem icon={Info} label="Weight" value={`${parcel.parcel_weight} Kg`} />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Driver & Status */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Courier & Status</h3>
                                </div>
                                <div className="space-y-4">
                                    <DetailItem
                                        icon={Car}
                                        label="Assigned Rider"
                                        value={parcel.riderInfo?.rider_name || "Pending Assignment"}
                                        subValue={parcel.riderInfo?.rider_vehicle}
                                    />
                                    {parcel.actual_delivery && (
                                        <DetailItem
                                            icon={Clock}
                                            label="Delivered On"
                                            value={new Date(parcel.actual_delivery).toLocaleString()}
                                        />
                                    )}
                                    <div className="p-6 rounded-3xl bg-blue-600 text-white space-y-4 shadow-xl shadow-blue-500/20">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">Total Fee</p>
                                                <p className="text-3xl font-black">{parcel.delivery_fee || 120} BDT</p>
                                            </div>
                                            <div className="bg-white/20 p-2 rounded-xl">
                                                <Package className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/20">
                                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">Payment Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <p className="text-sm font-bold uppercase tracking-wider">{parcel.payment_status || "Pending"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {parcel.special_instructions && (
                                    <div className="mt-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Special Instructions</h3>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 italic text-sm text-amber-900 font-medium">
                                            "{parcel.special_instructions}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <p className="text-xs font-bold text-gray-400">TrackFleet Pro Premium Service</p>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button
                                onClick={onClose}
                                className="flex-1 md:flex-none h-12 px-10 rounded-xl bg-gray-900 text-white font-black hover:bg-gray-800 transition-all active:scale-95"
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
