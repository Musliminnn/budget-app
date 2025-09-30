<script setup>
import { ref, onMounted } from 'vue';
import { useBudgetStore } from './stores/budgetStore';
import MonthSelector from './components/MonthSelector.vue';
import DashboardSummary from './components/DashboardSummary.vue';
import TransactionForm from './components/TransactionForm.vue';
import TransactionList from './components/TransactionList.vue';

const store = useBudgetStore();
const editTransaction = ref(null);
const showForm = ref(false);

onMounted(() => {
  store.loadTransactions();
});

function handleEdit(transaction) {
  editTransaction.value = transaction;
  showForm.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleSaved() {
  editTransaction.value = null;
  showForm.value = false;
}

function handleCancelled() {
  editTransaction.value = null;
  showForm.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">💰 Budget App</h1>
            <p class="text-blue-100">Kelola keuangan Anda dengan mudah dan cerdas</p>
          </div>
          <button
            @click="showForm = !showForm"
            class="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            {{ showForm ? '📊 Lihat Dashboard' : '➕ Tambah Transaksi' }}
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <!-- Month Selector -->
      <div class="mb-6">
        <MonthSelector />
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Transaction Form (Toggle) -->
        <div v-if="showForm" class="mb-6 animate-fadeIn">
          <TransactionForm
            :edit-transaction="editTransaction"
            @saved="handleSaved"
            @cancelled="handleCancelled"
          />
        </div>

        <!-- Dashboard Summary -->
        <div v-else class="mb-6 animate-fadeIn">
          <DashboardSummary />
        </div>

        <!-- Transaction List -->
        <div class="animate-fadeIn">
          <TransactionList @edit="handleEdit" />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>