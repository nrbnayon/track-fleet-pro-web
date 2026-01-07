import { Request } from "@/types/leader-request";

export const PROJECT_CATEGORIES = [
  "Cow",
  "Goat",
  "Agriculture",
  "Water",
  "Education",
  "Infrastructure",
];

export interface LeaderRequestDetails extends Request {
  email: string;
  village: string;
  pastor: string;
  sponsor: string;
  established: string;
  category: string;
  stories: string;
  details: string;
  updates: string;
  impact: string;
  pastorSupport: number[];
  livestock: { name: string; count: number }[];
  other: number[];
}
