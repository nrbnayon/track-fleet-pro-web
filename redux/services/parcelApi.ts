// redux/services/parcelApi.ts
import { apiSlice } from './apiSlice';
import { Parcel, ApiParcelResponse, TrackParcelResponse } from '@/types/parcel';
import { ApiAvailableDriversResponse, ApiAssignDriverResponse, Driver } from '@/types/driver';

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
          parcel_weight: apiParcel.parcel_weight,
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
          pickup_coordinates: apiParcel.pickup_coordinates,
          delivery_coordinates: apiParcel.delivery_coordinates,
          estimated_delivery: apiParcel.estimated_delivary_date,
          riderInfo: apiParcel.driver ? {
            rider_id: apiParcel.driver.id,
            rider_name: apiParcel.driver.full_name,
            rider_phone: apiParcel.driver.phone_number,
            rider_vehicle: apiParcel.driver.vehicle_number,
            rider_image: apiParcel.driver.profile_image || undefined,
            lat: apiParcel.driver.lat,
            lng: apiParcel.driver.lng,
          } : undefined,
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
    trackParcel: builder.query<TrackParcelResponse, string>({
      query: (trackingCode) => `/api/parcel/track-a-parcel/?tracking_id=${trackingCode}`,
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
        url: '/api/parcel/create/',
        method: 'POST',
        body: parcelData,
      }),
      invalidatesTags: ['Parcel'],
    }),
    
    // Update parcel
    updateParcel: builder.mutation<Parcel, { id: string; data: Partial<Parcel> }>({
      query: ({ id, data }) => ({
        url: `/api/parcel/parcels/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Parcel', id },
        { type: 'Parcel', id: 'LIST' }
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

    // Get nearest available drivers for a parcel
    getNearestDrivers: builder.query<Driver[], number | string>({
      query: (parcelId) => `/api/admin/available-nearest-drivers/?parcel_id=${parcelId}`,
      transformResponse: (response: ApiAvailableDriversResponse) => {
        return response.data.map((apiDriver) => ({
          id: apiDriver.id,
          driver_id: apiDriver.id.substring(0, 8),
          driver_name: apiDriver.full_name,
          driver_email: "N/A",
          driver_phone: apiDriver.phone_number,
          driver_status: apiDriver.is_available ? 'available' : (apiDriver.is_online ? 'busy' : 'offline'),
          vehicle_number: apiDriver.vehicle_number || "N/A",
          current_location: {
             latitude: apiDriver.lat || 0,
             longitude: apiDriver.lng || 0,
             address: apiDriver.current_location || "Unknown Location",
          },
          driver_image: apiDriver.profile_image,
          stats: {
             total_deliveries: apiDriver.total_delivery,
             active_deliveries: 0 
          },
          distance: apiDriver.distance,
          isActive: apiDriver.is_online,
          isAvailable: apiDriver.is_available,
          vehicle_type: "bike",
        }));
      },
      providesTags: ['Dashboard'],
    }),

    // Assign driver to parcel
    assignDriver: builder.mutation<ApiAssignDriverResponse, { parcelId: string | number; driverId: string }>({
      query: ({ parcelId, driverId }) => ({
        url: '/api/parcel/request-delivery/',
        method: 'POST',
        body: {
          parcel: typeof parcelId === 'string' ? parseInt(parcelId) : parcelId,
          driver: driverId,
        },
      }),
      invalidatesTags: (result, error, { parcelId }) => [
        { type: 'Parcel', id: parcelId.toString() }, // Update specific parcel
        'Parcel', // Update list
        'Dashboard' // Update available drivers list
      ],
    }),

    // Create review for driver
    createReview: builder.mutation<{ status: string; message: string; data?: any }, { driverId: string; rating: number; comment: string }>({
      query: ({ driverId, rating, comment }) => ({
        url: `/api/parcel/create-review/${driverId}/`,
        method: 'POST',
        body: { rating, comment },
      }),
    }),

    // Report an issue with a driver
    reportIssue: builder.mutation<{ status: string; message: string; data?: any }, { driverId: string; report: string; comment: string }>({
      query: ({ driverId, report, comment }) => ({
        url: '/api/parcel/report-issue/',
        method: 'POST',
        body: { driver_id: driverId, report, comment },
      }),
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
  useGetNearestDriversQuery,
  useAssignDriverMutation,
  useCreateReviewMutation,
  useReportIssueMutation,
} = parcelApi;
