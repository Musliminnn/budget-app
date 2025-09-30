<template>
  <div class="transaction-list bg-white rounded-2xl shadow-lg border border-gray-100">
    <!-- Header -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Riwayat Transaksi</h2>
        <div class="flex items-center gap-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium text-sm transition-all',
              activeFilter === filter.value
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="relative">
        <span class="absolute left-4 top-3 text-gray-400">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari transaksi..."
          class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
        />
      </div>
    </div>

    <!-- Transaction List -->
    <div class="p-6">
      <div v-if="filteredTransactions.length > 0" class="space-y-3">
        <div
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100 hover:border-gray-200"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span
                  class="px-3 py-1 rounded-lg text-xs font-semibold"
                  :class="
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  "
                >
                  {{ transaction.category }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ store.formatDate(transaction.date) }}
                </span>
              </div>
              <p
                v-if="transaction.description"
                class="text-sm text-gray-600 mb-2"
              >
                {{ transaction.description }}
              </p>
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="$emit('edit', transaction)"
                  class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
                <span class="text-gray-300">|</span>
                <button
                  @click="handleDelete(transaction)"
                  class="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
            <div
              class="text-right ml-4"
              :class="
                transaction.type === 'income'
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              <div class="text-xl font-bold">
                {{ transaction.type === 'income' ? '+' : '-' }}
                {{ store.formatCurrency(transaction.amount) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <span class="text-6xl block mb-4">📝</span>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">
          Belum ada transaksi
        </h3>
        <p class="text-gray-400">
          {{ searchQuery ? 'Tidak ada transaksi yang cocok dengan pencarian' : 'Mulai tambahkan transaksi pertama Anda' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBudgetStore } from '../stores/budgetStore';

const emit = defineEmits(['edit']);

const store = useBudgetStore();

const activeFilter = ref('all');
const searchQuery = ref('');

const filters = [
  { label: 'Semua', value: 'all' },
  { label: 'Pemasukan', value: 'income' },
  { label: 'Pengeluaran', value: 'expense' }
];

const filteredTransactions = computed(() => {
  let transactions = store.transactions;

  // Filter by type
  if (activeFilter.value !== 'all') {
    transactions = transactions.filter(t => t.type === activeFilter.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    transactions = transactions.filter(t => {
      return (
        t.description?.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      );
    });
  }

  return transactions;
});

async function handleDelete(transaction) {
  if (confirm(`Hapus transaksi ${transaction.category} - ${store.formatCurrency(transaction.amount)}?`)) {
    await store.deleteTransaction(transaction.id);
  }
}
</script>