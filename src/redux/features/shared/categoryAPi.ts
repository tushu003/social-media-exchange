import { baseApi } from "../../api/baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCategory: build.query({
      query: () => ({
        url: "/shared?category=all",
        method: "GET",
      }),
    }),

    getAllUserBaseOnSubCategory: build.query({
      query: (subCategory: string) => ({
        url: `/shared/userFindBycategory?subCategory=${subCategory}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllCategoryQuery, useGetAllUserBaseOnSubCategoryQuery } =
  categoryApi;
