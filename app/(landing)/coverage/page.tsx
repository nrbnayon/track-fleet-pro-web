// app/(landing)/coverage/page.tsx
import type { Metadata } from "next";
import CoverageSearch from "@/components/Landing/CoverageSearch";
import CoverageMap from "@/components/Landing/CoverageMap";

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

export default function CoveragePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section
                style={{
                    background:
                        "linear-gradient(90deg, rgba(29,146,237,0.25) 0%, rgba(127,195,249,0.25) 20%, rgba(194,228,255,0.25) 40%, rgba(194,228,255,0.25) 60%, rgba(127,195,249,0.25) 80%, rgba(29,146,237,0.25) 100%)",
                }}
                className="py-6 md:py-10 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        We are available in all over USA
                    </h1>
                </div>
            </section>


            {/* Search Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Search Your Area
                        </h2>
                        <p className="text-secondary">
                            Now you can easily search your area here
                        </p>
                    </div>
                    <CoverageSearch />
                </div>
            </section>

            {/* Map Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold text-foreground mb-6">
                        We deliver almost all over USA
                    </h3>
                    <CoverageMap />
                </div>
            </section>
        </div>
    );
}