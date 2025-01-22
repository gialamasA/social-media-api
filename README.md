# Social Media API

A backend REST API built with Node.js and Express, designed for a social media app. The app supports user authentication, posts, comments, and uses Redis for session management and PostgreSQL for persistent storage.

## Features

- User authentication with JWT.
- Create, edit, delete, and retrieve posts and comments.
- Pagination support for posts and comments.
- Session management using Redis.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Cache/Session Store**: Redis
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites

- [Docker](https://www.docker.com/) installed on your machine.

### Step 1: Clone the Repository

```bash
git clone https://github.com/gialamasA/social-media-api.git
cd social-media-api
```

### Step 2: Create a `.env` File

Create a `.env` file in the project root using `.env.example` as a reference:
```bash
cp .env.example .env
```
Fill in the required values:
- `DATABASE_URL`: PostgreSQL connection string.
- `REDIS_URL`: Redis connection string.
- `JWT_SECRET`: A strong, random secret key for signing JWTs.
- `JWT_EXPIRATION`: Token expiration time (e.g., `1h` for 1 hour).

### Step 3: Start the Services

Run the following command to build and start the application:
```bash
docker compose up --build
```

### Step 4: Access the Application

The server will be running on `http://localhost:3000`.

### Step 5: Add the PostgreSQL Server to pgAdmin

1. Open [pgAdmin](http://localhost:5050).
2. Add a new server with the following details:
   - **Host**: `db`
   - **Port**: `5432`
   - **Database**: `socialmediaapi`
   - **Username**: `user`
   - **Password**: `password`

## API Endpoints

### Authentication
- **Register**: `POST /users/register`
  ```json
  {
    "email": "test@example.com",
    "password": "securepassword"
  }
  ```
- **Login**: `POST /users/login`
  ```json
  {
    "email": "test@example.com",
    "password": "securepassword"
  }
  ```
- **Logout**: `POST /users/logout`

### Posts
- **Create Post**: `POST /posts`
- **Edit Post**: `PUT /posts/:id`
- **Delete Post**: `DELETE /posts/:id`
- **Get Posts**: `GET /posts?page=1&limit=10`

### Comments
- **Create Comment**: `POST /comments`
- **Edit Comment**: `PUT /comments/:id`
- **Delete Comment**: `DELETE /comments/:id`
- **Get Comments**: `GET /comments?postId=<post_id>&page=1&limit=5`