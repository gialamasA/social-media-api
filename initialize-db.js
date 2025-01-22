const db = require('./utils/db-connect');

// Utility function to delay execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const maxRetries = 5;
  let retries = maxRetries;

  while (retries > 0) {
    try {
      console.log('Initializing database...');
      // Test connection
      await db.query('SELECT 1');
      console.log('Database is ready.');

      // Create tables
      await db.query(createUsersTableQuery);
      await db.query(createPostsTableQuery);
      await db.query(createCommentsTableQuery);

      console.log('Database initialized successfully.');
      process.exit(0);
    } catch (error) {
      console.error(`Error initializing database: ${error.message}`);
      retries -= 1;

      if (retries === 0) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }

      console.log(`Retrying in 5 seconds... (${maxRetries - retries}/${maxRetries})`);
      await sleep(5000); // Wait before retrying
    }
  }
}

initializeDatabase();
