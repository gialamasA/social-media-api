require('dotenv').config();
const express = require('express');
const loggingMiddleware = require('./middlewares/loggingMiddleware');
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

// Initialize express app
const app = express();

app.use(express.json());

 // Log basic details of each incoming API call
app.use(loggingMiddleware);

// Routes
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
