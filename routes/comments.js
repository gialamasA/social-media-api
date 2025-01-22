const express = require('express');
const {
  createComment,
  editComment,
  deleteComment,
  getComments,
} = require('../controllers/commentsController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  validateCreateComment,
  validateCommentId,
  validateGetComments,
  validateEditComment,
  handleValidationErrors,
} = require('../middlewares/validationMiddleware');

const router = express.Router();

// Create a new comment
router.post(
  '/',
  authenticateToken,
  validateCreateComment,
  handleValidationErrors,
  createComment
);

// Edit an existing comment
router.put(
  '/:id',
  authenticateToken,
  validateCommentId,
  validateEditComment,
  handleValidationErrors,
  editComment
);

// Delete a comment
router.delete(
  '/:id',
  authenticateToken,
  validateCommentId,
  handleValidationErrors,
  deleteComment
);

// Get comments for a post with pagination
router.get(
  '/',
  authenticateToken,
  validateGetComments,
  handleValidationErrors,
  getComments
);

module.exports = router;
