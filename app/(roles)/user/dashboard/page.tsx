// app/(dashboard)/dashboard/page.tsx
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { OwnershipBreakdownChart } from "@/components/Dashboard/Home/OwnershipBreakdownChart";
import { RightTypeDistributionChart } from "@/components/Dashboard/Home/RightTypeDistributionChart";
import { MonthlyGrowthTrendChart } from "@/components/Dashboard/Home/MonthlyGrowthTrendChart";
import { LandDistributionZoneChart } from "@/components/Dashboard/Home/LandDistributionZoneChart";
import LandParcelsTable from "@/components/Dashboard/Home/LandParcelsTable";
import { statsData } from "@/data/statsData";

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Analytics Dashboard" 
        description="Real-time property data insights and KPIs" 
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
              iconBgColor={stat.iconBgColor}
              subtitle={stat.subtitle}
            />
          ))}
        </div>

        {/* Charts Row 1 - Pie Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <OwnershipBreakdownChart />
          <RightTypeDistributionChart />
        </div>

        {/* Charts Row 2 - Bar and Line Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyGrowthTrendChart />
          <LandDistributionZoneChart />
        </div>

        {/* Land Parcels Table */}
        <div className="mb-8">
          <LandParcelsTable />
        </div>
      </div>
    </div>
  );
}