"use client";

import { Parcel } from "@/types/parcel";
import TranslatedText from "@/components/Shared/TranslatedText";

interface StatusBreakdownTableProps {
    parcels: Parcel[];
}

export default function StatusBreakdownTable({ parcels }: StatusBreakdownTableProps) {
    // Generate dummy data based on proportions in image
    const breakdown = [
        { status: "Pending", count: 3, percentage: "12%" },
        { status: "Submitted", count: 0, percentage: "0%" },
        { status: "Approved", count: 1, percentage: "4%" },
        { status: "Ongoing", count: 1, percentage: "4%" },
        { status: "Delivered", count: 20, percentage: "80%" },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] h-full">
            <h2 className="text-xl font-bold text-foreground mb-6">
                <TranslatedText text="Status Breakdown" />
            </h2>
            <div className="overflow-hidden rounded-none border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-[#E8F4FD]">
                        <tr>
                            <th className="px-4 py-3 text-xs font-bold text-primary uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-xs font-bold text-primary uppercase tracking-wider">Count</th>
                            <th className="px-4 py-3 text-xs font-bold text-primary uppercase tracking-wider">Percentage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {breakdown.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 text-xs font-semibold text-secondary">{row.status}</td>
                                <td className="px-4 py-4 text-xs font-bold text-foreground">{row.count}</td>
                                <td className="px-4 py-4 text-xs font-semibold text-secondary">{row.percentage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
