// types/seller.ts
export type SellerStatus = 
  | "active" 
  | "inactive" 
  | "suspended" 
  | "pending_verification";

export interface SellerStats {
  total_parcels?: number;
  pending_parcels?: number;
  completed_parcels?: number;
  cancelled_parcels?: number;
  total_revenue?: number;
}

export interface BusinessHours {
  day?: string;
  open?: string;
  close?: string;
  is_open?: boolean;
}

export interface Seller {
  id: string;
  seller_id: string;
  seller_name: string;
  business_name: string;
  seller_email: string;
  seller_phone: string;
  seller_address?: string;
  seller_status: SellerStatus;
  seller_image?: string;
  business_category?: "retail" | "wholesale" | "restaurant" | "pharmacy" | "grocery" | "electronics" | "fashion";
  business_hours?: BusinessHours[];
  tax_id?: string;
  bank_account?: string;
  rating?: number;
  total_reviews?: number;
  stats?: SellerStats;
  preferred_payment_method?: "bank_transfer" | "cash" | "mobile_wallet";
  commission_rate?: number; // percentage
  registered_date?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}
