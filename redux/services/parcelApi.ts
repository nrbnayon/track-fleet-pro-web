// redux/services/parcelApi.ts
import { apiSlice } from './apiSlice';
import { Parcel, ApiParcelResponse } from '@/types/parcel';

// Inject parcel endpoints into the API slice
export const parcelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all parcels with pagination and filters
    getParcels: builder.query<{ data: Parcel[], meta: { total_pages: number, current_page: number, count: number } }, { page?: number; limit?: number; status?: string; search?: string }>({
      query: ({ page = 1, limit = 10, status, search }) => {
        let queryString = `/api/parcel/parcels/?page=${page}&page_size=${limit}`;
        if (status && status !== 'all') {
             const apiStatus = status.toLowerCase() === 'ongoing' ? 'ASSIGNED' : status.toUpperCase();
             queryString += `&status=${apiStatus}`;
        }
        if (search) queryString += `&search=${search}`;
        return queryString;
      },
      transformResponse: (response: ApiParcelResponse) => {
        const mappedData: Parcel[] = response.data.map((apiParcel) => ({
          id: apiParcel.id.toString(),
          parcel_id: `PCL${apiParcel.id}`, 
          tracking_no: apiParcel.tracking_id,
          parcel_name: apiParcel.title,
          parcel_status: apiParcel.status,
          parcel_type: apiParcel.parcel_type,
          parcel_weight: apiParcel.weight,
          senderInfo: {
            // Assume seller is sender based on user input example structure
            name: apiParcel.seller?.Full_name || "N/A",
            phone: apiParcel.seller?.phone_number || "N/A",
          },
          receiverInfo: {
            name: apiParcel.customer_name,
            phone: apiParcel.customer_phone,
          },
          delivery_location: apiParcel.delivery_location,
          pickup_location: apiParcel.pickup_location,
          estimated_delivery: apiParcel.estimated_delivary_date,
          riderInfo: {
            rider_name: apiParcel.Driver_name,
            rider_phone: apiParcel.Driver_phone,
            rider_vehicle: "N/A" // Not provided in API
          },
          special_instructions: apiParcel.special_instructions,
          appoximate_distance: apiParcel.appoximate_distance,
          trackingHistory: [], // Not provided in list API
          // Fill other required fields with defaults or derived values
          createdAt: apiParcel.estimated_delivary_date, // best guess or leave undefined
          updatedAt: new Date().toISOString(),
        }));
        
        return {
          data: mappedData,
          meta: {
            total_pages: response.total_pages,
            current_page: response.current_page,
            count: response.count
          }
        };
      },
      providesTags: ['Parcel'],
    }),

    // Track parcel by tracking code
    trackParcel: builder.query<Parcel, string>({
      query: (trackingCode) => `/api/parcel/track/${trackingCode}`,
      providesTags: (result, error, trackingCode) => [
        { type: 'Tracking', id: trackingCode },
      ],
    }),
    
    // Get parcel by ID
    getParcelById: builder.query<Parcel, string>({
      query: (id) => `/api/parcel/${id}`,
      providesTags: (result, error, id) => [{ type: 'Parcel', id }],
    }),
    
    // Create new parcel
    createParcel: builder.mutation<Parcel, Partial<Parcel>>({
      query: (parcelData) => ({
        url: '/api/parcel/parcels/',
        method: 'POST',
        body: parcelData,
      }),
      invalidatesTags: ['Parcel'],
    }),
    
    // Update parcel
    updateParcel: builder.mutation<Parcel, { id: string; data: Partial<Parcel> }>({
      query: ({ id, data }) => ({
        url: `/api/parcel/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Parcel', id },
      ],
    }),
    
    // Delete parcel
    deleteParcel: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/parcel/${id}`,
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
