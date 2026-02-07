
import DashboardHeader from "@/components/Shared/DashboardHeader";
import DashboardClient from "@/components/SuperAdmin/Dashboard/DashboardClient";

export default function SuperAdminDashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Dashboard Overview"
        description="A clear view of your tasks"
      />

      <div className="p-4 md:p-8">
        <DashboardClient />
      </div>
    </div>
  );
}
