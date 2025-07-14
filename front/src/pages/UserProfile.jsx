import React, { useState } from 'react';
import { useGetTimelineQuery } from '../app/feedApi';
import {
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from '../app/postApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { baseUrl } from '../app/mainApi';

const UserProfile = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo) {
    return <div>No user data found, please log in again.</div>;
  }

  const { data: posts, isLoading, isError } = useGetTimelineQuery();
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [newComments, setNewComments] = useState({});
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const navigate = useNavigate();

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.content);
  };

  const handleUpdate = async () => {
    try {
      await updatePost({ id: editingPostId, updatedData: { content: editedContent } }).unwrap();
      toast.success('Post updated successfully!');
      setEditingPostId(null);
    } catch (err) {
      toast.error('Failed to update post.');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId).unwrap();
      toast.success('Post deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete post.');
    }
  };

  const handleCommentChange = (postId, text) => {
    setNewComments((prev) => ({ ...prev, [postId]: text }));
  };

  const handleAddComment = async (postId) => {
    const text = newComments[postId]?.trim();
    if (!text) {
      toast.error('Comment cannot be empty.');
      return;
    }
    try {
      await addComment({ postId, text }).unwrap();
      toast.success('Comment added!');
      setNewComments((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      toast.error('Failed to add comment.');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment({ postId, commentId }).unwrap();
      toast.success('Comment deleted!');
    } catch (err) {
      toast.error('Failed to delete comment.');
    }
  };

  if (isLoading) return <p>Loading your posts...</p>;
  if (isError) return <p>Failed to load posts.</p>;

  return (
    <div className="max-w-xl mx-auto mt-6 px-4">
      <div className="flex items-center mb-4">
        <img
          src={userInfo?.profilePicture ? `${baseUrl}${userInfo.profilePicture}` : '/default-profile.png'}
          alt="Profile"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h2 className="text-2xl font-bold">{userInfo?.username}</h2>
          <p className="text-gray-600">{userInfo?.bio || "This user hasn't written a bio yet."}</p>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={() => navigate(`/Updateuser/${userInfo._id}`)}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Edit Profile
        </button>
      </div>

      <h3 className="text-xl mb-4">Your Posts</h3>

      {posts && posts.length === 0 && <p>You have not posted anything yet.</p>}

      {posts?.map((post) => (
        <div key={post._id} className="bg-white shadow-md rounded-xl p-4 mb-4">
          {editingPostId === post._id ? (
            <>
              <textarea
                className="w-full p-2 border rounded mb-2"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-1 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingPostId(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-800">{post.content}</p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>

              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold mb-2">Comments</h4>
                {post.comments?.length === 0 && <p>No comments yet.</p>}
                {post.comments?.map((comment) => (
                  <div key={comment._id} className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded">
                    <div>
                      <span className="font-semibold">@{comment.author?.username || 'Unknown'}:</span> {comment.text}
                    </div>

                    {userInfo?.username && comment?.author?.username && (() => {
                      const commentUser = comment.author.username.trim().toLowerCase();
                      const currentUser = userInfo.username.trim().toLowerCase();
                      if (commentUser === currentUser) {
                        return (
                          <button
                            onClick={() => handleDeleteComment(post._id, comment._id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        );
                      }
                      return null;
                    })()}
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
