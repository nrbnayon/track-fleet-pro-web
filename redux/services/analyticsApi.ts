import { apiSlice } from './apiSlice';
import type { AnalyticsApiResponse, SellerAnalyticsApiResponse } from '@/types/analytics';

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsApiResponse, void>({
      query: () => '/api/admin/analytics/',
      providesTags: ['Analytics'],
    }),
    getSellerAnalytics: builder.query<SellerAnalyticsApiResponse, void>({
      query: () => '/api/admin/seller-analytics/',
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetAnalyticsQuery, useGetSellerAnalyticsQuery } = analyticsApi;
