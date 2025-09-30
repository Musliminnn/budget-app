const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  db: {
    addTransaction: (transaction) => ipcRenderer.invoke('db:addTransaction', transaction),
    getTransactionsByMonth: (year, month) => ipcRenderer.invoke('db:getTransactionsByMonth', year, month),
    deleteTransaction: (id) => ipcRenderer.invoke('db:deleteTransaction', id),
    updateTransaction: (id, transaction) => ipcRenderer.invoke('db:updateTransaction', id, transaction),
    getSummaryByMonth: (year, month) => ipcRenderer.invoke('db:getSummaryByMonth', year, month),
    getCategorySummary: (type, year, month) => ipcRenderer.invoke('db:getCategorySummary', type, year, month)
  }
})