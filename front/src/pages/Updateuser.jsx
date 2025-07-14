import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUpdateUserProfileMutation } from '../app/userApi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const UpdateUser = () => {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo?.username || '');
  const [bio, setBio] = useState(userInfo?.bio || '');
  const [profilePicture, setProfilePicture] = useState(userInfo?.profilePicture || '');

  const [updateUserProfile] = useUpdateUserProfileMutation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Logged-in user ID:", userInfo?._id);
    console.log("Profile ID from URL:", id);

    if (id !== userInfo?._id) {
      toast.error('You are not authorized to edit this profile.');
      navigate('/root');
    }
  }, [id, userInfo?._id]);


  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const profileData = {
        id,
        username,
        bio,
        profilePicture,
      };

      const updatedUser = await updateUserProfile(profileData).unwrap();
      const existingData = JSON.parse(localStorage.getItem('userInfo')) || {};
      const existingToken = existingData.token;

      localStorage.setItem('userInfo', JSON.stringify({
        token: updatedUser.token || existingToken,
        ...updatedUser.user,
      }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  return (
    <div className="max-w-xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

      <form onSubmit={handleProfileUpdate}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            className="w-full p-2 border rounded mt-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            id="bio"
            className="w-full p-2 border rounded mt-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            className="w-full p-2 mt-2"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
