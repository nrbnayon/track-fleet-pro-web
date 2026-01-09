// data/statsData.ts
import { 
  Location01Icon, 
  ChartLineData01Icon,
  UniversityIcon,
  Home02Icon,
  Factory02Icon,
  Plant03Icon,
  City01Icon
} from "@hugeicons/core-free-icons";

export const statsData = [
  {
    title: "Total Parcels",
    value: "250",
    icon: Location01Icon,
    iconBgColor: "#3B82F6", // blue
  },
  {
    title: "Total Area",
    value: "772,870 m²",
    icon: ChartLineData01Icon,
    iconBgColor: "#10B981", // green
  },
  {
    title: "Average Parcel Area",
    value: "3,091 m²",
    icon: Location01Icon,
    iconBgColor: "#8B5CF6", // purple
  },
  {
    title: "Leased Land",
    value: "131",
    subtitle: "(52.4%)",
    icon: City01Icon,
    iconBgColor: "#F97316", // orange
  },
  {
    title: "Owned Land",
    value: "119",
    subtitle: "(47.6%)",
    icon: Home02Icon,
    iconBgColor: "#14B8A6", // teal
  },
  {
    title: "Commercial Land",
    value: "50",
    icon: City01Icon,
    iconBgColor: "#6366F1", // indigo
  },
  {
    title: "Residential Land",
    value: "69",
    icon: UniversityIcon,
    iconBgColor: "#10B981", // green
  },
  {
    title: "Industrial Land",
    value: "61",
    icon: Factory02Icon,
    iconBgColor: "#6B7280", // gray
  },
  {
    title: "Agricultural Land",
    value: "70",
    icon: Plant03Icon,
    iconBgColor: "#22C55E", // green
  },
];