"use client";

import DashboardHeader from "@/components/Shared/DashboardHeader";
import SellerStats from "@/components/SellerAdmin/Dashboard/SellerStats";
import ParcelTrendChart from "@/components/SellerAdmin/Dashboard/ParcelTrendChart";
import RecentActivity from "@/components/SellerAdmin/Dashboard/RecentActivity";
import ActionRequired from "@/components/SellerAdmin/Dashboard/ActionRequired";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SellerAdminDashboardPage() {
  const { role, isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || role !== "seller_admin")) {
      // If not authenticated or not seller_admin, we could redirect or show unauthorized
      // For now, let's just log or handle it if needed.
      // In a real app, middleware would handle this.
    }
  }, [role, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (role !== "seller_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Dashboard Overview"
        description="A clear view of your tasks"
      />

      <div className="p-4 md:p-8 space-y-8">
        {/* Stats Cards Row */}
        <SellerStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Trend and Action Required */}
          <div className="lg:col-span-2 space-y-8">
            <div className="h-[450px]">
              <ParcelTrendChart />
            </div>
            <div className="h-fit">
              <ActionRequired />
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
