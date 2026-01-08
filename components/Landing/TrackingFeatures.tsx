// components/landing/TrackingFeatures.tsx
import { MapPin, Clock, Shield, Bell } from "lucide-react";

export default function TrackingFeatures() {
    const features = [
        {
            icon: MapPin,
            title: "Real-Time Location",
            description:
                "Track your parcel's exact location with live GPS updates and detailed route information.",
        },
        {
            icon: Clock,
            title: "Delivery Estimates",
            description:
                "Get accurate delivery time predictions based on real-time traffic and route conditions.",
        },
        {
            icon: Shield,
            title: "Secure Tracking",
            description:
                "Your tracking information is encrypted and secured with industry-standard protocols.",
        },
        {
            icon: Bell,
            title: "Instant Notifications",
            description:
                "Receive immediate updates via SMS and email for every status change of your parcel.",
        },
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Why Track With Us?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Experience seamless parcel tracking with our advanced features
                        designed for your convenience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}