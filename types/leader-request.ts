export interface Request {
  id: string;
  leader: string;
  projectName: string;
  date: string;
  location: string;
  amount: string;
  status: "Pending" | "Approved" | "Declined";
}
