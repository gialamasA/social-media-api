const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db-connect');

// Create a comment
async function createComment(req, res) {
  const { postId, comment } = req.body;

  try {
    const commentId = uuidv4();

    const result = await db.query(
      'INSERT INTO comments (id, post_id, user_id, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [commentId, postId, req.user.id, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Edit a comment
async function editComment(req, res) {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const result = await db.query(
      'UPDATE comments SET comment = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [comment, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a comment
async function deleteComment(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found or unauthorized' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Retrieve comments with pagination
async function getComments(req, res) {
  const { postId, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await db.query(
      'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [postId, limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createComment,
  editComment,
  deleteComment,
  getComments,
};
