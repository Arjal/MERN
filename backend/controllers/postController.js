import Post from '../models/Post.js';
import User from '../models/User.js';

// ✅ Create a post
export const createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      content: req.body.content,
      author: req.user.id,
      image: req.image || ''
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};


export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
};


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post', error: err.message });
  }
};


export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    post.content = req.body.content || post.content;
    post.image = req.image || post.image;
    const updated = await post.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update post', error: err.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};


export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
    }
    res.status(200).json({ message: 'Post liked', likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Error liking post', error: err.message });
  }
};


export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes = post.likes.filter(
      id => id.toString() !== req.user.id.toString()
    );
    await post.save();
    res.status(200).json({ message: 'Post unliked', likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Error unliking post', error: err.message });
  }
};


export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      text,
      author: req.user.id,
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();
    res.status(201).json({ message: 'Comment added', comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments = post.comments.filter(
      comment => comment._id.toString() !== req.params.commentId
    );
    await post.save();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
};


export const searchPosts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    const posts = await Post.find({
      content: { $regex: query, $options: 'i' }
    }).populate('author', 'username');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userIds = [currentUser._id, ...currentUser.following];
    const posts = await Post.find({ author: { $in: userIds } })
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load feed', error: err.message });
  }
};

export const getTimeline = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load timeline', error: err.message });
  }
};

