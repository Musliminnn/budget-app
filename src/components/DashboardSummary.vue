<template>
  <div class="dashboard-summary space-y-6">
    <!-- Balance Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Income Card -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-green-100 text-sm font-semibold">Pemasukan</span>
          <span class="text-3xl">💰</span>
        </div>
        <div class="text-3xl font-bold">
          {{ store.formatCurrency(store.totalIncome) }}
        </div>
        <div class="mt-2 text-green-100 text-sm">
          {{ incomeCount }} transaksi
        </div>
      </div>

      <!-- Expense Card -->
      <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-red-100 text-sm font-semibold">Pengeluaran</span>
          <span class="text-3xl">💸</span>
        </div>
        <div class="text-3xl font-bold">
          {{ store.formatCurrency(store.totalExpense) }}
        </div>
        <div class="mt-2 text-red-100 text-sm">
          {{ expenseCount }} transaksi
        </div>
      </div>

      <!-- Balance Card -->
      <div
        :class="[
          'rounded-2xl shadow-lg p-6 text-white',
          store.balance >= 0
            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
            : 'bg-gradient-to-br from-orange-500 to-orange-600'
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-white/90 text-sm font-semibold">Saldo</span>
          <span class="text-3xl">{{ store.balance >= 0 ? '✨' : '⚠️' }}</span>
        </div>
        <div class="text-3xl font-bold">
          {{ store.formatCurrency(Math.abs(store.balance)) }}
        </div>
        <div class="mt-2 text-white/90 text-sm">
          {{ store.balance >= 0 ? 'Surplus' : 'Defisit' }}
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Expense Categories Chart -->
      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Pengeluaran per Kategori</h3>
        <div v-if="Object.keys(store.expensesByCategory).length > 0" class="space-y-3">
          <div
            v-for="(data, category) in store.expensesByCategory"
            :key="category"
            class="flex items-center gap-3"
          >
            <div class="flex-1">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold text-gray-700">{{ category }}</span>
                <span class="text-sm font-bold text-gray-800">
                  {{ store.formatCurrency(data.total) }}
                </span>
              </div>
              <div class="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="absolute h-full rounded-full transition-all duration-500"
                  :style="{
                    width: `${(data.total / store.totalExpense) * 100}%`,
                    backgroundColor: data.color
                  }"
                ></div>
              </div>
              <div class="flex justify-between mt-1">
                <span class="text-xs text-gray-500">{{ data.count }} transaksi</span>
                <span class="text-xs text-gray-500">
                  {{ ((data.total / store.totalExpense) * 100).toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <span class="text-4xl block mb-2">📊</span>
          Belum ada pengeluaran
        </div>
      </div>

      <!-- Income Categories Chart -->
      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Pemasukan per Kategori</h3>
        <div v-if="Object.keys(store.incomeByCategory).length > 0" class="space-y-3">
          <div
            v-for="(data, category) in store.incomeByCategory"
            :key="category"
            class="flex items-center gap-3"
          >
            <div class="flex-1">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold text-gray-700">{{ category }}</span>
                <span class="text-sm font-bold text-gray-800">
                  {{ store.formatCurrency(data.total) }}
                </span>
              </div>
              <div class="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="absolute h-full rounded-full transition-all duration-500"
                  :style="{
                    width: `${(data.total / store.totalIncome) * 100}%`,
                    backgroundColor: data.color
                  }"
                ></div>
              </div>
              <div class="flex justify-between mt-1">
                <span class="text-xs text-gray-500">{{ data.count }} transaksi</span>
                <span class="text-xs text-gray-500">
                  {{ ((data.total / store.totalIncome) * 100).toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <span class="text-4xl block mb-2">💵</span>
          Belum ada pemasukan
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow p-4 border border-gray-100">
        <div class="text-xs text-gray-500 mb-1">Total Transaksi</div>
        <div class="text-2xl font-bold text-gray-800">{{ totalTransactions }}</div>
      </div>
      <div class="bg-white rounded-xl shadow p-4 border border-gray-100">
        <div class="text-xs text-gray-500 mb-1">Rata-rata Pengeluaran</div>
        <div class="text-2xl font-bold text-gray-800">
          {{ store.formatCurrency(averageExpense) }}
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-4 border border-gray-100">
        <div class="text-xs text-gray-500 mb-1">Pengeluaran Terbesar</div>
        <div class="text-2xl font-bold text-gray-800">
          {{ store.formatCurrency(maxExpense) }}
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-4 border border-gray-100">
        <div class="text-xs text-gray-500 mb-1">Saving Rate</div>
        <div class="text-2xl font-bold text-gray-800">
          {{ savingRate }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBudgetStore } from '../stores/budgetStore';

const store = useBudgetStore();

const incomeCount = computed(() => {
  return store.transactions.filter(t => t.type === 'income').length;
});

const expenseCount = computed(() => {
  return store.transactions.filter(t => t.type === 'expense').length;
});

const totalTransactions = computed(() => {
  return store.transactions.length;
});

const averageExpense = computed(() => {
  if (expenseCount.value === 0) return 0;
  return store.totalExpense / expenseCount.value;
});

const maxExpense = computed(() => {
  const expenses = store.transactions
    .filter(t => t.type === 'expense')
    .map(t => parseFloat(t.amount));
  return expenses.length > 0 ? Math.max(...expenses) : 0;
});

const savingRate = computed(() => {
  if (store.totalIncome === 0) return 0;
  return ((store.balance / store.totalIncome) * 100).toFixed(1);
});
</script>