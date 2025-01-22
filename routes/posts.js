const express = require('express');
const {
  createPost,
  updatePost,
  deletePost,
  getPosts,
} = require('../controllers/postsController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  validateCreatePost,
  validatePostId,
  validateGetPosts,
  handleValidationErrors,
} = require('../middlewares/validationMiddleware');

const router = express.Router();

// Create a new post
router.post(
  '/',
  authenticateToken,
  validateCreatePost,
  handleValidationErrors,
  createPost
);

// Update an existing post
router.put(
  '/:id',
  authenticateToken,
  validatePostId,
  validateCreatePost,
  handleValidationErrors,
  updatePost
);

// Delete a post
router.delete(
  '/:id',
  authenticateToken,
  validatePostId,
  handleValidationErrors,
  deletePost
);

// Get all posts with pagination (and optional userId)
router.get(
  '/',
  authenticateToken,
  validateGetPosts,
  handleValidationErrors,
  getPosts
);

module.exports = router;
