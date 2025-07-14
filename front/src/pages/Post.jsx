import React, { useState } from 'react';
import { useCreatePostMutation } from '../app/postApi';

export default function CreatePostForm() {
  const [content, setContent] = useState('');
  const [createPost, { isLoading, isError, error }] = useCreatePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ content }).unwrap();
      setContent('');


    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold">Create a New Post</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isLoading ? 'Posting...' : 'Post'}
      </button>

      {isError && <div className="text-red-500">Error: {error?.data?.message}</div>}
    </form>
  );
}
