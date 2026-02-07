
import { apiSlice } from './apiSlice';
import { DashboardResponse } from '@/types/dashboard';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardResponse, void>({
      query: () => ({
        url: '/api/admin/deshboard/',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
      // Cache the result for 60 seconds (optional, but good for dashboard data)
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
