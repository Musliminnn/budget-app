const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'

// Import database module
let db;
if (!isDev) {
  const Database = require('better-sqlite3');
  const dbPath = path.join(app.getPath('userData'), 'budget.db');
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
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  if (isDev) {
    // Try port 5174 first, then fallback to 5173
    mainWindow.loadURL('http://localhost:5174').catch(() => {
      mainWindow.loadURL('http://localhost:5173')
    })
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers for database operations
ipcMain.handle('db:addTransaction', async (event, transaction) => {
  if (!db) return { success: false, error: 'Database not available in dev mode' };

  try {
    const stmt = db.prepare(`
      INSERT INTO transactions (type, amount, description, category, date)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      transaction.type,
      transaction.amount,
      transaction.description,
      transaction.category,
      transaction.date
    );
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:getTransactionsByMonth', async (event, year, month) => {
  if (!db) return [];

  const stmt = db.prepare(`
    SELECT * FROM transactions
    WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
    ORDER BY date DESC, created_at DESC
  `);
  return stmt.all(year.toString(), month.toString().padStart(2, '0'));
});

ipcMain.handle('db:deleteTransaction', async (event, id) => {
  if (!db) return { success: false, error: 'Database not available in dev mode' };

  try {
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    stmt.run(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:updateTransaction', async (event, id, transaction) => {
  if (!db) return { success: false, error: 'Database not available in dev mode' };

  try {
    const stmt = db.prepare(`
      UPDATE transactions
      SET type = ?, amount = ?, description = ?, category = ?, date = ?
      WHERE id = ?
    `);
    stmt.run(
      transaction.type,
      transaction.amount,
      transaction.description,
      transaction.category,
      transaction.date,
      id
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:getSummaryByMonth', async (event, year, month) => {
  if (!db) return [];

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
});

ipcMain.handle('db:getCategorySummary', async (event, type, year, month) => {
  if (!db) return [];

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
});