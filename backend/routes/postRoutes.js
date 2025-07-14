import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost, unlikePost, deleteComment,
  getFeed,
  getTimeline
} from '../controllers/postController.js';

import { protect } from '../middleware/authmiddleware.js';
import { addComment, searchPosts } from '../controllers/postController.js';

const router = express.Router();

router.get('/search', searchPosts);
router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/timeline', protect, getTimeline);
router.get('/feed', protect, getFeed);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);
router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);





export default router;

