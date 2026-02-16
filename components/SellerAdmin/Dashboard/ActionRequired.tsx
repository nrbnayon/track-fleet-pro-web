"use client";

import { SellerActionRequired } from "@/redux/services/dashboardApi";
import { useMemo } from "react";
import { Clock, Truck, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActionRequiredProps {
    actions?: SellerActionRequired;
}

export default function ActionRequired({ actions }: ActionRequiredProps) {

    const displayActions = useMemo(() => {
        return [
            {
                label: "Parcels awaiting for drivers to be assigned",
                count: actions?.["awaiting_assignment to be driver"] || 0,
                icon: Clock,
                iconColor: "text-amber-500",
                iconBgColor: "bg-amber-50",
            },
            {
                label: "Parcels in transit",
                count: actions?.in_transit || 0,
                icon: Truck,
                iconColor: "text-blue-500",
                iconBgColor: "bg-blue-50",
            },
            {
                label: "Delivered this week",
                count: actions?.delivered_this_week || 0,
                icon: CheckCircle,
                iconColor: "text-emerald-500",
                iconBgColor: "bg-emerald-50",
            },
        ];
    }, [actions]);

    return (
        <div className="bg-white p-6 rounded-2xl border-none shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] h-full flex flex-col">
            <h2 className="text-xl font-bold text-foreground mb-6">Action Required</h2>

            <div className="space-y-4 flex-1">
                {displayActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-4">
                            <div className={cn("p-2 rounded-lg", action.iconBgColor)}>
                                <action.icon className={cn("w-5 h-5", action.iconColor)} />
                            </div>
                            <p className="text-sm font-medium text-gray-700">{action.label}</p>
                        </div>
                        <span className="text-sm font-bold text-foreground">{action.count}</span>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <Link
                    href="/seller-admin/parcels"
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/25"
                >
                    View All Parcels
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
