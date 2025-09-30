<template>
  <div class="transaction-form bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">
      {{ editMode ? 'Edit Transaksi' : 'Tambah Transaksi' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Type Selection -->
      <div class="flex gap-3">
        <button
          type="button"
          @click="form.type = 'income'"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200',
            form.type === 'income'
              ? 'bg-green-500 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          <span class="text-xl mr-2">💰</span> Pemasukan
        </button>
        <button
          type="button"
          @click="form.type = 'expense'"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200',
            form.type === 'expense'
              ? 'bg-red-500 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          <span class="text-xl mr-2">💸</span> Pengeluaran
        </button>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Jumlah <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-3.5 text-gray-500 font-semibold">Rp</span>
          <input
            v-model.number="form.amount"
            type="number"
            required
            min="0"
            step="1000"
            class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            placeholder="0"
          />
        </div>
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Kategori <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="category in availableCategories"
            :key="category"
            type="button"
            @click="form.category = category"
            :class="[
              'py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-sm',
              form.category === category
                ? 'bg-blue-500 text-white shadow-md scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Deskripsi <span class="text-gray-400 font-normal">(Opsional)</span>
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
          placeholder="Contoh: Makan siang di restoran..."
        ></textarea>
      </div>

      <!-- Date -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Tanggal <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.date"
          type="date"
          required
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <button
          v-if="editMode"
          type="button"
          @click="handleCancel"
          class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="!isFormValid"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-semibold transition-all',
            isFormValid
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          {{ editMode ? 'Update' : 'Simpan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useBudgetStore } from '../stores/budgetStore';

const props = defineProps({
  editTransaction: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['saved', 'cancelled']);

const store = useBudgetStore();

const editMode = computed(() => props.editTransaction !== null);

const form = ref({
  type: 'expense',
  amount: '',
  description: '',
  category: '',
  date: new Date().toISOString().split('T')[0]
});

const availableCategories = computed(() => {
  return form.value.type === 'expense'
    ? store.expenseCategories
    : store.incomeCategories;
});

const isFormValid = computed(() => {
  return form.value.amount > 0 && form.value.category && form.value.date;
});

// Watch for edit transaction changes
watch(() => props.editTransaction, (newVal) => {
  if (newVal) {
    form.value = {
      type: newVal.type,
      amount: newVal.amount,
      description: newVal.description || '',
      category: newVal.category,
      date: newVal.date
    };
  } else {
    resetForm();
  }
}, { immediate: true });

// Watch type changes to reset category
watch(() => form.value.type, () => {
  form.value.category = '';
});

async function handleSubmit() {
  if (!isFormValid.value) return;

  const success = editMode.value
    ? await store.updateTransaction(props.editTransaction.id, form.value)
    : await store.addTransaction(form.value);

  if (success) {
    emit('saved');
    if (!editMode.value) {
      resetForm();
    }
  }
}

function handleCancel() {
  emit('cancelled');
  resetForm();
}

function resetForm() {
  form.value = {
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  };
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>