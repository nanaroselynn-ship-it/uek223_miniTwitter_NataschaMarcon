// SQL schema for the users table including credentials, roles, and status
const USER_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    isBlocked BOOLEAN NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id)
  );`

// SQL schema for the posts table with a foreign key reference to the author
const POST_TABLE = `
  CREATE TABLE IF NOT EXISTS posts (
    id INT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    authorId INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (authorId) REFERENCES users(id)
  );`

// SQL schema for the comments table linking both users and posts
const COMMENT_TABLE = `
  CREATE TABLE IF NOT EXISTS comments (
    id INT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    authorId INT NOT NULL,
    postId INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (authorId) REFERENCES users(id),
    FOREIGN KEY (postId) REFERENCES posts(id)
  );`

// SQL schema for reactions with a unique constraint to prevent multiple reactions per user/post
const REACTION_TABLE = `
  CREATE TABLE IF NOT EXISTS reactions (
    id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(20) NOT NULL,
    userId INT NOT NULL,
    postId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (userId, postId),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (postId) REFERENCES posts(id)
  );`

export { USER_TABLE, POST_TABLE, COMMENT_TABLE, REACTION_TABLE }
