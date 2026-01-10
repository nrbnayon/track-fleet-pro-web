
import DashboardHeader from "@/components/Shared/DashboardHeader";
import SellerManagementClient from "@/components/SupperAdmin/SellersManagement/SellerManagementClient";

export default function SellerManagementPage() {
    return (
        <div className="h-screen">
            <DashboardHeader
                title="Sellers Management"
                description="Manage and monitor the sellers"
            />

            <div className="p-4 md:px-8 md:py-6">
                <SellerManagementClient itemsPerPage={10} />
            </div>
        </div>
    );
}
