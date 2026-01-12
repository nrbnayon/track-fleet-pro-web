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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddParcelModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddParcelModal({ isOpen, onClose }: AddParcelModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-6 rounded-2xl border-none">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 mb-4">Add New Parcel</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipientName" className="text-sm font-semibold text-gray-700">Recipient Name</Label>
                            <Input
                                id="recipientName"
                                placeholder="John Doe"
                                className="bg-gray-50 border-gray-100 rounded-xl h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="recipientNumber" className="text-sm font-semibold text-gray-700">Recipient Number</Label>
                            <Input
                                id="recipientNumber"
                                placeholder="000-0000-000"
                                className="bg-gray-50 border-gray-100 rounded-xl h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recipientAddress" className="text-sm font-semibold text-gray-700">Recipient Address</Label>
                        <Input
                            id="recipientAddress"
                            placeholder="H42, Road 19, Shyamoli, Dhaka"
                            className="bg-gray-50 border-gray-100 rounded-xl h-11"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="parcelType" className="text-sm font-semibold text-gray-700">Parcel Type</Label>
                            <Select defaultValue="fragile">
                                <SelectTrigger className="bg-gray-50 border-gray-100 rounded-xl h-11">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fragile">Fragile</SelectItem>
                                    <SelectItem value="document">Document</SelectItem>
                                    <SelectItem value="electronics">Electronics</SelectItem>
                                    <SelectItem value="clothing">Clothing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parcelWeight" className="text-sm font-semibold text-gray-700">Parcel Weight (kg)</Label>
                            <Input
                                id="parcelWeight"
                                placeholder="2.5 Kg"
                                className="bg-gray-50 border-gray-100 rounded-xl h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add a note."
                            className="bg-gray-50 border-gray-100 rounded-xl min-h-[100px] resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <Button
                        onClick={onClose}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl h-11 transition-all shadow-lg shadow-blue-500/25"
                    >
                        Add Parcel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
