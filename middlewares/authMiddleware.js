const jwt = require('jsonwebtoken');
const redis = require('../utils/redis-connect');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('Access token missing');
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check Redis for token
    const redisKey = `auth_token:${decoded.id}`;
    const tokenExists = await redis.get(redisKey);

    if (!tokenExists) {
      console.error(`Token not found in Redis. Key: ${redisKey}`);
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }

    if (tokenExists !== token) {
      console.error('Token mismatch');
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }

    // Attach user info to request object
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('JWT expired:', error);
      return res.status(401).json({ message: 'Token has expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      console.error('JWT invalid:', error);
      return res.status(403).json({ message: 'Token is invalid' });
    }

    console.error('JWT verification error:', error);
    res.status(500).json({ message: 'Internal server error during token verification' });
  }
}

module.exports = { authenticateToken };
