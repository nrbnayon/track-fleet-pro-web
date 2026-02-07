
import DashboardHeader from "@/components/Shared/DashboardHeader";
import AnalysisDashboardClient from "@/components/SuperAdmin/Analysis/AnalysisDashboardClient";

export default function AnalysisPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <DashboardHeader
                title="Analytics Dashboard"
                description="Performance metrics and insights"
            />

            <div className="p-4 md:px-8 md:py-6">
                <AnalysisDashboardClient />
            </div>
        </div>
    );
}
