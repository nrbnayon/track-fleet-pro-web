// components/landing/TrackingFeatures.tsx
"use client";

import { MapPin, Clock, Shield, Bell } from "lucide-react";
import { motion } from "framer-motion";

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
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Why Track With Us?
                    </h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        Experience seamless parcel tracking with our advanced features
                        designed for your convenience.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: index * 0.1,
                                    ease: "easeOut" 
                                }}
                                whileHover={{ 
                                    y: -8,
                                    transition: { duration: 0.3, ease: "easeOut" }
                                }}
                            >
                                <motion.div 
                                    className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4"
                                    initial={{ scale: 0, rotate: -180 }}
                                    whileInView={{ scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ 
                                        duration: 0.6, 
                                        delay: index * 0.1 + 0.2,
                                        ease: "easeOut"
                                    }}
                                    whileHover={{ 
                                        scale: 1.1,
                                        rotate: 5,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <Icon className="h-6 w-6 text-primary" />
                                </motion.div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-secondary text-sm">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}