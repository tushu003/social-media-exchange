import { baseApi } from "../../api/baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
        headers: {
          authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["Category"],
    }),

    getAllCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
        headers: {
          authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: (data) => ({
        url: `/categories/updateCategory/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
        headers: {
          authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["Category"],
    }),

    showConversation: builder.query({
      query: ({ reporterId, reportedId }) => ({
        url: `/categories/getALlMessageData?reporterId=${reporterId}&reportedId=${reportedId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useShowConversationQuery,
} = categoriesApi;
