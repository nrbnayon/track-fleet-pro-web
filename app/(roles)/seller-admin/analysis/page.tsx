import DashboardHeader from "@/components/Shared/DashboardHeader";
import SellerAnalysisClient from "@/components/SellerAdmin/Analysis/SellerAnalysisClient";

export default function SellerAdminAnalysisPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <DashboardHeader
                title="Analytics Dashboard"
                description="Performance metrics and insights"
            />

            <div className="p-4 md:px-8 md:py-6">
                <SellerAnalysisClient />
            </div>
        </div>
    );
}
