"use client";

import DashboardHeader from "@/components/Shared/DashboardHeader";
import SellerStats from "@/components/SellerAdmin/Dashboard/SellerStats";
import ParcelTrendChart from "@/components/SellerAdmin/Dashboard/ParcelTrendChart";
import RecentActivity from "@/components/SellerAdmin/Dashboard/RecentActivity";
import ActionRequired from "@/components/SellerAdmin/Dashboard/ActionRequired";
import { useGetSellerDashboardStatsQuery } from "@/redux/services/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function SellerAdminDashboardClient() {
  const { data: dashboardData, isLoading, isError, refetch } = useGetSellerDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="p-4 md:p-8 space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[140px] w-full rounded-3xl" />
            ))}
          </div>

          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-[450px] w-full rounded-3xl" />
              <Skeleton className="h-[250px] w-full rounded-3xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[600px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-lg font-medium text-gray-700">Failed to load dashboard data</p>
        <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
            <RefreshCcw className="w-4 h-4" />
            Try Again
        </button>
      </div>
    );
  }

  const { cards, parcel_trend, recent_activity, action_required } = dashboardData?.data || {};

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Dashboard Overview"
        description="A clear view of your tasks"
      />

      <div className="p-4 md:p-8 space-y-8">
        {/* Stats Cards Row */}
        <SellerStats stats={cards} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Trend and Action Required */}
          <div className="lg:col-span-2 space-y-8">
            <div className="h-[450px]">
              <ParcelTrendChart data={parcel_trend} />
            </div>
            <div className="h-fit">
              <ActionRequired actions={action_required} />
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity activities={recent_activity} />
          </div>
        </div>
      </div>
    </div>
  );
}
