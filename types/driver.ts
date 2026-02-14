// types/driver.ts
export type DriverStatus = 
  | "available" 
  | "busy" 
  | "offline";

export interface DriverLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
  lastUpdated?: string;
}

export interface DriverStats {
  total_deliveries?: number;
  active_deliveries?: number;
  completed_today?: number;
  rating?: number;
  total_earnings?: number;
}

export interface Driver {
  id: string;
  driver_id: string;
  driver_name: string;
  driver_email: string;
  driver_phone: string;
  driver_status: DriverStatus;
  driver_address?: string;
  driver_image?: string;
  vehicle_type: "bike" | "car" | "van" | "truck";
  vehicle_number?: string;
  license_number?: string;
  isLocationShared?: boolean;
  isAvailable?: boolean;
  isActive: boolean;
  current_location?: DriverLocation;
  assigned_parcels?: string[]; // Array of parcel IDs
  stats?: DriverStats;
  joined_date?: string;
  last_active?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// API Types for Available Drivers
export interface ApiAvailableDriver {
  id: string;
  full_name: string;
  vehicle_number: string | null;
  total_delivery: number;
  is_available: boolean;
  is_online: boolean;
  phone_number: string;
  current_location: string | null;
  profile_image: string;
  lat: number | null;
  lng: number | null;
}

export interface ApiAvailableDriversResponse {
  success: boolean;
  status: number;
  message: string;
  data: ApiAvailableDriver[];
}

export interface ApiAssignDriverResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
      id: number;
      status: string;
      created_at: string;
      parcel: number;
      driver: string;
  }
}
