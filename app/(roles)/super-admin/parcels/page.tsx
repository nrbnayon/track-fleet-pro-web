//app\(roles)\super-admin\parcels\page.tsx
import DashboardHeader from "@/components/Shared/DashboardHeader";
import ParcelsTable from "@/components/SupperAdmin/ParcelsTable";
import { allParcelsData } from "@/data/allParcelsData";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminParcelsPage() {
    return (
        <div className="min-h-screen space-y-6">
            <DashboardHeader
                title="Parcels Management"
                description="Manage and track all delivery parcels"
            />

            {/* Filter and Search Bar */}
            <div className="px-4 md:px-8 mt-6">
                <div className="bg-white p-4 rounded-lg border border-gray-100 flex flex-col md:flex-row justify-between gap-4 items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search"
                            className="pl-9 bg-gray-50 border-gray-200"
                        />
                    </div>

                    <div className="w-full md:w-auto">
                        <Select>
                            <SelectTrigger className="w-[120px] bg-white border-gray-200">
                                <span className="flex items-center gap-2 text-gray-600">
                                    <Filter className="h-4 w-4" /> Filter
                                </span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-8 pb-8">
                <ParcelsTable data={allParcelsData} />
            </div>
        </div>
    );
}
