// components/Landing/AboutUsClient.tsx
"use client";

import { Users, Globe, Award, Target, Heart, Check, PackageCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutUsClient() {
    const stats = [
        {
            label: "Years of Experience",
            value: "10+",
            icon: Award,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            label: "Coverage Cities",
            value: "100+",
            icon: Truck,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
        },
        {
            label: "Daily Deliveries",
            value: "10K+",
            icon: PackageCheck,
            color: "text-green-500",
            bgColor: "bg-green-50"
        },
        {
            label: "Happy Customers",
            value: "50K+",
            icon: Users,
            color: "text-orange-500",
            bgColor: "bg-orange-50"
        },
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
            image: "/images/user.webp",
        },
        {
            name: "Jane Smith",
            role: "Operations Director",
            description: "Ensuring seamless operations and customer satisfaction",
            image: "/images/user.webp",
        },
        {
            name: "Mike Johnson",
            role: "Technology Head",
            description: "Driving innovation in fleet management technology",
            image: "/images/user.webp",
        },
    ];

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
                <motion.div 
                    className="max-w-7xl mx-auto text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        Grow with Track Fleet
                    </h1>
                </motion.div>
            </motion.section>


            {/* About Us Section */}
            <section className="py-10 md:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div 
                            className="order-2 lg:order-1"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <div className="inline-block px-4 py-1.5 rounded-full border border-gray-300 text-sm font-medium text-secondary mb-6">
                                About Us
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                                We Provide The Best Quality Courier Services
                            </h2>
                            <p className="text-secondary text-lg mb-8 leading-relaxed">
                                Track Fleet courier is a leading courier service company in USA
                                dedicated to delivering reliable and efficient e-commerce logistics
                                solutions in time.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Daily pickups, no limitations",
                                    "Faster Delivery service",
                                    "Cash on Delivery",
                                ].map((item, index) => (
                                    <motion.div 
                                        key={index} 
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span className="text-secondary font-medium">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div 
                            className="order-1 lg:order-2 relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <img
                                src="/images/delivery.png"
                                alt="Courier Service"
                                className="object-cover w-full h-full"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-10 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#E8F4FD]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        {/* Mission Card */}
                        <motion.div 
                            className="w-full md:w-1/2 lg:w-[40%] shrink-0 bg-white p-6 rounded-xl shadow-none hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-12 h-12 mb-6">
                                <img src="/icons/target.svg" alt="Target" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">
                                Our Mission
                            </h3>
                            <p className="text-secondary text-base leading-relaxed">
                                To put a smile on your face by providing fast, secure, and hassle
                                free deliveries. We're here to connect people and e-commerce
                                businesses worldwide with fast, secure, and top notch service.
                            </p>
                        </motion.div>

                        {/* Vision Card */}
                        <motion.div 
                            className="w-full md:w-1/2 lg:w-[40%] shrink-0 bg-white p-6 rounded-xl shadow-none hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-12 h-12 mb-6">
                                <img src="/icons/mount.svg" alt="Mountain" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">
                                Our Vision
                            </h3>
                            <p className="text-secondary text-base leading-relaxed">
                                Redefine the future of e-commerce logistics in USA through
                                innovative solutions powered by modern technologies.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <motion.section 
                className="bg-linear-to-b from-blue-50 to-white py-8 md:py-16 px-4 sm:px-6 lg:px-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2 
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        About TrackFleet Pro
                    </motion.h2>
                    <motion.p 
                        className="text-xl text-secondary max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Revolutionizing fleet management and delivery services with
                        cutting-edge technology and unwavering commitment to excellence.
                    </motion.p>
                </div>
            </motion.section>

            {/* Stats Section */}
            <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="bg-white border border-gray-100 p-8 rounded-lg flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                >
                                    <motion.div 
                                        className={`mb-6 ${stat.bgColor} p-4 rounded-full`}
                                        whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                                    >
                                        <Icon className={`h-8 w-8 ${stat.color}`} strokeWidth={1.5} />
                                    </motion.div>
                                    <h4 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h4>
                                    <p className="text-secondary text-sm font-medium uppercase tracking-wide">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <motion.section 
                className="py-10 md:py-10 px-4 sm:px-6 lg:px-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-4xl mx-auto">
                    <motion.h2 
                        className="text-3xl font-bold text-foreground mb-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Our Story
                    </motion.h2>
                    <motion.div 
                        className="prose prose-lg max-w-none text-secondary space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
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
                    </motion.div>
                </div>
            </motion.section>

            {/* Values Section */}
            <section className="py-6 md:py-10 my-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.h2 
                        className="text-3xl font-bold text-foreground mb-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Our Values
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div 
                                    key={index} 
                                    className="text-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <motion.div 
                                        className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                                        whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }}
                                    >
                                        <Icon className="h-8 w-8 text-primary" />
                                    </motion.div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-secondary">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-6 md:py-10 my-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.h2 
                        className="text-3xl font-bold text-foreground mb-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Meet Our Team
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            >
                                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                                    <Image src={member.image} alt={member.name} width={96} height={96} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-primary font-medium mb-3">{member.role}</p>
                                <p className="text-secondary text-sm">{member.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <motion.section 
                className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2 
                        className="text-3xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Ready to Experience Excellence?
                    </motion.h2>
                    <motion.p 
                        className="text-xl mb-8 opacity-90"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Join thousands of businesses that trust TrackFleet Pro for their
                        delivery needs.
                    </motion.p>
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/track-parcel"
                                className="inline-block px-8 py-3.5 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Track Your Parcel
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/signup"
                                className="inline-block px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}
