// components/Landing/TrackParcelClient.tsx
"use client";

import TrackParcelForm from "@/components/Landing/TrackParcelForm";
import TrackingFeatures from "@/components/Landing/TrackingFeatures";
import { motion } from "framer-motion";

export default function TrackParcelClient() {
    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <motion.h1 
                            className="text-xl sm:text-2xl lg:text-4xl font-bold text-foreground mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        >
                            Tracking Your Consignment
                        </motion.h1>
                        <motion.p 
                            className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        >
                            Now you can easily track your consignment
                        </motion.p>
                    </motion.div>

                    {/* Tracking Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                    >
                        <TrackParcelForm />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <div>
                <TrackingFeatures />
            </div>

            {/* Trust Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { value: "10K+", label: "Daily Deliveries", delay: 0.1 },
                            { value: "99.8%", label: "On-Time Delivery", delay: 0.2 },
                            { value: "24/7", label: "Customer Support", delay: 0.3 }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: stat.delay, ease: "easeOut" }}
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            >
                                <motion.div 
                                    className="text-4xl font-bold text-primary mb-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: stat.delay + 0.1 }}
                                >
                                    {stat.value}
                                </motion.div>
                                <p className="text-secondary">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
