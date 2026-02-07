import DashboardHeader from "@/components/Shared/DashboardHeader";
import SellerStats from "@/components/SellerAdmin/Dashboard/SellerStats";
import ParcelTrendChart from "@/components/SellerAdmin/Dashboard/ParcelTrendChart";
import RecentActivity from "@/components/SellerAdmin/Dashboard/RecentActivity";
import ActionRequired from "@/components/SellerAdmin/Dashboard/ActionRequired";

export default function SellerAdminDashboardPage() {
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
