import { mainApi } from './mainApi';

export const postApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (newPost) => ({ url: '/posts', method: 'POST', body: newPost }),
      invalidatesTags: ['Feed', 'Post'],
    }),
    likePost: builder.mutation({
      query: ({ id }) => ({ url: `/posts/${id}/like`, method: 'POST' }),
      invalidatesTags: ['Feed', 'Post'],
    }),
    unlikePost: builder.mutation({
      query: ({ id }) => ({ url: `/posts/${id}/unlike`, method: 'POST' }),
      invalidatesTags: ['Feed', 'Post'],
    }),
    updatePost: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['Feed', 'Post'],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Feed', 'Post'],
    }),
    addComment: builder.mutation({
      query: ({ postId, text }) => ({
        url: `/posts/${postId}/comment`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Feed', 'Post'],
    }),

    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/posts/${postId}/comment/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Feed', 'Post'],
    }),
  }),
});

export const { useCreatePostMutation, useLikePostMutation, useUnlikePostMutation, useUpdatePostMutation, useDeletePostMutation, useAddCommentMutation, useDeleteCommentMutation } = postApi;
