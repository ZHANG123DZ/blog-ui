import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../BaseQuery/baseQuery.js';

export const otherProfileApi = createApi({
  reducerPath: 'otherProfile',
  baseQuery,
  tagTypes: ['Profile'],
  endpoints: (build) => ({
    getOtherProfile: build.query({
      query: (userName) => `/users/${userName}`,
    }),
  }),
});

export const { useGetOtherProfileQuery } = otherProfileApi;
