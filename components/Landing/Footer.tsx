// components/landing/Footer.tsx
import Link from "next/link";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

export default function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#E8F4FD] text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">TF</span>
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
                    </div>

                    {/* Quick Links */}
                    <div>
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
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-foreground font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p className="text-secondary">
                        {currentYear}, Track Fleet. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}