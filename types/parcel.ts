// types/parcel.ts
export type ParcelStatus = 
  | "pending" 
  | "ongoing" 
  | "delivered" 
  | "cancelled" 
  | "return";

export interface ParcelTracking {
  status?: ParcelStatus;
  location?: string;
  timestamp?: string;
  description?: string;
}

export interface ContactInfo {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Parcel {
  id: string;
  parcel_id: string;
  tracking_no: string;
  parcel_name: string;
  parcel_status: ParcelStatus;
  parcel_type: "document" | "package" | "fragile" | "electronics" | "food";
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
  };
  trackingHistory: ParcelTracking[];
  payment_status?: "paid" | "pending" | "cod";
  delivery_fee?: number;
  special_instructions?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}