import { apiSlice } from './apiSlice';
import type { AnalyticsApiResponse } from '@/types/analytics';

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsApiResponse, void>({
      query: () => '/api/admin/analytics/',
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetAnalyticsQuery } = analyticsApi;
