// components/Sidebar.tsx - RBAC-enabled Sidebar
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LogOut,
  PanelLeftOpen,
  PanelRightOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  DashboardSquare02Icon,
  UserGroup03Icon,
  WaterfallUp01Icon,
  CloudUploadIcon,
  Clock05Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";
import TranslatedText from "@/components/Shared/TranslatedText";
import LogoutModal from "../Shared/LogoutModal";

interface SubLink {
  label: string;
  href: string;
  roles?: string[]; // Roles that can access this sublink
}

interface LinkType {
  label: string;
  href: string;
  icon: IconSvgElement;
  subLinks?: SubLink[];
  roles?: string[]; // Roles that can access this link
}

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const pathname = usePathname();
  const { logout } = useLogout();
  const [open, setOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [, setUserResizedWidth] = useState<number | null>(null);
  const [manualToggle, setManualToggle] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userRole, setUserRole] = useState<string>("user");
  const [userName, setUserName] = useState<string>("User");
  const [userEmail, setUserEmail] = useState<string>("");

  const minWidth = 80;
  const maxWidth = 400;
  console.log(userEmail);
  // Get user role from cookie on component mount
  useEffect(() => {
    const getUserRole = () => {
      const cookies = document.cookie.split(";");
      const roleCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("userRole=")
      );
      return roleCookie ? roleCookie.split("=")[1] : "user";
    };

    const getUserEmail = () => {
      const cookies = document.cookie.split(";");
      const emailCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("userEmail=")
      );
      return emailCookie ? decodeURIComponent(emailCookie.split("=")[1]) : "";
    };

    const role = getUserRole();
    const email = getUserEmail();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserRole(role);
    setUserEmail(email);

    // Set user name based on role
    if (role === "superadmin") {
      setUserName("Super Admin");
    } else if (role === "selleradmin") {
      setUserName("Seller Admin");
    } else {
      setUserName("Customer");
    }
  }, []);

  // Memoize links array with role-based access control
  const links: LinkType[] = useMemo(
    () => [
      {
        label: "Dashboard Overview",
        href: userRole === "superadmin" ? "/super-admin/dashboard" : "/seller-admin/dashboard",
        icon: DashboardSquare02Icon,
        roles: ["superadmin", "selleradmin"], // All roles can access
      },
      {
        label: "Upload Data",
        href: "/admin/upload-data",
        icon: CloudUploadIcon,
        roles: ["admin"], // Only admin can access
      },
      {
        label: "User Management",
        href: "/admin/users",
        icon: UserGroup03Icon,
        roles: ["admin"], // Only admin can access
      },
      {
        label: "History",
        href: "/admin/history",
        icon: Clock05Icon,
        roles: ["admin"], // Only admin can access
      },

      // user links
      {
        label: "Data",
        href: "/user/data",
        icon: WaterfallUp01Icon,
        roles: ["user"], // User only
      },

      // shared links
      {
        label: "Settings",
        href: "/settings",
        icon: Settings01Icon,
        roles: ["admin", "user"], // All roles can access
      },
    ],
    [userRole]
  );

  // Filter links based on user role
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      // If no roles specified, show to everyone
      if (!link.roles || link.roles.length === 0) return true;
      // Check if user's role is in the allowed roles
      return link.roles.includes(userRole);
    });
  }, [links, userRole]);

  // Check if current path matches link or its sublinks (including dynamic routes)
  const isLinkActive = useCallback(
    (link: LinkType) => {
      // Exact match
      if (pathname === link.href) return true;

      // Check if pathname starts with link.href (for dynamic routes like /users/123)
      if (pathname.startsWith(link.href + "/")) return true;

      // Check sublinks
      if (link.subLinks) {
        return link.subLinks.some((subLink) => {
          // Exact match
          if (pathname === subLink.href) return true;
          // Dynamic route match
          if (pathname.startsWith(subLink.href + "/")) return true;
          return false;
        });
      }

      return false;
    },
    [pathname]
  );

  // Toggle expanded state for items with sublinks
  const toggleExpanded = useCallback((label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  }, []);

  // Auto-expand items if their sublink is active
  useEffect(() => {
    filteredLinks.forEach((link) => {
      if (
        link.subLinks &&
        link.subLinks.some(
          (subLink) =>
            pathname === subLink.href || pathname.startsWith(subLink.href + "/")
        )
      ) {
        if (!expandedItems.includes(link.label)) {
          setExpandedItems((prev) => [...prev, link.label]);
        }
      }
    });
  }, [pathname, filteredLinks, expandedItems]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(sidebarWidth);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const newWidth = Math.min(
        Math.max(startWidth + deltaX, minWidth),
        maxWidth
      );

      setSidebarWidth(newWidth);
      setUserResizedWidth(newWidth);

      if (newWidth <= minWidth + 20) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, startWidth]);

  // Handle width update after resizing completes
  useEffect(() => {
    if (!isResizing && manualToggle) {
      const timeoutId = setTimeout(() => {
        if (open) {
          setSidebarWidth(220);
          setUserResizedWidth(220);
        } else {
          setSidebarWidth(minWidth);
        }
        setManualToggle(false);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [open, isResizing, manualToggle, minWidth]);

  const handleToggleClick = () => {
    if (!isResizing) {
      const newOpen = !open;
      if (newOpen) {
        setSidebarWidth(220);
        setUserResizedWidth(220);
      } else {
        setSidebarWidth(minWidth);
      }
      setOpen(newOpen);
    } else {
      setManualToggle(true);
      setOpen(!open);
    }
  };

  // Handle logout functionality
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Render icon with proper styling
  const renderIcon = useCallback((icon: IconSvgElement, isActive: boolean) => {
    return (
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2}
        className={cn(
          "h-6 w-6 shrink-0 transition-colors duration-200",
          isActive
            ? "text-white font-bold"
            : "text-[#0E2C48] group-hover:text-[#0E2C48] font-bold"
        )}
      />
    );
  }, []);

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-primary";
      case "manager":
        return "text-secondary";
      case "user":
        return "text-primary";
      default:
        return "text-secondary";
    }
  };

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Super Admin";
      case "manager":
        return "Manager";
      case "user":
        return "User";
      default:
        return "User";
    }
  };

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray w-full flex-1 mx-auto",
        "h-screen overflow-hidden relative"
      )}
    >
      <div className="relative overflow-visible flex">
        <Sidebar
          open={open}
          setOpen={setOpen}
          animate={true}
          width={sidebarWidth}
        >
          <SidebarBody
            className={cn(
              "justify-between gap-10 border-0.5",
              "bg-white text-[#0E2C48]"
            )}
          >
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="flex items-center justify-center my-6">
                <Logo open={open} />
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-2">
                {filteredLinks.map((link, idx) => {
                  const isActive = isLinkActive(link);
                  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
                  const isExpanded = expandedItems.includes(link.label);
                  const isHovered = hoveredItem === link.label;

                  const filteredSubLinks = link.subLinks?.filter(
                    (subLink) =>
                      !subLink.roles || subLink.roles.includes(userRole)
                  );

                  const shouldShowSublinks =
                    hasSubLinks &&
                    (isExpanded || isHovered) &&
                    open &&
                    filteredSubLinks &&
                    filteredSubLinks.length > 0;

                  return (
                    <div
                      key={idx}
                      className="relative"
                      onMouseEnter={() => {
                        if (hasSubLinks) {
                          setHoveredItem(link.label);
                        }
                      }}
                      onMouseLeave={() => {
                        if (hasSubLinks && !isExpanded) {
                          setTimeout(() => {
                            setHoveredItem((prev) =>
                              prev === link.label ? null : prev
                            );
                          }, 200);
                        }
                      }}
                    >
                      {/* Main Link */}
                      <div className="flex items-center relative">
                        <Link
                          href={link.href}
                          onClick={() => {
                            if (window.innerWidth < 768) {
                              setOpen(false);
                            }
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-md transition-all duration-200 group flex-1 relative",
                            isActive
                              ? "bg-primary text-white font-bold"
                              : "hover:text-foreground hover:bg-primary/30"
                          )}
                        >
                          <span className="shrink-0">
                            {renderIcon(link.icon, isActive)}
                          </span>
                          <motion.span
                            animate={{
                              display: open ? "inline-block" : "none",
                              opacity: open ? 1 : 0,
                            }}
                            className="text-md"
                          >
                            <TranslatedText text={link.label} />
                          </motion.span>

                          {/* Expand/Collapse Button */}
                          {hasSubLinks && open && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleExpanded(link.label);
                              }}
                              className={cn(
                                "p-1 rounded transition-all duration-200 hover:bg-gray-200",
                                isActive && "text-white"
                              )}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </Link>
                      </div>

                      {/* Sub Links Container */}
                      {shouldShowSublinks && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-8 mt-1 space-y-1 overflow-hidden"
                          onMouseEnter={() => {
                            setHoveredItem(link.label);
                          }}
                          onMouseLeave={() => {
                            if (!isExpanded) {
                              setTimeout(() => {
                                setHoveredItem((prev) =>
                                  prev === link.label ? null : prev
                                );
                              }, 200);
                            }
                          }}
                        >
                          {filteredSubLinks.map((subLink, subIdx) => {
                            const isSubLinkActive =
                              pathname === subLink.href ||
                              pathname.startsWith(subLink.href + "/");

                            return (
                              <Link
                                key={subIdx}
                                href={subLink.href}
                                onClick={() => {
                                  if (window.innerWidth < 768) {
                                    setOpen(false);
                                  }
                                }}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm",
                                  isSubLinkActive
                                    ? "bg-gradient-purple text-white font-bold"
                                    : "text-secondary hover:text-primary hover:bg-gray-50"
                                )}
                              >
                                <span className="text-sm whitespace-pre">
                                  {subLink.label}
                                </span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section */}
            <div>
              {/* User Profile */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-3">
                  <Link
                    href="/profile"
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setOpen(false);
                      }
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <Image
                        src="/images/avatar.png"
                        alt="User"
                        width={40}
                        height={40}
                      />
                    </div>
                    <motion.div
                      animate={{
                        display: open ? "block" : "none",
                        opacity: open ? 1 : 0,
                      }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-base font-medium truncate">
                        {userName}
                      </p>
                      <p
                        className={cn(
                          "text-sm truncate",
                          getRoleBadgeColor(userRole)
                        )}
                      >
                        {getRoleDisplayName(userRole)}
                      </p>
                    </motion.div>
                  </Link>
                  <motion.button
                    onClick={handleLogoutClick}
                    animate={{
                      display: open ? "block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="p-1 hover:bg-red-50 rounded transition-colors hover:text-red-500 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Resizable Border */}
        <div
          className="hidden md:block w-1 bg-white cursor-col-resize border-r border-gray-200 hover:bg-blue-500/20 transition-colors duration-200 relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 w-2 -ml-0.5 bg-transparent" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggleClick}
          className={cn(
            "absolute hidden md:flex top-4 z-80 cursor-pointer p-2 rounded-full bg-gray border border-gray-300 shadow-none hover:bg-gray-50 transition-all duration-200",
            open ? "-right-3" : "-right-3"
          )}
        >
          {open ? (
            <PanelRightOpen className="h-4 w-4 text-secondary" />
          ) : (
            <PanelLeftOpen className="h-4 w-4 text-secondary" />
          )}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={logout}
      />

      <Dashboard>{children}</Dashboard>
    </div>
  );
}

const Logo = ({ open }: { open: boolean }) => {
  return (
    <div className="font-normal flex items-center text-sm relative z-20 w-full justify-center">
      <motion.div
        animate={{
          width: open ? "120px" : "40px",
          height: open ? "auto" : "40px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex items-center justify-center overflow-hidden"
      >
        <Image
          className="w-full h-full object-contain"
          alt="TalkFlow Logo"
          src="/icons/logo.png"
          width={open ? 120 : 40}
          height={open ? 120 : 40}
          priority
        />
      </motion.div>
    </div>
  );
};

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 bg-gray">
      <div className="p-0 flex flex-col gap-2 flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-custom scrollbar-thin">
        {children}
      </div>
    </div>
  );
};
