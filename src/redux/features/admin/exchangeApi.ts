import { baseApi } from "../../api/baseApi";

const exchangeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExchange: builder.mutation({
      query: (data) => ({
        url: "/shared/exchange",
        method: "POST",
        body: data,
        formData: true,
      }),
    }),

    getAllExchange: builder.query({
      query: () => ({
        url: `/categories/allExchangeData`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateExchangeMutation, useGetAllExchangeQuery } = exchangeApi;
