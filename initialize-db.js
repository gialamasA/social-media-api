const db = require('./utils/db-connect');

// Initialize the database
async function initializeDatabase() {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPostsTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `;

  const createCommentsTableQuery = `
    CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY,
        post_id UUID NOT NULL,
        user_id UUID NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `;

  try {
    console.log('Initializing database...');
    await db.query(createUsersTableQuery);
    await db.query(createPostsTableQuery);
    await db.query(createCommentsTableQuery);
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

initializeDatabase();
