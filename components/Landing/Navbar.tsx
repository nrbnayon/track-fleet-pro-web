// components/landing/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-28 h-12  rounded-lg flex items-center justify-center">
                            <img src="/icons/logo.png" alt="TFP" />
                        </div>
                        {/* <span className="font-bold text-xl text-foreground">
                            TrackFleet Pro
                        </span> */}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/track-parcel"
                            className={`font-medium transition-colors ${pathname === "/track-parcel"
                                ? "text-primary"
                                : "text-gray-700 hover:text-primary"
                                }`}
                        >
                            Track Parcel
                        </Link>
                        <Link
                            href="/coverage"
                            className={`font-medium transition-colors ${pathname === "/coverage"
                                ? "text-primary"
                                : "text-gray-700 hover:text-primary"
                                }`}
                        >
                            Coverage
                        </Link>
                        <Link
                            href="/about-us"
                            className={`font-medium transition-colors ${pathname === "/about-us"
                                ? "text-primary"
                                : "text-gray-700 hover:text-primary"
                                }`}
                        >
                            About Us
                        </Link>
                        <Button asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        <Link
                            href="/track-parcel"
                            className={`block px-3 py-2 rounded-md font-medium ${pathname === "/track-parcel"
                                ? "text-primary bg-blue-50"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Track Parcel
                        </Link>
                        <Link
                            href="/coverage"
                            className={`block px-3 py-2 rounded-md font-medium ${pathname === "/coverage"
                                ? "text-primary bg-blue-50"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Coverage
                        </Link>
                        <Link
                            href="/about-us"
                            className={`block px-3 py-2 rounded-md font-medium ${pathname === "/about-us"
                                ? "text-primary bg-blue-50"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About Us
                        </Link>
                        <Button asChild className="w-full">
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                Sign In
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}