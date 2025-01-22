const { body, param, query, validationResult } = require('express-validator');

/**
 * USER VALIDATIONS
 */
const validateUserRegistration = [
  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .trim(),
];

const validateUserLogin = [
  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .trim(),
];

/**
 * POST VALIDATIONS
 */
const validateCreatePost = [
  body('content')
    .trim()
    .escape()
    .notEmpty().withMessage('Content is required'),
];

const validatePostId = [
  param('id')
    .isUUID().withMessage('Invalid post ID format'),
];

/**
 * COMMENT VALIDATIONS
 */
const validateCreateComment = [
  body('postId')
    .isUUID().withMessage('Invalid post ID format'),
  body('comment')
    .trim()
    .escape()
    .notEmpty().withMessage('Comment is required'),
];

const validateCommentId = [
  param('id')
    .isUUID().withMessage('Invalid comment ID format'),
];

const validateEditComment = [
  body('comment')
    .trim()
    .escape()
    .notEmpty().withMessage('Comment is required'),
];

/**
 * PAGINATION VALIDATION
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
];

/**
 * GET POSTS VALIDATION
 */
const validateGetPosts = [
  query('userId')
    .optional()
    .isUUID().withMessage('Invalid userId format'),
  ...validatePagination,
];

/**
 * GET COMMENTS VALIDATION
 */
const validateGetComments = [
  query('postId')
    .isUUID().withMessage('Invalid post ID format'),
  ...validatePagination,
];

/**
 * COMMON VALIDATION HANDLER
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  // User validations
  validateUserRegistration,
  validateUserLogin,

  // Post validations
  validateCreatePost,
  validatePostId,
  validateGetPosts,

  // Comment validations
  validateCreateComment,
  validateCommentId,
  validateGetComments,
  validateEditComment,

  // Pagination
  validatePagination,

  // Common
  handleValidationErrors,
};
