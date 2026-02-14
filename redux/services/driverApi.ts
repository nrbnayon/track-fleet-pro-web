
import { apiSlice } from './apiSlice';
import { 
  Driver, 
  ApiDriverListResponse, 
  ApiDriverDetailResponse, 
  CreateDriverRequest, 
  UpdateDriverRequest, 
  CreateDriverResponse 
} from '@/types/driver';

export const driverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all drivers with pagination and search
    getDrivers: builder.query<{ data: Driver[], meta: { total_pages: number, current_page: number, count: number } }, { page?: number; limit?: number; search?: string; status?: string }>({
      query: ({ page = 1, limit = 10 }) => {
        return `/api/admin/drivers/?page=${page}&page_size=${limit}`;
      },
      transformResponse: (response: ApiDriverListResponse) => {
        const mappedData: Driver[] = response.data.map((apiDriver) => {
          let calculatedStatus = 'offline';
          
          if (apiDriver.active_delivery > 3) {
             calculatedStatus = 'busy';
          } else if (apiDriver.active_delivery > 0) {
             calculatedStatus = 'ongoing';
          } else if (apiDriver.is_available) {
             calculatedStatus = 'available';
          } else {
             calculatedStatus = 'offline';
          }

          return {
            id: apiDriver.id,
            driver_id: apiDriver.id.substring(0, 8).toUpperCase(),
            driver_name: apiDriver.Driver_name,
            driver_email: apiDriver.Emails,
            driver_phone: apiDriver.phone_number,
            driver_status: calculatedStatus as any,
            vehicle_number: apiDriver.vehicle_number || "N/A",
            driver_image: apiDriver.profile_image,
            vehicle_type: "truck", 
            isActive: true, 
            stats: {
              total_deliveries: apiDriver.total_delivery,
              active_deliveries: apiDriver.active_delivery,
            },
            createdAt: new Date().toISOString()
          };
        });

        return {
          data: mappedData,
          meta: {
            total_pages: response.total_pages,
            current_page: response.current_page,
            count: response.count
          }
        };
      },
      providesTags: ['Driver'],
    }),

    // Get single driver
    getDriverById: builder.query<Driver, string>({
      query: (id) => `/api/admin/drivers/${id}/`,
      transformResponse: (response: ApiDriverDetailResponse) => {
        const apiDriver = response.data;
        return {
          id: apiDriver.id,
          driver_id: apiDriver.id.substring(0, 8).toUpperCase(),
          driver_name: apiDriver.Driver_name,
          driver_email: apiDriver.Emails,
          driver_phone: apiDriver.phone_number,
          driver_status: apiDriver.is_available ? 'available' : 'offline',
          vehicle_number: apiDriver.vehicle_number || "N/A",
          driver_image: apiDriver.profile_image,
          vehicle_type: "bike",
          isActive: true,
          stats: {
            total_deliveries: apiDriver.total_delivery,
            active_deliveries: apiDriver.active_delivery,
          },
        };
      },
      providesTags: (result, error, id) => [{ type: 'Driver', id }],
    }),

    // Create Driver
    createDriver: builder.mutation<CreateDriverResponse, CreateDriverRequest>({
      query: (data) => ({
        url: '/api/admin/drivers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Driver'],
    }),

    // Update Driver
    updateDriver: builder.mutation<any, { id: string; data: UpdateDriverRequest }>({
      query: ({ id, data }) => ({
        url: `/api/admin/drivers/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Driver', id },
        'Driver',
      ],
    }),

    // Delete Driver
    deleteDriver: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/drivers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Driver'],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetDriverByIdQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = driverApi;
