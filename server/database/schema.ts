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