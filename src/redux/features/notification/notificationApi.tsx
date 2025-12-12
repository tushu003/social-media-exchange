import { baseApi } from "../../api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReadExchangeNotificaion: builder.query({
      query: (id) => {
        return {
          url: `/shared/isReadExchange/${id}`,
          method: "GET",
        };
      },
      providesTags: (result, error, id) => [
        { type: "ExchangeNotification", id },
      ],
    }),

    getAcceptedExchangeNotification: builder.query({
      query: (id) => ({
        url: `/shared/getAcceptedDataForNav/${id}`,
        method: "GET",
      }),
    }),

    postMarkAllReadExchangeNotification: builder.mutation({
      query: (id) => ({
        url: `/shared/isReadExchange/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ExchangeNotification", id },
      ],
    }),
  }),
});

export const {
  useGetReadExchangeNotificaionQuery,
  useGetAcceptedExchangeNotificationQuery,
  usePostMarkAllReadExchangeNotificationMutation,
} = notificationApi;
