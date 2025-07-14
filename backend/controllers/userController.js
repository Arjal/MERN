import User from '../models/User.js';
import Post from '../models/Post.js';
import fs from 'fs';
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username')
      .populate('following', 'username');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: req.params.id });

    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile', error: err.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser)
      return res.status(404).json({ message: 'User not found' });

    if (targetUser._id.equals(currentUser._id))
      return res.status(400).json({ message: "You can't follow yourself" });

    const alreadyFollowing = currentUser.following.some(followedId => followedId.equals(targetUser._id));


    if (alreadyFollowing) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: `Now following ${targetUser.username}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to follow user', error: err.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser)
      return res.status(404).json({ message: 'User not found' });

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ message: `Unfollowed ${targetUser.username}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unfollow user', error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    }).select('-password');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};



export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { username, bio } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (bio) user.bio = bio;

    if (req.image) {

      if (user.profilePicture) {
        fs.unlink(`./uploads${user.profilePicture}`, (err) => {
          if (err) console.log('Failed to delete old image:', err.message);
        });
      }
      user.profilePicture = req.image;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};


export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username profilePicture');
    res.status(200).json(user.followers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username profilePicture');
    res.status(200).json(user.following);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



