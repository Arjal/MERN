import { mainApi } from './mainApi';

export const userApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    followUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}/follow`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    unfollowUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}/unfollow`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    searchUsers: builder.query({
      query: (searchTerm) => `/users/search?query=${searchTerm}`,
    }),
    updateUserProfile: builder.mutation({
      query: ({ id, username, bio, profilePicture }) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('bio', bio);
        if (profilePicture) {
          formData.append('image', profilePicture); // key should match req.files.image
        }

        return {
          url: `/users/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

  }),
});

export const { useGetProfileQuery, useFollowUserMutation, useUnfollowUserMutation, useSearchUsersQuery, useUpdateUserProfileMutation } = userApi;
