import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const baseUrl = 'http://192.168.100.54:5000';
export const baseUrl = https://mern-backend-nmbd.onrender.com;
export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api`,
    prepareHeaders: (headers) => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (userInfo?.token) {
        headers.set('Authorization', `Bearer ${userInfo.token}`);
      }

      console.log('Headers:', headers);
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});
