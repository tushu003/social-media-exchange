import { baseApi } from "../../api/baseApi";

const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubCategory: builder.mutation({
      query: (data) => {
        const categoryId = data.get("categoryId");
        return {
          url: `/categories/${categoryId}`,
          method: "PATCH",
          body: data,
          headers: {
            authorization: `${localStorage.getItem("accessToken")}`,
          },
        };
      },
      invalidatesTags: ["Category"],
    }),

    removeSubCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
        headers: {
          authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["SubCategory"],
    }),

    deleteSubCategory: builder.mutation({
      query: ({ categoryId, subCategorieId }) => ({
        url: `/categories/remove-subcategory/${categoryId}`,
        method: "PATCH",
        body: { subCategorieId },
        headers: {
          authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateSubCategoryMutation,
  useRemoveSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;
