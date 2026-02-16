import { apiSlice } from "./apiSlice";
import { NotificationsResponse } from "@/types/notification";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/api/parcel/notification/",
      providesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
