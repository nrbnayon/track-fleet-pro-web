// app/(dashboard)/dashboard/page.tsx
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { statsData } from "@/data/statsData";

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

        
      </div>
    </div>
  );
}