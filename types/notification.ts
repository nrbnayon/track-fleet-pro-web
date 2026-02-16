// types/notification.ts
export type NotificationType = string; // Making it flexible as API returns emojis/strings

export type NotificationStatus = "READ" | "UNREAD" | "read" | "unread";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  status: NotificationStatus;
  created_at: string;
  // Optional/Legacy fields from previous mock data
  tracking_no?: string;
  parcel_id?: string;
  driver_id?: string;
  driver_name?: string;
  seller_id?: string;
  seller_name?: string;
  timestamp?: string; // API uses created_at, keeping timestamp for compat if needed
  priority?: NotificationPriority;
  action_url?: string;
  metadata?: Record<string, any>;
}

export interface NotificationsResponse {
  success: boolean;
  status: number;
  message: string;
  data: Notification[];
}
