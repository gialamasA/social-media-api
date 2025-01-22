const { body, param, query, validationResult } = require('express-validator');

// User Validations
const validateUserRegistration = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Post Validations
const validateCreatePost = [
  body('content').notEmpty().withMessage('Content is required'),
];

const validatePostId = [
  param('id').isUUID().withMessage('Invalid post ID format'),
];

// Comment Validations
const validateCreateComment = [
  body('postId').isUUID().withMessage('Invalid post ID format'),
  body('comment').notEmpty().withMessage('Comment is required'),
];

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
];

// Common Validation Handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateCreatePost,
  validatePostId,
  validateCreateComment,
  validatePagination,
  handleValidationErrors,
};
