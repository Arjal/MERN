import React, { useState } from 'react';
import { useGetFeedQuery } from '../app/feedApi';
import {
  useLikePostMutation,
  useUnlikePostMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from '../app/postApi';
import { useSearchUsersQuery } from '../app/userApi';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';

export default function Home() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [searchTerm, setSearchTerm] = useState('');
  const [newComments, setNewComments] = useState({});
  const { data: searchResults = [], isFetching } = useSearchUsersQuery(searchTerm, {
    skip: !searchTerm,
  });
  const { data: posts = [], isLoading } = useGetFeedQuery();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleCommentChange = (postId, text) => {
    setNewComments(prev => ({ ...prev, [postId]: text }));
  };

  const handleAddComment = async (postId) => {
    const text = newComments[postId]?.trim();
    if (!text) return toast.error('Comment cannot be empty.');
    try {
      await addComment({ postId, text }).unwrap();
      toast.success('Comment added!');
      setNewComments(prev => ({ ...prev, [postId]: '' }));
    } catch {
      toast.error('Failed to add comment.');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment({ postId, commentId }).unwrap();
      toast.success('Comment deleted!');
    } catch {
      toast.error('Failed to delete comment.');
    }
  };

  const handleLikeToggle = async (post) => {
    const hasLiked = post.likes.includes(userInfo._id);
    try {
      if (hasLiked) {
        await unlikePost({ id: post._id }).unwrap();
      } else {
        await likePost({ id: post._id }).unwrap();
      }
    } catch {
      toast.error('Failed to update like status.');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto pt-8 space-y-4">
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full px-4 py-2 border rounded shadow"
        />
      </div>

      {searchTerm && (
        <div className="space-y-2">
          {isFetching ? (
            <div>Searching...</div>
          ) : (
            searchResults.map(user => (
              <div
                key={user._id}
                onClick={() => navigate(`/profile/${user._id}`)}
                className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
              >
                <div className="font-semibold">@{user.username}</div>
                <div className="text-sm text-gray-600">{user.bio}</div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="space-y-4 pt-8">
        {posts.map(post => {
          const hasLiked = post.likes.includes(userInfo?._id);
          return (
            <div key={post._id} className="p-4 bg-white shadow rounded">
              <div className="font-bold">{post.author.username}</div>
              <div className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleString()}</div>
              <p className="mt-2">{post.content}</p>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleLikeToggle(post)}
                  className={`px-3 py-1 rounded ${hasLiked ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                    }`}
                >
                  {hasLiked ? ' Unlike' : ' Like'} {post.likes.length}
                </button>
                <span className="text-gray-500 text-xs">{post.comments.length} comments</span>
              </div>

              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold mb-2">Comments</h4>
                {post.comments?.length === 0 && <p>No comments yet.</p>}
                {post.comments?.map(comment => (
                  <div key={comment._id} className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded">
                    <div>
                      <span className="font-semibold">@{comment.author?.username || 'Unknown'}:</span> {comment.text}
                    </div>
                    {userInfo?.username === comment.author?.username && (
                      <button
                        onClick={() => handleDeleteComment(post._id, comment._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}


                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    className="flex-grow border p-2 rounded"
                    placeholder="Add a comment..."
                    value={newComments[post._id] || ''}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
