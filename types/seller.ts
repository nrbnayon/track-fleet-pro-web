// types/seller.ts

export interface SellerStats {
  total_parcels_delivery?: number;
  total_parcels?: number;
  pending_parcels?: number;
  completed_parcels?: number;
  cancelled_parcels?: number;
  total_revenue?: number;
}

export interface Seller {
  id: string;
  seller_id: string; // readable ID derived from UUID
  seller_name: string;
  business_name: string;
  seller_email: string;
  seller_phone: string;
  seller_address: string;
  seller_status: "active" | "inactive"; // default active as API doesn't seem to return status
  stats: SellerStats;
  createdAt?: string;
  [key: string]: any;
}

// API Types
export interface ApiSeller {
  Id: string;
  Full_name: string;
  business_name: string;
  Emails: string;
  phone_number: string;
  address: string;
  total_parcels_delivery: number;
}

export interface ApiSellerListResponse {
  success: boolean;
  status: number;
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  data: ApiSeller[];
}

export interface ApiSellerDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: ApiSeller;
}

export interface CreateSellerRequest {
  full_name: string;
  email_address: string;
  address: string;
  phone_number: string;
  business_name: string;
}

export interface CreateSellerResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    email: string;
  };
}

export interface UpdateSellerRequest {
  full_name: string;
  email_address: string;
  address: string;
  phone_number: string;
  business_name: string;
}
