// app/(landing)/about-us/page.tsx
import type { Metadata } from "next";
import AboutUsClient from "@/components/Landing/AboutUsClient";

export const metadata: Metadata = {
    title: "About Us - TrackFleet Pro Fleet Management",
    description: "Learn about TrackFleet Pro, our mission to revolutionize fleet management and delivery services with cutting-edge technology and unwavering commitment to excellence.",
    keywords: ["about TrackFleet Pro", "fleet management", "logistics", "courier service", "delivery services", "USA courier"],
    openGraph: {
        title: "About Us - TrackFleet Pro",
        description: "Revolutionizing fleet management and delivery services across USA",
        type: "website",
    },
};

export default function AboutUsPage() {
    return <AboutUsClient />;
}
