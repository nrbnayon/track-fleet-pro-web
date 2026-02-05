// lib/redux/services/parcelApi.ts
import { apiSlice } from './apiSlice';

interface TrackingUpdate {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

interface ParcelDetails {
  id: string;
  trackingCode: string;
  parcelId: string;
  date: string;
  weight: string;
  cod: string;
  status: string;
  invoice: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  sender: {
    name: string;
    address: string;
    phone: string;
  };
  assignedTo: {
    name: string;
    phone: string;
    avatar?: string;
  };
  trackingUpdates: TrackingUpdate[];
}

interface TrackParcelRequest {
  trackingCode: string;
}

// Inject parcel endpoints into the API slice
export const parcelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Track parcel by tracking code
    trackParcel: builder.query<ParcelDetails, string>({
      query: (trackingCode) => `/parcels/track/${trackingCode}`,
      providesTags: (result, error, trackingCode) => [
        { type: 'Tracking', id: trackingCode },
      ],
    }),
    
    // Get all parcels (for admin/seller)
    getParcels: builder.query<ParcelDetails[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/parcels?page=${page}&limit=${limit}`,
      providesTags: ['Parcel'],
    }),
    
    // Get parcel by ID
    getParcelById: builder.query<ParcelDetails, string>({
      query: (id) => `/parcels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Parcel', id }],
    }),
    
    // Create new parcel
    createParcel: builder.mutation<ParcelDetails, Partial<ParcelDetails>>({
      query: (parcelData) => ({
        url: '/parcels',
        method: 'POST',
        body: parcelData,
      }),
      invalidatesTags: ['Parcel'],
    }),
    
    // Update parcel
    updateParcel: builder.mutation<ParcelDetails, { id: string; data: Partial<ParcelDetails> }>({
      query: ({ id, data }) => ({
        url: `/parcels/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Parcel', id },
        { type: 'Tracking', id: result?.trackingCode },
      ],
    }),
    
    // Delete parcel
    deleteParcel: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/parcels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Parcel'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useTrackParcelQuery,
  useGetParcelsQuery,
  useGetParcelByIdQuery,
  useCreateParcelMutation,
  useUpdateParcelMutation,
  useDeleteParcelMutation,
} = parcelApi;
