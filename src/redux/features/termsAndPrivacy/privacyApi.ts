import { baseApi } from "../../api/baseApi";

export const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacy: builder.query({
      query: () => ({
        url: "/privacy",
        method: "GET",
      }),
      providesTags: ["Privacy"],
    }),

    createPrivacy: builder.mutation({
      query: (data) => ({
        url: "/privacy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Privacy"],
    }),

    updatePrivacy: builder.mutation({
      query: (data) => ({
        url: `/privacy/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Privacy"],
    }),

    deletePrivacy: builder.mutation({
      query: (id) => ({
        url: `/privacy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Privacy"],
    }),
  }),
});

export const { useGetPrivacyQuery, useCreatePrivacyMutation, useUpdatePrivacyMutation, useDeletePrivacyMutation } = privacyApi;
