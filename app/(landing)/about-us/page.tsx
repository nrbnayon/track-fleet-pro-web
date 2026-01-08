// app/(landing)/about-us/page.tsx
import type { Metadata } from "next";
import {  Users, Globe, Award, Target, Heart } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us - TrackFleet Pro Fleet Management",
    description:
        "Learn about TrackFleet Pro, our mission to revolutionize fleet management and delivery services. Discover our story, values, and commitment to excellence.",
    keywords: [
        "about TrackFleet Pro",
        "company history",
        "fleet management company",
        "delivery service provider",
        "logistics company",
        "our mission",
        "our values",
    ],
    openGraph: {
        title: "About TrackFleet Pro - Our Story and Mission",
        description:
            "Discover how TrackFleet Pro is transforming fleet management and delivery services with innovative solutions.",
        url: "/about-us",
        images: ["/icons/logo.png"],
    },
    alternates: {
        canonical: "/about-us",
    },
};

export default function AboutUsPage() {
    const stats = [
        { label: "Years of Experience", value: "10+" },
        { label: "Daily Deliveries", value: "10K+" },
        { label: "Happy Customers", value: "50K+" },
        { label: "Coverage Cities", value: "100+" },
    ];

    const values = [
        {
            icon: Target,
            title: "Our Mission",
            description:
                "To provide reliable, efficient, and customer-focused delivery solutions that connect businesses and customers seamlessly.",
        },
        {
            icon: Heart,
            title: "Customer First",
            description:
                "We prioritize customer satisfaction in every delivery, ensuring timely and secure shipment of every parcel.",
        },
        {
            icon: Globe,
            title: "Nationwide Coverage",
            description:
                "Expanding our reach across USA to serve more communities and businesses with quality delivery services.",
        },
        {
            icon: Award,
            title: "Excellence",
            description:
                "Committed to maintaining the highest standards in fleet management and delivery operations.",
        },
    ];

    const team = [
        {
            name: "John Doe",
            role: "CEO & Founder",
            description: "Leading TrackFleet Pro with 15+ years of logistics expertise",
        },
        {
            name: "Jane Smith",
            role: "Operations Director",
            description: "Ensuring seamless operations and customer satisfaction",
        },
        {
            name: "Mike Johnson",
            role: "Technology Head",
            description: "Driving innovation in fleet management technology",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        About TrackFleet Pro
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Revolutionizing fleet management and delivery services with
                        cutting-edge technology and unwavering commitment to excellence.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {stat.value}
                                </div>
                                <p className="text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Our Story
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
                        <p>
                            Founded in 2015, TrackFleet Pro began with a simple mission: to
                            make delivery services more reliable and transparent. What started
                            as a small local delivery service has grown into a nationwide
                            fleet management solution serving thousands of businesses.
                        </p>
                        <p>
                            We recognized the challenges businesses face in managing their
                            delivery operations - from tracking parcels to ensuring timely
                            deliveries. Our platform was built to address these pain points
                            with innovative technology and customer-centric approach.
                        </p>
                        <p>
                            Today, TrackFleet Pro handles over 10,000 daily deliveries across
                            100+ cities in the USA. Our commitment to excellence, combined
                            with cutting-edge tracking technology, has made us a trusted
                            partner for businesses of all sizes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                        Our Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                        Meet Our Team
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
                            >
                                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Users className="h-12 w-12 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-primary font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Experience Excellence?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of businesses that trust TrackFleet Pro for their
                        delivery needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/track-parcel"
                            className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Track Your Parcel
                        </a>
                        <a
                            href="/signup"
                            className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}