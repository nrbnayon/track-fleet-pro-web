
import { apiSlice } from './apiSlice';
import { DashboardResponse } from '@/types/dashboard';

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
  }),
});

export const { useGetAdminDashboardStatsQuery } = dashboardApi;
