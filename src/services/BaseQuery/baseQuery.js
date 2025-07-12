// import { fetchBaseQuery } from '@reduxjs/toolkit/query';

// const baseQuery = fetchBaseQuery({
//   baseUrl: import.meta.env.VITE_BASE_URL,
//   prepareHeaders: (headers) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
//     }

//     return headers;
//   },
// });

// export default baseQuery;

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: 'include',
});

export default baseQuery;
