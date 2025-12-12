import { baseApi } from "../../api/baseApi";

export const exchangeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExchange: builder.mutation({
      query: (data) => ({
        url: "/shared/exchange",
        method: "POST",
        body: data,
        formData: true,
      }),
    }),

    exchangeChatRequest: builder.mutation({
      query: (data) => ({
        url: `/shared/exchange/${data?.exchangeId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    acceptExchange: builder.mutation({
      query: (data) => ({
        url: `/shared/acceptExchange/${data?.exchangeId}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["User"]
    }),

    updateExchangeUpdateDateForSerial: builder.mutation({
      query: (data) => ({
        url: `/shared/updateExchangeUpdateDateForSerial`,
        method: "PATCH",
        body: data
      }),
    }),


  }),
});

export const {
  useCreateExchangeMutation,
  useExchangeChatRequestMutation,
  useAcceptExchangeMutation,
  useUpdateExchangeUpdateDateForSerialMutation } = exchangeApi;
