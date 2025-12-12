import { baseApi } from "../../api/baseApi";

const profileReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getProfileReport: builder.query({
      query: () => ({
        url: "/auth/getProfileReport",
        method: "GET",
      }),
      providesTags:["profileReport"]
    }),

    takeActionProfileReport: builder.mutation({
      query: ({action, id}) => {
        return{
          url: `/auth/action/${id}`,
          method: "PATCH",
          body : {action}
        }
      },
      invalidatesTags:["profileReport"]
    }),

    getSuspendedData: builder.query({
      query: () => {
        return{
          url: `/auth/action`,
          method: "GET",
        }
      },
      providesTags:["profileReport"]
    }),

  }),
});

export const { useGetProfileReportQuery, useTakeActionProfileReportMutation, useGetSuspendedDataQuery } = profileReportApi;
