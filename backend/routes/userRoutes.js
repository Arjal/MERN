import express from 'express';
import { getUserProfile, followUser, unfollowUser, searchUsers, updateUserProfile, getFollowers, getFollowing } from '../controllers/userController.js';
import { protect } from '../middleware/authmiddleware.js';
import { updatefileCheck } from '../middleware/checkFile.js';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/:id', getUserProfile);
router.put('/:id/follow', protect, followUser);
router.put('/:id/unfollow', protect, unfollowUser);
router.put('/:id', protect, updatefileCheck, updateUserProfile);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

export default router;

