const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../utils/db-connect');
const redis = require('../utils/redis-connect');
const { v4: uuidv4 } = require('uuid');

// Register User
async function registerUser(req, res) {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate user ID and hash the password
    const userId = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert new user into the database
    const result = await db.query(
      'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email',
      [userId, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Login User
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    // Retrieve user from the database
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify the password
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Store the token in Redis
    const expirationInSeconds = 60 * 60; // 1 hour
    await redis.setex(`auth_token:${user.id}`, expirationInSeconds, token);

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Logout User
async function logoutUser(req, res) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Authorization token is required' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Remove token from Redis
    const redisKey = `auth_token:${decoded.id}`;
    const redisResult = await redis.del(redisKey);

    if (redisResult === 0) {
      return res.status(404).json({ message: 'Session not found or already logged out' });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
