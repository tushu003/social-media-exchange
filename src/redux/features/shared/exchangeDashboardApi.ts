import { baseApi } from "../../api/baseApi";

export const exchangeDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExchangeDashboard: builder.query({
      query: (UserId) => ({
        url: `/shared/exchange/${UserId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetExchangeDashboardQuery } = exchangeDashboardApi;
