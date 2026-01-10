// app/(landing)/coverage/page.tsx
import type { Metadata } from "next";
import CoverageClient from "@/components/Landing/Coverage/CoverageClient";

export const metadata: Metadata = {
    title: "Coverage Areas - Delivery Service Coverage Map",
    description:
        "Check our delivery coverage areas across USA. Search for your location to see if we deliver to your area. Track Fleet provides nationwide delivery services.",
    keywords: [
        "delivery coverage",
        "service areas",
        "delivery locations",
        "shipping areas",
        "coverage map",
        "delivery zones",
        "USA delivery",
        "nationwide shipping",
    ],
    openGraph: {
        title: "Coverage Areas - Check Our Delivery Service Coverage",
        description:
            "Find out if we deliver to your area. Search our coverage map to see all the locations we serve across USA.",
        url: "/coverage",
        images: ["/icons/logo.png"],
    },
    alternates: {
        canonical: "/coverage",
    },
};

// Prevent static generation since this page uses Leaflet map (requires window object)
export const dynamic = 'force-dynamic';

export default function CoveragePage() {
    return <CoverageClient />;
}