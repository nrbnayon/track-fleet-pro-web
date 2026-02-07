
export interface DashboardStats {
  total_parcels: number;
  pending_assignment: number;
  ongoing: number;
  delivered_today: number;
  active_drivers: number;
  total_drivers: number;
}

export interface RecentParcel {
  id: number;
  tracking_id: string;
  title: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  delivery_location: string;
  status_display: string;
  driver_name: string;
  seller_name: string;
  created_at: string;
}

export interface ActiveDriver {
  full_name: string;
  is_available: boolean;
  is_online: boolean;
  active_delivery: number;
  profile_image?: string;
  lat: number | null;
  lng: number | null;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_parcels: RecentParcel[];
  active_drivers: ActiveDriver[];
}

export interface DashboardResponse {
  success: boolean;
  status: number;
  message: string;
  data: DashboardData;
}
