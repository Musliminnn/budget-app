import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Mock database for development
const mockDb = {
  transactions: [],
  nextId: 1
};

const isElectron = typeof window !== 'undefined' && window.electronAPI;

export const useBudgetStore = defineStore('budget', () => {
  const transactions = ref([]);
  const currentMonth = ref(new Date().getMonth() + 1);
  const currentYear = ref(new Date().getFullYear());
  const loading = ref(false);

  const expenseCategories = [
    'Makan',
    'Transportasi',
    'Kebutuhan',
    'Jajan/Kopi',
    'Lainnya'
  ];

  const incomeCategories = [
    'Gaji',
    'Lainnya'
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Makan': '#FF6B6B',
      'Transportasi': '#4ECDC4',
      'Kebutuhan': '#45B7D1',
      'Jajan/Kopi': '#FFA07A',
      'Lainnya': '#95E1D3',
      'Gaji': '#4CAF50',
    };
    return colors[category] || '#9E9E9E';
  };

  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  });

  const totalExpense = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  });

  const balance = computed(() => {
    return totalIncome.value - totalExpense.value;
  });

  const expensesByCategory = computed(() => {
    const categories = {};
    transactions.value
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categories[t.category]) {
          categories[t.category] = {
            total: 0,
            count: 0,
            color: getCategoryColor(t.category)
          };
        }
        categories[t.category].total += parseFloat(t.amount);
        categories[t.category].count += 1;
      });
    return categories;
  });

  const incomeByCategory = computed(() => {
    const categories = {};
    transactions.value
      .filter(t => t.type === 'income')
      .forEach(t => {
        if (!categories[t.category]) {
          categories[t.category] = {
            total: 0,
            count: 0,
            color: getCategoryColor(t.category)
          };
        }
        categories[t.category].total += parseFloat(t.amount);
        categories[t.category].count += 1;
      });
    return categories;
  });

  async function loadTransactions() {
    loading.value = true;
    try {
      if (isElectron) {
        const data = await window.electronAPI.db.getTransactionsByMonth(
          currentYear.value,
          currentMonth.value
        );
        transactions.value = data;
      } else {
        // Mock data for web development
        transactions.value = mockDb.transactions.filter(t => {
          const date = new Date(t.date);
          return date.getMonth() + 1 === currentMonth.value &&
                 date.getFullYear() === currentYear.value;
        });
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      loading.value = false;
    }
  }

  async function addTransaction(transaction) {
    try {
      if (isElectron) {
        const result = await window.electronAPI.db.addTransaction(transaction);
        if (result.success) {
          await loadTransactions();
          return true;
        }
        return false;
      } else {
        // Mock implementation
        const newTransaction = {
          ...transaction,
          id: mockDb.nextId++,
          created_at: new Date().toISOString()
        };
        mockDb.transactions.push(newTransaction);
        await loadTransactions();
        return true;
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      return false;
    }
  }

  async function deleteTransaction(id) {
    try {
      if (isElectron) {
        const result = await window.electronAPI.db.deleteTransaction(id);
        if (result.success) {
          await loadTransactions();
          return true;
        }
        return false;
      } else {
        // Mock implementation
        const index = mockDb.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
          mockDb.transactions.splice(index, 1);
          await loadTransactions();
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }

  async function updateTransaction(id, transaction) {
    try {
      if (isElectron) {
        const result = await window.electronAPI.db.updateTransaction(id, transaction);
        if (result.success) {
          await loadTransactions();
          return true;
        }
        return false;
      } else {
        // Mock implementation
        const index = mockDb.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
          mockDb.transactions[index] = { ...mockDb.transactions[index], ...transaction };
          await loadTransactions();
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
  }

  function setMonth(month, year) {
    currentMonth.value = month;
    currentYear.value = year;
    loadTransactions();
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  function getMonthName(month) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1];
  }

  return {
    transactions,
    currentMonth,
    currentYear,
    loading,
    expenseCategories,
    incomeCategories,
    totalIncome,
    totalExpense,
    balance,
    expensesByCategory,
    incomeByCategory,
    loadTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    setMonth,
    formatCurrency,
    formatDate,
    getMonthName,
    getCategoryColor
  };
});