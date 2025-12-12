import { baseApi } from "../../api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: "/shared/review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review", "User"],
    }),

    getSingleReview: builder.query({
      query: (id) => {
        // console.log(16, id);
        return {
          url: `/shared/review/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Review", "User"],
    }),
  }),
});

export const { useCreateReviewMutation, useGetSingleReviewQuery } = reviewApi;
