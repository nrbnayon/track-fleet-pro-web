// components/landing/Footer.tsx
"use client";

import Link from "next/link";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer 
            className="bg-[#E8F4FD] text-foreground w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <motion.div 
                        className="col-span-1 md:col-span-2"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                <Image src="/icons/logo.png" alt="Logo" width={40} height={40} />
                            </div>
                            <span className="font-bold text-xl text-foreground">
                                TrackFleet Pro
                            </span>
                        </div>
                        <p className="text-sm mb-4 max-w-md">
                            House# 44, Rd No. 2/A, Dhanmondi, Dhaka 1209
                        </p>
                        <p className="text-sm mb-2">E-mail: example@gmail.com</p>
                        <p className="text-sm">Hotline: 000-0000-000</p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="text-foreground font-semibold mb-4">Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/track-parcel"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    Track Parcel
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/coverage"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    Coverage
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about-us"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Social Media */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h3 className="text-foreground font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            {[
                                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                                { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                                { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                                { Icon: Instagram, href: "https://instagram.com", label: "Instagram" }
                            ].map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                >
                                    <social.Icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div 
                    className="border-t border-gray-800 mt-8 pt-8 text-center text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <p className="text-secondary">
                        {currentYear}, Track Fleet. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    );
}