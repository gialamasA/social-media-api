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
  validatePostId,
  validatePagination,
  handleValidationErrors,
} = require('../middlewares/validationMiddleware');

const router = express.Router();

// Create a new comment
router.post('/', authenticateToken, validateCreateComment, handleValidationErrors, createComment);

// Edit an existing comment
router.put('/:id', authenticateToken, validatePostId, validateCreateComment, handleValidationErrors, editComment);

// Delete a comment
router.delete('/:id', authenticateToken, validatePostId, handleValidationErrors, deleteComment);

// Get comments for a post with pagination
router.get('/', authenticateToken, validatePostId, validatePagination, handleValidationErrors, getComments);

module.exports = router;
