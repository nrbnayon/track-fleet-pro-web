// components/landing/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { ConfirmationModal } from "@/components/Shared/ConfirmationModal";
import { deleteCookie } from "@/redux/services/apiSlice";
import { motion } from "framer-motion";

export default function LandingNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, fullName, email, role, profileImage, isLoading } = useUser();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        if (isProfileDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    const handleLogout = () => {
        // Delete all auth cookies
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("userRole");
        deleteCookie("userId");
        deleteCookie("userEmail");

        // Redirect to login
        router.push("/login");
        setIsProfileDropdownOpen(false);
    };

    const getDashboardLink = () => {
        if (role === "SUPER_ADMIN") {
            return "/super-admin/dashboard";
        } else if (role === "SELLER") {
            return "/seller-admin/dashboard";
        }
        return null;
    };

    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const dashboardLink = getDashboardLink();

    return (
        <>
            <motion.nav 
                className="bg-white shadow-[6px_6px_54px_#0000000d] sticky top-0 z-50"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-28 h-12 rounded-lg flex items-center justify-center">
                                <img src="/icons/logo.png" alt="TFP" />
                            </div>
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

                            {/* Auth Section */}
                            {!isLoading && (
                                <>
                                    {isAuthenticated ? (
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                                className="flex items-center space-x-0.5 focus:outline-none group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold overflow-hidden ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
                                                    {profileImage ? (
                                                        <img
                                                            src={profileImage}
                                                            alt={fullName || "User"}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>{getInitials(fullName)}</span>
                                                    )}
                                                </div>
                                                <ChevronDown
                                                    className={`w-4 h-4 text-gray-600 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isProfileDropdownOpen && (
                                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {/* User Info */}
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {fullName || "User"}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">{email}</p>
                                                        <p className="text-xs text-primary font-medium mt-1">
                                                            {role?.replace("_", " ")}
                                                        </p>
                                                    </div>

                                                    {/* Dashboard Link (hidden for CUSTOMER) */}
                                                    {dashboardLink && (
                                                        <Link
                                                            href={dashboardLink}
                                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                            onClick={() => setIsProfileDropdownOpen(false)}
                                                        >
                                                            <LayoutDashboard className="w-4 h-4" />
                                                            <span>Dashboard</span>
                                                        </Link>
                                                    )}

                                                    {/* Logout */}
                                                    <button
                                                        onClick={() => {
                                                            setIsLogoutModalOpen(true);
                                                            setIsProfileDropdownOpen(false);
                                                        }}
                                                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Button asChild>
                                            <Link href="/login">Sign In</Link>
                                        </Button>
                                    )}
                                </>
                            )}
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

                            {/* Mobile Auth Section */}
                            {!isLoading && (
                                <>
                                    {isAuthenticated ? (
                                        <div className="pt-2 border-t border-gray-200 space-y-2">
                                            {/* User Info */}
                                            <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold overflow-hidden flex-shrink-0">
                                                        {profileImage ? (
                                                            <img
                                                                src={profileImage}
                                                                alt={fullName || "User"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span>{getInitials(fullName)}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {fullName || "User"}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">{email}</p>
                                                        <p className="text-xs text-primary font-medium">
                                                            {role?.replace("_", " ")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dashboard Link (hidden for CUSTOMER) */}
                                            {dashboardLink && (
                                                <Link
                                                    href={dashboardLink}
                                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            )}

                                            {/* Logout */}
                                            <button
                                                onClick={() => {
                                                    setIsLogoutModalOpen(true);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <Button asChild className="w-full">
                                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                                Sign In
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </motion.nav>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Confirm Logout"
                message="Are you sure you want to logout from your account?"
                confirmText="Logout"
                cancelText="Cancel"
                isDestructive={true}
            />
        </>
    );
}