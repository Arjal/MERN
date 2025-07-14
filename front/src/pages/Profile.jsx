import React from 'react';
import {
  useGetProfileQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from '../app/userApi.js';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem('userInfo'));

  const { data, isLoading, error, refetch } = useGetProfileQuery(id);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error || !data?.user) return <div>Error loading profile.</div>;

  const isFollowing = data.user.followers.some(f => f._id?.toString() === currentUser._id?.toString());

  console.log('Profile Data:', data);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(data.user._id).unwrap();
        toast.success('Unfollowed successfully!');
      } else {
        await followUser(data.user._id).unwrap();
        toast.success('Followed successfully!');
      }
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed.');
    }
  };


  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold">{data.user.username}</h2>
      <p className="text-gray-600">{data.user.bio}</p>

      {currentUser._id !== data.user._id && (
        <button
          onClick={handleFollowToggle}
          className={`mt-4 px-4 py-2 rounded text-white ${isFollowing ? 'bg-red-600' : 'bg-blue-600'
            }`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}

      <div className="mt-8 space-y-4">
        {data.posts.map((p) => (
          <div key={p._id} className="p-4 bg-white shadow rounded">
            <p>{p.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
