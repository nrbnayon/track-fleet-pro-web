
"use client";

import { StatsCard } from "@/components/Shared/StatsCard";
import { getStatsData } from "@/data/statsData";
import RecentParcels from "@/components/SuperAdmin/Dashboard/RecentParcels";
import ActiveDrivers from "@/components/SuperAdmin/Dashboard/ActiveDrivers";
import { useGetDashboardStatsQuery } from "@/redux/services/dashboardApi";
import DashboardSkeleton from "@/components/SuperAdmin/Dashboard/DashboardSkeleton";

export default function DashboardClient() {
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-red-100 min-h-[400px]">
        <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-500 mb-4">We encountered an issue while retrieving your dashboard data.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const dashboardData = data.data;
  const stats = getStatsData(dashboardData.stats);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
            iconBgColor={stat.iconBgColor}
            subtitle={stat.title === "Total Drivers" ? undefined : undefined} 
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Parcels - Takes 2 cols */}
        <div className="lg:col-span-2">
          <RecentParcels parcels={dashboardData.recent_parcels} />
        </div>

        {/* Active Drivers - Takes 1 col */}
        <div className="lg:col-span-1">
          <ActiveDrivers drivers={dashboardData.active_drivers} />
        </div>
      </div>
    </div>
  );
}
