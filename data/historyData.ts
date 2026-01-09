// data/historyData.ts

import { HistoryRecord } from "@/types/history";

export const historyData: HistoryRecord[] = [
  {
    id: "1",
    fileName: "land_data_september_2024.xlsx",
    status: "Success",
    uploadDate: "11/15/2024, 10:30:00 AM",
    uploadedBy: "admin@city.gov",
    recordCount: 250,
  },
  {
    id: "2",
    fileName: "land_data_september_2024.xlsx",
    status: "Success",
    uploadDate: "10/10/2024, 2:20:00 PM",
    uploadedBy: "admin@city.gov",
    recordCount: 230,
  },
  {
    id: "3",
    fileName: "land_data_september_2024.xlsx",
    status: "Warning",
    uploadDate: "9/5/2024, 9:15:00 AM",
    uploadedBy: "admin@city.gov",
    recordCount: 215,
    issues: [
      "3 duplicate Parcel IDs found and merged",
      "5 records had missing zone data - assigned to Zone A",
    ],
  },
  {
    id: "4",
    fileName: "land_data_august_2024.xlsx",
    status: "Success",
    uploadDate: "8/20/2024, 3:45:00 PM",
    uploadedBy: "analyst@city.gov",
    recordCount: 195,
  },
  {
    id: "5",
    fileName: "land_data_july_2024.xlsx",
    status: "Success",
    uploadDate: "7/15/2024, 11:00:00 AM",
    uploadedBy: "admin@city.gov",
    recordCount: 180,
  },
  {
    id: "6",
    fileName: "land_data_june_2024.xlsx",
    status: "Warning",
    uploadDate: "6/10/2024, 4:30:00 PM",
    uploadedBy: "analyst@city.gov",
    recordCount: 165,
    issues: [
      "2 invalid coordinates detected",
      "1 record with incomplete ownership information",
    ],
  },
];
