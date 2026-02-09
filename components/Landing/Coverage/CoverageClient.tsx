"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CoverageSearch from "@/components/Landing/Coverage/CoverageSearch";
import { motion } from "framer-motion";

const CoverageMap = dynamic(() => import("@/components/Landing/Coverage/CoverageMap"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl" />
});

export default function CoverageClient() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <motion.section
                style={{
                    background:
                        "linear-gradient(90deg, rgba(29,146,237,0.25) 0%, rgba(127,195,249,0.25) 20%, rgba(194,228,255,0.25) 40%, rgba(194,228,255,0.25) 60%, rgba(127,195,249,0.25) 80%, rgba(29,146,237,0.25) 100%)",
                }}
                className="py-6 md:py-10 px-4 sm:px-6 lg:px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1 
                        className="text-3xl md:text-4xl font-bold text-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        We are available in all over USA
                    </motion.h1>
                </div>
            </motion.section>

            {/* Search Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center md:my-8 my-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Search Your Area
                        </h2>
                        <p className="text-secondary">
                            Now you can easily search your area here
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <CoverageSearch onSearch={setSearchQuery} />
                    </motion.div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.h3 
                        className="text-2xl font-bold text-foreground mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        We deliver almost all over USA
                    </motion.h3>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <CoverageMap searchQuery={searchQuery} />
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
