import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db;

export function initDatabase() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'budget.db');

  db = new Database(dbPath);

  // Create transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount REAL NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

// Transaction operations
export function addTransaction(type, amount, description, category, date) {
  const stmt = db.prepare(`
    INSERT INTO transactions (type, amount, description, category, date)
    VALUES (?, ?, ?, ?, ?)
  `);

  return stmt.run(type, amount, description, category, date);
}

export function getTransactionsByMonth(year, month) {
  const stmt = db.prepare(`
    SELECT * FROM transactions
    WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
    ORDER BY date DESC, created_at DESC
  `);

  return stmt.all(year.toString(), month.toString().padStart(2, '0'));
}

export function getTransactionsByDateRange(startDate, endDate) {
  const stmt = db.prepare(`
    SELECT * FROM transactions
    WHERE date BETWEEN ? AND ?
    ORDER BY date DESC, created_at DESC
  `);

  return stmt.all(startDate, endDate);
}

export function deleteTransaction(id) {
  const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
  return stmt.run(id);
}

export function updateTransaction(id, type, amount, description, category, date) {
  const stmt = db.prepare(`
    UPDATE transactions
    SET type = ?, amount = ?, description = ?, category = ?, date = ?
    WHERE id = ?
  `);

  return stmt.run(type, amount, description, category, date, id);
}

export function getSummaryByMonth(year, month) {
  const stmt = db.prepare(`
    SELECT
      type,
      category,
      SUM(amount) as total,
      COUNT(*) as count
    FROM transactions
    WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
    GROUP BY type, category
  `);

  return stmt.all(year.toString(), month.toString().padStart(2, '0'));
}

export function getCategorySummary(type, year, month) {
  const stmt = db.prepare(`
    SELECT
      category,
      SUM(amount) as total,
      COUNT(*) as count
    FROM transactions
    WHERE type = ? AND strftime('%Y', date) = ? AND strftime('%m', date) = ?
    GROUP BY category
    ORDER BY total DESC
  `);

  return stmt.all(type, year.toString(), month.toString().padStart(2, '0'));
}