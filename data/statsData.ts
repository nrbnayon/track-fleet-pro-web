import { Package, Clock, MapPin, CheckCircle, Truck } from "lucide-react";

export const statsData = [
  {
    title: "Total Parcels",
    value: "85",
    icon: Package,
    iconColor: "#1D92ED",
    iconBgColor: "#DFF0FF", // light blue
  },
  {
    title: "Pending Assignment",
    value: "22",
    icon: Clock,
    iconColor: "#F0B100",
    iconBgColor: "#FFF6E5", // light yellow
  },
  {
    title: "Ongoing",
    value: "25",
    icon: MapPin,
    iconColor: "#AD46FF",
    iconBgColor: "#F5EDFF", // light purple
  },
  {
    title: "Delivered Today",
    value: "11",
    icon: CheckCircle,
    iconColor: "#00C950",
    iconBgColor: "#E6F9EF", // light green
  },
  {
    title: "Active Drivers",
    value: "24",
    icon: Truck,
    iconColor: "#FF6900",
    iconBgColor: "#FFE8D9", // light orange
  },
  {
    title: "Total Drivers",
    value: "14",
    icon: Truck,
    iconColor: "#615FFF",
    iconBgColor: "#EEEEFF", // light purple
  },
];