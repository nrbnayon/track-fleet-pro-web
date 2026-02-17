// app/(landing)/track-parcel/page.tsx
import type { Metadata } from "next";
import TrackParcelClient from "@/components/Landing/TrackParcelClient";

export const metadata: Metadata = {
    title: "Track Your Parcel - Real-time Package Tracking",
    description: "Track your parcel in real-time with TrackFleet Pro. Get instant updates on your package delivery status, location, and estimated delivery time across USA.",
    keywords: ["track parcel", "package tracking", "shipment tracking", "delivery tracking", "real-time tracking", "TrackFleet Pro"],
    openGraph: {
        title: "Track Your Parcel - TrackFleet Pro",
        description: "Real-time package tracking across USA. Track your consignment easily and get instant delivery updates.",
        type: "website",
    },
};

export default async function TrackParcelPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const trackingId = typeof params.tracking_id === "string" ? params.tracking_id : undefined;

    return <TrackParcelClient initialTrackingId={trackingId} />;
}