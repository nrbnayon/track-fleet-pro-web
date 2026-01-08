// app/(landing)/layout.tsx
import type { Metadata } from "next";
import LandingNavbar from "@/components/Landing/Navbar";
import LandingFooter from "@/components/Landing/Footer";

export const metadata: Metadata = {
    title: {
        default: "Track Your Parcel | TrackFleet Pro",
        template: "%s | TrackFleet Pro",
    },
    description:
        "Track your parcels in real-time with TrackFleet Pro. Enter your tracking number to get instant updates on your shipment status, location, and delivery estimates.",
    keywords: [
        "parcel tracking",
        "track package",
        "shipment tracking",
        "delivery status",
        "track consignment",
        "real-time tracking",
        "TrackFleet Pro tracking",
        "package delivery",
        "courier tracking",
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/track-parcel",
        siteName: "TrackFleet Pro",
        title: "Track Your Parcel - Real-Time Shipment Tracking",
        description:
            "Track your parcels in real-time. Get instant updates on shipment status, location, and estimated delivery time.",
        images: [
            {
                url: "/icons/logo.png",
                width: 1200,
                height: 630,
                alt: "TrackFleet Pro - Parcel Tracking",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Track Your Parcel | TrackFleet Pro",
        description:
            "Real-time parcel tracking. Enter your tracking number for instant shipment updates.",
        images: ["/icons/logo.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/track-parcel",
    },
};

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <LandingNavbar />
            <main className="flex-1">{children}</main>
            <LandingFooter />
        </div>
    );
}