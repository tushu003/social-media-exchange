import { baseApi } from "../../api/baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReviewReport: builder.mutation({
      query: (data) => ({
        url: "/shared/report",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["Report", "User"],
    }),

    createProfileReport: builder.mutation({
      query: (data) => ({
        url: "/auth/sendProfileReport",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["Report", "User"],
    }),

    getAllReviewReport: builder.query({
      query: () => {
        return {
          url: `/shared/report`,
          method: "GET",
        };
      },
      providesTags: ["Report", "User"],
    }),

    getAllProfileReport: builder.query({
      query: () => {
        return {
          url: `/auth/getProfileReport`,
          method: "GET",
        };
      },
      // providesTags: ["Report", "User"],
    }),

    getAllReportedProfile: builder.query({
      query: () => {
        return {
          url: `/auth/reportedProfile`,
          method: "GET",
        };
      },
    }),

    actionReviewReport: builder.mutation({
      query: ({ id, status }) => ({
        url: `/shared/reportAcceptOrRejectByAdmin/${id}?status=${status}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Report"],
    }),
  }),
});

export const {
  useCreateReviewReportMutation,
  useCreateProfileReportMutation,
  useGetAllReviewReportQuery,
  useGetAllProfileReportQuery,
  useGetAllReportedProfileQuery,
  useActionReviewReportMutation,
} = reportApi;
