<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="handleCancel"
      >
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-90 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-90 translate-y-4"
        >
          <div
            v-if="show"
            class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform"
          >
            <!-- Icon Header -->
            <div class="bg-gradient-to-br from-red-500 to-red-600 px-6 pt-8 pb-6 text-center relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div class="relative">
                <div class="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
                  <span class="text-5xl">🗑️</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">
                  Hapus Transaksi?
                </h3>
                <p class="text-red-100 text-sm">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                <div class="flex items-start justify-between mb-2">
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
                  <span
                    class="text-lg font-bold"
                    :class="
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                  >
                    {{ transaction.type === 'income' ? '+' : '-' }}
                    {{ formatCurrency(transaction.amount) }}
                  </span>
                </div>
                <p v-if="transaction.description" class="text-sm text-gray-600 mb-1">
                  {{ transaction.description }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(transaction.date) }}
                </p>
              </div>

              <p class="text-center text-gray-600 mb-6">
                Yakin ingin menghapus transaksi ini?
              </p>

              <!-- Action Buttons -->
              <div class="flex gap-3">
                <button
                  @click="handleCancel"
                  class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  @click="handleConfirm"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  transaction: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['confirm', 'cancel']);

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('cancel');
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
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>