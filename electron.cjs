const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const BudgetDatabase = require('./src/db/database.cjs')

const isDev = process.env.NODE_ENV !== 'production'

// Database instance
let database;

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
  // Initialize database
  if (!isDev) {
    database = new BudgetDatabase(app)
  }

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
ipcMain.handle('db:addTransaction', async (_event, transaction) => {
  if (!database) return { success: false, error: 'Database not available in dev mode' };

  try {
    const result = database.addTransaction(transaction);
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:getTransactionsByMonth', async (_event, year, month) => {
  if (!database) return [];
  return database.getTransactionsByMonth(year, month);
});

ipcMain.handle('db:deleteTransaction', async (_event, id) => {
  if (!database) return { success: false, error: 'Database not available in dev mode' };

  try {
    database.deleteTransaction(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:updateTransaction', async (_event, id, transaction) => {
  if (!database) return { success: false, error: 'Database not available in dev mode' };

  try {
    database.updateTransaction(id, transaction);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:getSummaryByMonth', async (_event, year, month) => {
  if (!database) return [];
  return database.getSummaryByMonth(year, month);
});

ipcMain.handle('db:getCategorySummary', async (_event, type, year, month) => {
  if (!database) return [];
  return database.getCategorySummary(type, year, month);
});