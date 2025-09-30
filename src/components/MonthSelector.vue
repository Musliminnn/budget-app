<template>
  <div class="month-selector bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
    <div class="flex items-center justify-between gap-4">
      <button
        @click="previousMonth"
        class="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all text-gray-700 hover:scale-105"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="flex-1 text-center">
        <div class="text-2xl font-bold text-gray-800">
          {{ store.getMonthName(store.currentMonth) }} {{ store.currentYear }}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          {{ isCurrentMonth ? 'Bulan ini' : '' }}
        </div>
      </div>

      <button
        @click="nextMonth"
        :disabled="isCurrentMonth"
        :class="[
          'p-3 rounded-xl transition-all',
          isCurrentMonth
            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <button
        v-if="!isCurrentMonth"
        @click="goToCurrentMonth"
        class="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-md"
      >
        Bulan Ini
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBudgetStore } from '../stores/budgetStore';

const store = useBudgetStore();

const isCurrentMonth = computed(() => {
  const now = new Date();
  return (
    store.currentMonth === now.getMonth() + 1 &&
    store.currentYear === now.getFullYear()
  );
});

function previousMonth() {
  let month = store.currentMonth - 1;
  let year = store.currentYear;

  if (month < 1) {
    month = 12;
    year--;
  }

  store.setMonth(month, year);
}

function nextMonth() {
  if (isCurrentMonth.value) return;

  let month = store.currentMonth + 1;
  let year = store.currentYear;

  if (month > 12) {
    month = 1;
    year++;
  }

  store.setMonth(month, year);
}

function goToCurrentMonth() {
  const now = new Date();
  store.setMonth(now.getMonth() + 1, now.getFullYear());
}
</script>