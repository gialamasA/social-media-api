const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db-connect');

// Create Post
async function createPost(req, res) {
  const { content } = req.body;

  try {
    const postId = uuidv4();

    const result = await db.query(
      'INSERT INTO posts (id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [postId, req.user.id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update Post
async function updatePost(req, res) {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const result = await db.query(
      'UPDATE posts SET content = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [content, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete Post
async function deletePost(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get Posts with Pagination
async function getPosts(req, res) {
  const { userId, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = userId
      ? await db.query(
          'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
          [userId, limit, offset]
        )
      : await db.query(
          'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
          [limit, offset]
        );

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
};
