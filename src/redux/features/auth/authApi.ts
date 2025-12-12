import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  // Add this endpoint to your existing authApi
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      transformResponse: (response) => {
        if (response.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          document.cookie = `accessToken=${response.data.accessToken}; path=/; secure; samesite=strict`;
        }
        return response;
      },
      invalidatesTags: ["User"],
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/create-user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/verifyOTP",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    verifyOTPForResetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/sendOtpForResetPassword",
        method: "PATCH",
        body: {
          email: data.email,
          otp: Number(data.otp),
        },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/resetPassword",
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
        },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    getAllExchangeData: builder.query({
      query: (query) => {
        return {
          url: `/shared/exchange`,
          method: "GET",
          params: query,
        };
      },
      providesTags: ["User"],
    }),

    getMessages: builder.query({
      query: ({ senderId, receiverId }) => ({
        url: `/messages?senderId=${senderId}&receiverId=${receiverId}`,
        method: "GET",
      }),
    }),

    changePassword: builder.mutation({
      query: ({ data, id }) => {
        console.log("88", data, id);

        return {
          url: `/auth/changePassword/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useVerifyOTPMutation,
  useVerifyOTPForResetPasswordMutation,
  useLoginUserMutation,
  useResetPasswordMutation,
  useGetAllExchangeDataQuery,
  useGetMessagesQuery,
  useChangePasswordMutation,
} = authApi;
