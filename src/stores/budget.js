import { defineStore } from 'pinia'

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    transactions: [],
    categories: [
      'Makanan',
      'Transportasi',
      'Belanja',
      'Tagihan',
      'Hiburan',
      'Lainnya'
    ],
    totalIncome: 0,
    totalExpense: 0
  }),

  getters: {
    balance: (state) => state.totalIncome - state.totalExpense,

    transactionsByCategory: (state) => (category) => {
      return state.transactions.filter(t => t.category === category)
    }
  },

  actions: {
    addTransaction(transaction) {
      this.transactions.push({
        ...transaction,
        id: Date.now(),
        date: new Date().toISOString()
      })

      if (transaction.type === 'income') {
        this.totalIncome += transaction.amount
      } else {
        this.totalExpense += transaction.amount
      }
    },

    removeTransaction(id) {
      const index = this.transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        const transaction = this.transactions[index]
        if (transaction.type === 'income') {
          this.totalIncome -= transaction.amount
        } else {
          this.totalExpense -= transaction.amount
        }
        this.transactions.splice(index, 1)
      }
    }
  }
})