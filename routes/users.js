// routes/usersRoutes.js
const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/usersController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  validateUserRegistration,
  validateUserLogin,
  handleValidationErrors,
} = require('../middlewares/validationMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', validateUserRegistration, handleValidationErrors, registerUser);

// Log in a user
router.post('/login', validateUserLogin, handleValidationErrors, loginUser);

// Log out a user
router.post('/logout', authenticateToken, logoutUser);

module.exports = router;
