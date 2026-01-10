// app/(roles)/super-admin/parcels/page.tsx
import ParcelsPageClient from "@/components/SupperAdmin/ParcelsPageClient";
import { allParcelsData } from "@/data/allParcelsData";

export default function AdminParcelsPage() {
    return <ParcelsPageClient data={allParcelsData} />;
}