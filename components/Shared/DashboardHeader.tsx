"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function DashboardHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const { role, fullName, profileImage } = useUser();

  // Fallback display values
  const displayName = fullName || "User";
  const displayRole = role ? role.replace('_', ' ') : "User";
  // const avatarSrc = profileImage || "/images/user.webp";

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // console.log("Profile Data: ", fullName, avatarSrc, role);

  return (
    <div className="bg-white flex justify-between items-center border-b border-border">
      <div className="flex flex-col items-start justify-between p-4 md:px-8">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-secondary mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 px-4 md:px-8">
        {/* Notification Icon with Indicator */}
        <Link
          href='/notifications'
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {/* Notification indicator dot */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </Link>

        {/* User Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold overflow-hidden shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs">{getInitials(displayName)}</span>
            )}
          </div>
          <div className="hidden md:flex flex-col">
            <p className="text-sm font-medium text-foreground capitalize">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {displayRole.toLowerCase()}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}