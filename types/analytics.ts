// Analytics API Types

export interface WeeklyDeliveries {
  Mon: number;
  Tue: number;
  Wed: number;
  Thu: number;
  Fri: number;
  Sat: number;
  Sun: number;
}

export interface DeliveryStatusDistribution {
  ASSIGNED: number;
  DELIVERED: number;
  ONGOING: number;
  PENDING: number;
  [key: string]: number;
}

export interface StatusBreakdownItem {
  status: string;
  count: number;
  percentage: number;
}

export interface TopDriver {
  rank: number;
  name: string;
  deliveries: number;
}

export interface ParcelZone {
  zone: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  total_deliveries: number;
  active_drivers: number;
  weekly_deliveries: WeeklyDeliveries;
  delivery_status_distribution: DeliveryStatusDistribution;
  status_breakdown: StatusBreakdownItem[];
  top_drivers: TopDriver[];
  parcel_zones: ParcelZone[];
}

export interface AnalyticsApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: AnalyticsData;
}

export interface SellerWeeklyStat {
  day: string;
  pending_count: number;
  ongoing_count: number;
  delivered_count: number;
}

export interface SellerZoneDistribution {
  delivery_location: string;
  count: number;
  percentage: number;
}

export interface SellerAnalyticsData {
  total_revenue: number;
  total_deliveries: number;
  active_drivers: number;
  status_breakdown: StatusBreakdownItem[];
  zone_distribution: SellerZoneDistribution[];
  weekly_stats: SellerWeeklyStat[];
}

export interface SellerAnalyticsApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: SellerAnalyticsData;
}
