import { Package, Clock, MapPin, CheckCircle, Truck,  Users } from "lucide-react";
import { DashboardStats } from "@/types/dashboard";

export const getStatsData = (stats: DashboardStats) => [
  {
    title: "Total Parcels",
    value: stats.total_parcels.toString(),
    icon: Package,
    iconColor: "#1D92ED",
    iconBgColor: "#DFF0FF", // light blue
  },
  {
    title: "Pending Assignment",
    value: stats.pending_assignment.toString(),
    icon: Clock,
    iconColor: "#F0B100",
    iconBgColor: "#FFF6E5", // light yellow
  },
  {
    title: "Ongoing",
    value: stats.ongoing.toString(),
    icon: MapPin,
    iconColor: "#AD46FF",
    iconBgColor: "#F5EDFF", // light purple
  },
  {
    title: "Delivered Today",
    value: stats.delivered_today.toString(),
    icon: CheckCircle,
    iconColor: "#00C950",
    iconBgColor: "#E6F9EF", // light green
  },
  {
    title: "Active Drivers",
    value: stats.active_drivers.toString(),
    icon: Truck,
    iconColor: "#FF6900",
    iconBgColor: "#FFE8D9", // light orange
  },
  {
    title: "Total Drivers",
    value: stats.total_drivers.toString(),
    icon: Users,
    iconColor: "#615FFF",
    iconBgColor: "#EEEEFF", // light purple
  },
];
