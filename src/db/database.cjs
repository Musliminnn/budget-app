const Database = require('better-sqlite3');
const path = require('path');

class BudgetDatabase {
  constructor(app) {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'budget.db');

    this.db = new Database(dbPath);
    this.initTables();
  }

  initTables() {
    this.db.exec(`
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
  }

  addTransaction(transaction) {
    const stmt = this.db.prepare(`
      INSERT INTO transactions (type, amount, description, category, date)
      VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(
      transaction.type,
      transaction.amount,
      transaction.description,
      transaction.category,
      transaction.date
    );
  }

  getTransactionsByMonth(year, month) {
    const stmt = this.db.prepare(`
      SELECT * FROM transactions
      WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
      ORDER BY date DESC, created_at DESC
    `);

    return stmt.all(year.toString(), month.toString().padStart(2, '0'));
  }

  deleteTransaction(id) {
    const stmt = this.db.prepare('DELETE FROM transactions WHERE id = ?');
    return stmt.run(id);
  }

  updateTransaction(id, transaction) {
    const stmt = this.db.prepare(`
      UPDATE transactions
      SET type = ?, amount = ?, description = ?, category = ?, date = ?
      WHERE id = ?
    `);

    return stmt.run(
      transaction.type,
      transaction.amount,
      transaction.description,
      transaction.category,
      transaction.date,
      id
    );
  }

  getSummaryByMonth(year, month) {
    const stmt = this.db.prepare(`
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

  getCategorySummary(type, year, month) {
    const stmt = this.db.prepare(`
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

  close() {
    this.db.close();
  }
}

module.exports = BudgetDatabase;