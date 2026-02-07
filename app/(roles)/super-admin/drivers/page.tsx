// app/(roles)/admin/users/page.tsx
import DashboardHeader from "@/components/Shared/DashboardHeader";
import DriverManagementClient from "@/components/SuperAdmin/DriversManagement/DriverManagementClient";

export default function DriverManagementPage() {
  return (
    <div className="h-screen">
      <DashboardHeader
        title="Drivers Management"
        description="Manage and monitor delivery drivers"
      />

      <div className="p-4 md:px-8 md:py-6">
        <DriverManagementClient itemsPerPage={10} />
      </div>
    </div>
  );
}
