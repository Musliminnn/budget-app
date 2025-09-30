const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

let database
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  mainWindow.once('ready-to-show', () => {
      mainWindow.show()
      mainWindow.maximize()
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5174')
      .catch(() => mainWindow.loadURL('http://localhost:5173'))
    mainWindow.webContents.openDevTools()
  } else {
    const unpackedPath = __dirname.replace('app.asar', 'app.asar.unpacked')
    const indexPath = path.join(unpackedPath, 'dist', 'index.html')

    mainWindow.loadFile(indexPath)
  }
}

app.whenReady().then(() => {
  // Initialize database
  try {
    const BudgetDatabase = require('./src/db/database.cjs')
    database = new BudgetDatabase(app)
  } catch (error) {
    console.error('Database error:', error)
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

// IPC Handlers
ipcMain.handle('db:addTransaction', async (_event, transaction) => {
  if (!database) return { success: false, error: 'Database not initialized' }
  try {
    const result = database.addTransaction(transaction)
    return { success: true, id: result.lastInsertRowid }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('db:getTransactionsByMonth', async (_event, year, month) => {
  if (!database) return []
  try {
    return database.getTransactionsByMonth(year, month)
  } catch (error) {
    return []
  }
})

ipcMain.handle('db:deleteTransaction', async (_event, id) => {
  if (!database) return { success: false, error: 'Database not initialized' }
  try {
    database.deleteTransaction(id)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('db:updateTransaction', async (_event, id, transaction) => {
  if (!database) return { success: false, error: 'Database not initialized' }
  try {
    database.updateTransaction(id, transaction)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('db:getSummaryByMonth', async (_event, year, month) => {
  if (!database) return []
  try {
    return database.getSummaryByMonth(year, month)
  } catch (error) {
    return []
  }
})

ipcMain.handle('db:getCategorySummary', async (_event, type, year, month) => {
  if (!database) return []
  try {
    return database.getCategorySummary(type, year, month)
  } catch (error) {
    return []
  }
})