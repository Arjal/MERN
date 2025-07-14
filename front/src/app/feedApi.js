
import { mainApi } from "./mainApi";

export const feedApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query({
      query: () => '/posts/feed',
      providesTags: ['Feed'],
    }),
    getTimeline: builder.query({
      query: () => '/posts/timeline',
      providesTags: ['Timeline'],
    }),
  }),
});

export const { useGetFeedQuery, useGetTimelineQuery } = feedApi;
