import { url } from "inspector";
import { baseApi } from "../../api/baseApi";

export const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTerms: builder.mutation({
      query: (data) => ({
        url: "/terms",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Terms"],
    }),

    getTerms: builder.query({
      query: () => ({
        url: "/terms",
        method: "GET",
      }),
      providesTags: ["Terms"],
    }),

    updateTerms: builder.mutation({
      query: (data) => ({
        url: `/terms/${data._id}`,
        method: "PUT",
        body: {
          title: data.title,
          content: data.content,
        },
      }),
      invalidatesTags: ["Terms"],
    }),

    deleteTerms: builder.mutation({
      query: (id) => ({
        url: `/terms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Terms"],
    }),
  }),
});

export const {
  useCreateTermsMutation,
  useGetTermsQuery,
  useUpdateTermsMutation,
  useDeleteTermsMutation,
} = termsApi;
