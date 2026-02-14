import { apiSlice } from './apiSlice';
import {
  Seller,
  ApiSellerListResponse,
  ApiSellerDetailResponse,
  CreateSellerRequest,
  CreateSellerResponse,
  UpdateSellerRequest,
} from '@/types/seller';

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all sellers
    getSellers: builder.query<{ data: Seller[], meta: { total_pages: number, current_page: number, count: number } }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 1000 }) => `/api/admin/sellers/?page=${page}&page_size=${limit}`,
      transformResponse: (response: ApiSellerListResponse) => {
        const mappedData: Seller[] = response.data.map((apiSeller) => ({
          id: apiSeller.Id,
          seller_id: apiSeller.Id.substring(0, 8).toUpperCase(),
          seller_name: apiSeller.Full_name,
          business_name: apiSeller.business_name,
          seller_email: apiSeller.Emails,
          seller_phone: apiSeller.phone_number,
          seller_address: apiSeller.address,
          seller_status: "active", // Default status
          stats: {
            total_parcels_delivery: apiSeller.total_parcels_delivery,
          },
          createdAt: new Date().toISOString(),
        }));

        return {
          data: mappedData,
          meta: {
            total_pages: response.total_pages,
            current_page: response.current_page,
            count: response.count,
          },
        };
      },
      providesTags: ['Seller'],
    }),

    // Get single seller
    getSellerById: builder.query<Seller, string>({
      query: (id) => `/api/admin/sellers/${id}/`,
      transformResponse: (response: ApiSellerDetailResponse) => {
        const apiSeller = response.data;
        return {
          id: apiSeller.Id,
          seller_id: apiSeller.Id.substring(0, 8).toUpperCase(),
          seller_name: apiSeller.Full_name,
          business_name: apiSeller.business_name,
          seller_email: apiSeller.Emails,
          seller_phone: apiSeller.phone_number,
          seller_address: apiSeller.address,
          seller_status: "active",
          stats: {
            total_parcels_delivery: apiSeller.total_parcels_delivery,
          },
          createdAt: new Date().toISOString(),
        };
      },
      providesTags: (result, error, id) => [{ type: 'Seller', id }],
    }),

    // Create Seller
    createSeller: builder.mutation<CreateSellerResponse, CreateSellerRequest>({
      query: (data) => ({
        url: '/api/admin/sellers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Seller'],
    }),

    // Update Seller
    updateSeller: builder.mutation<any, { id: string; data: UpdateSellerRequest }>({
      query: ({ id, data }) => ({
        url: `/api/admin/sellers/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Seller', id },
        'Seller',
      ],
    }),

    // Delete Seller
    deleteSeller: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/sellers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Seller'],
    }),
  }),
});

export const {
  useGetSellersQuery,
  useGetSellerByIdQuery,
  useCreateSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
} = sellerApi;
