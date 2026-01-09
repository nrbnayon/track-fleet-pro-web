// app/(roles)/admin/users/page.tsx
import DashboardHeader from "@/components/Shared/DashboardHeader";
import UserManagementClient from "@/components/Dashboard/UserManagement/UserManagementClient";

export default function UserManagementPage() {
  return (
    <div className="h-screen">
      <DashboardHeader
        title="User Management"
        description="Add, edit, and manage user records"
      />

      <div className="p-4 md:px-8 md:py-6">
        <UserManagementClient itemsPerPage={10} />
      </div>
    </div>
  );
}
