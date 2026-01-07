// app\(roles)\admin\history\page.tsx

import HistoryClient from "@/components/Dashboard/History/HistoryClient";
import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";

export default function HistoryPage() {
  return (
    <div className="h-screen">
      <DashboardHeader
        title="History"
        description="A detailed log of every action taken across the platform."
      />
      <div className="p-4 md:px-8 md:py-6">
        <HistoryClient />
      </div>
    </div>
  );
}
