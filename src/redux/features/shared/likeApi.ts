import { baseApi } from "../../api/baseApi";

export const likeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLike: builder.mutation({
      query: (data) => ({
        url: `/shared/likeReview/${data?.reviewId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Review", "User"],
    }),

    createDislike: builder.mutation({
      query: (data) => ({
        url: `/shared/disLinkreview/${data?.reviewId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Review", "User"],
    }),

  }),
});

export const { useCreateLikeMutation, useCreateDislikeMutation } = likeApi;
