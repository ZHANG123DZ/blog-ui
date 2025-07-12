import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../BaseQuery/baseQuery.js';

export const myProfileApi = createApi({
  reducerPath: 'myProfile',
  baseQuery,
  tagTypes: ['myProfile'],
  endpoints: (build) => ({
    getMyProfile: build.query({
      query: () => '/auth/me',
      providesTags: ['myProfile'],
    }),
    updateMyProfile: build.mutation({
      query: ({ body }) => ({
        url: `/users/me`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['myProfile'],
    }),
  }),
});

export const { useUpdateMyProfileMutation, useGetMyProfileQuery } =
  myProfileApi;
