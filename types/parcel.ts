// types/parcel.ts
export type ParcelStatus = 
  | "pending" 
  | "ONGOING" // Added based on API response
  | "delivered" 
  | "cancelled" 
  | "return" 
  | "ASSIGNED" // Added based on API response
  | "DELIVERED" // Added based on API response
  | "PENDING"; // Added based on API response

export interface ParcelTracking {
  status?: string;
  location?: string;
  timestamp?: string;
  description?: string;
}

export interface ContactInfo {
  id?: string;
  name?: string;
  email?: string;
  email_address?: string; // New field for receiver email
  phone?: string;
  address?: string;
}

export interface Parcel {
  id: string;
  parcel_id: string;
  tracking_no: string;
  parcel_name: string;
  parcel_status: string; // Relaxed from ParcelStatus to allow API values directly if needed
  parcel_type: string; // Relaxed to allow "Docs" etc
  parcel_weight?: number; // in kg
  parcel_dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  parcel_value?: number; // in currency
  parcel_image?: string;
  pickup_location?: string;
  pickup_coordinates?: {
    lat: number;
    lng: number;
  };
  delivery_location?: string;
  delivery_coordinates?: {
    lat: number;
    lng: number;
  };
  appoximate_distance?: string;
  estimated_delivery?: string;
  estimated_delivary_date?: string; // Matching API payload
  actual_delivery?: string;
  senderInfo?: ContactInfo;
  receiverInfo?: ContactInfo;
  sellerInfo?: ContactInfo;
  riderInfo?: {
    rider_id?: string;
    rider_name?: string;
    rider_email?: string;
    rider_phone?: string;
    rider_vehicle?: string;
    rider_image?: string;
    rider_vehicle_type?: string;
    rider_vehicle_number?: string;
    lat?: number;
    lng?: number;
  };
  trackingHistory: ParcelTracking[];
  payment_status?: "paid" | "pending" | "cod";
  delivery_fee?: number;
  special_instructions?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// API Types
export interface ApiSeller {
  Full_name: string;
  phone_number: string;
}

export interface ApiDriver {
    id: string;
    full_name: string;
    phone_number: string;
    vehicle_number: string;
    profile_image: string | null;
    lat: number;
    lng: number;
    current_location: string;
}

export interface ApiParcel {
    id: number;
    tracking_id: string;
    title: string;
    parcel_type: string;
    pickup_location: string;
    delivery_location: string;
    estimated_delivary_date?: string;
  parcel_weight: number;
  customer_name: string;
    customer_phone: string;
    special_instructions: string;
    appoximate_distance: string;
    status: string;
    vehicle_number: string;
    pickup_coordinates: {
        lat: number;
        lng: number;
    };
    delivery_coordinates: {
        lat: number;
        lng: number;
    };
  driver: ApiDriver | null;
  seller: ApiSeller;
}

export interface ApiParcelResponse {
    success: boolean;
    status: number;
    message: string;
    count: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    data: ApiParcel[];
}