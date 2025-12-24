const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(process.env.DB_PATH || './database.sqlite');
    this.init();
  }

  init() {
    // Create users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        is_active BOOLEAN DEFAULT 1
      )
    `);

    // Create sessions table for token blacklisting
    this.db.run(`
      CREATE TABLE IF NOT EXISTS blacklisted_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  }

  // User operations
  createUser(userData) {
    return new Promise((resolve, reject) => {
      const { username, email, password, role = 'user' } = userData;
      this.db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, password, role],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, username, email, role });
        }
      );
    });
  }

  findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE email = ? AND is_active = 1',
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  findUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = ? AND is_active = 1',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  updateLastLogin(userId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Token blacklisting
  blacklistToken(token) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO blacklisted_tokens (token) VALUES (?)',
        [token],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  isTokenBlacklisted(token) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT token FROM blacklisted_tokens WHERE token = ?',
        [token],
        (err, row) => {
          if (err) reject(err);
          else resolve(!!row);
        }
      );
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = new Database();