// types/history.ts

export type UploadStatus = "Success" | "Warning" | "Error";

export interface HistoryRecord {
  id: string;
  fileName: string;
  status: UploadStatus;
  uploadDate: string;
  uploadedBy: string;
  recordCount: number;
  issues?: string[];
}
