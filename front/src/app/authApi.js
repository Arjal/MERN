import { mainApi } from './mainApi';

export const authApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({

    userSignUp: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    userLogin: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),

  }),
});

export const { useUserSignUpMutation, useUserLoginMutation } = authApi;
