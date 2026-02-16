
import { apiSlice } from './apiSlice';
import { DashboardResponse } from '@/types/dashboard';

export interface SellerDashboardCards {
  parcels_created: number;
  pending_parcels: number;
  ongoing: number;
  delivered_today: number;
}

export interface SellerParcelTrend {
  month: string;
  delivered: number;
  ongoing: number;
  pending: number;
}

export interface SellerActionRequired {
  "awaiting_assignment to be driver": number;
  in_transit: number;
  delivered_this_week: number;
}

export interface SellerRecentActivity {
  tracking_id: string;
  status: string;
  days_ago: number;
}

export interface SellerDashboardData {
  cards: SellerDashboardCards;
  parcel_trend: SellerParcelTrend[];
  recent_activity: SellerRecentActivity[];
  action_required: SellerActionRequired;
}

export interface SellerDashboardResponse {
  success: boolean;
  status: number;
  message: string;
  data: SellerDashboardData;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query<DashboardResponse, void>({
      query: () => ({
        url: '/api/admin/deshboard/',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
    }),
    getSellerDashboardStats: builder.query<SellerDashboardResponse, void>({
      query: () => ({
        url: '/api/admin/seller-deshboard/',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetAdminDashboardStatsQuery, useGetSellerDashboardStatsQuery } = dashboardApi;
