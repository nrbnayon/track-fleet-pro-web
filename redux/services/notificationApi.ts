import { apiSlice } from "./apiSlice";
import { NotificationsResponse } from "@/types/notification";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // For Super Admin
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/api/parcel/notification/",
      providesTags: ["Notification"],
    }),
    // For Seller
    getSellerNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/api/parcel/notification-seller/",
      providesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery, useGetSellerNotificationsQuery } = notificationApi;
