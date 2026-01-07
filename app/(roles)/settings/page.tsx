import ProfileClient from "@/components/Dashboard/Profile/ProfileClient";
import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";

export default function SettingsPage() {
    return (
      <div>
        <DashboardHeader
          title="Settings"
          description="View and manage your settings"
        />
        <div className="p-4 md:px-8 md:py-6">
          <ProfileClient />
        </div>
      </div>
    );
}
