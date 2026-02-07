// app/(dashboard)/dashboard/page.tsx
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { statsData } from "@/data/statsData";
import RecentParcels from "@/components/SuperAdmin/Dashboard/RecentParcels";
import ActiveDrivers from "@/components/SuperAdmin/Dashboard/ActiveDrivers";

export default function SuperAdminDashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Dashboard Overview"
        description="A clear view of your tasks"
      />

      <div className="p-4 md:p-8">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
              iconBgColor={stat.iconBgColor}
              subtitle={stat.subtitle}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Parcels - Takes 2 cols */}
          <div className="lg:col-span-2">
            <RecentParcels />
          </div>

          {/* Active Drivers - Takes 1 col */}
          <div className="lg:col-span-1">
            <ActiveDrivers />
          </div>
        </div>
      </div>
    </div>
  );
}