<template>
  <div class="custom-date-picker">
    <div class="relative">
      <label v-if="label" class="block text-sm font-semibold text-gray-700 mb-2">
        {{ label }} <span v-if="required" class="text-red-500">*</span>
      </label>

      <button
        type="button"
        @click="togglePicker"
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-left flex items-center justify-between hover:border-gray-300"
      >
        <span class="flex items-center gap-2">
          <span class="text-xl">📅</span>
          <span class="text-gray-700">{{ formattedDate }}</span>
        </span>
        <svg
          class="w-5 h-5 text-gray-400 transition-transform"
          :class="{ 'rotate-180': showPicker }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Calendar Dropdown -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="showPicker"
          class="absolute z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-full md:w-80"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <button
              type="button"
              @click="previousMonth"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div class="text-center">
              <div class="font-bold text-gray-800">{{ monthNames[currentMonth] }}</div>
              <div class="text-sm text-gray-500">{{ currentYear }}</div>
            </div>

            <button
              type="button"
              @click="nextMonth"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Quick Actions -->
          <div class="flex gap-2 mb-4">
            <button
              type="button"
              @click="selectToday"
              class="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              Hari Ini
            </button>
            <button
              type="button"
              @click="selectYesterday"
              class="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Kemarin
            </button>
          </div>

          <!-- Days of Week -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in dayNames"
              :key="day"
              class="text-center text-xs font-semibold text-gray-500 py-2"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="day in calendarDays"
              :key="day.date"
              type="button"
              @click="selectDate(day)"
              :disabled="day.disabled"
              :class="[
                'p-2 text-sm rounded-lg transition-all relative',
                day.isToday ? 'font-bold' : '',
                day.isSelected
                  ? 'bg-blue-500 text-white shadow-md scale-105'
                  : day.isCurrentMonth
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'text-gray-300',
                day.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              ]"
            >
              <span>{{ day.day }}</span>
              <span
                v-if="day.isToday && !day.isSelected"
                class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
              ></span>
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Overlay -->
    <div
      v-if="showPicker"
      class="fixed inset-0 z-40"
      @click="showPicker = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  maxDate: {
    type: String,
    default: null
  },
  minDate: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const showPicker = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const formattedDate = computed(() => {
  if (!props.modelValue) return 'Pilih tanggal';

  const date = new Date(props.modelValue);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
});

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const prevLastDay = new Date(currentYear.value, currentMonth.value, 0);

  const firstDayOfWeek = firstDay.getDay();
  const lastDate = lastDay.getDate();
  const prevLastDate = prevLastDay.getDate();

  // Previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevLastDate - i;
    const date = new Date(currentYear.value, currentMonth.value - 1, day);
    days.push({
      day,
      date: date.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      disabled: isDateDisabled(date)
    });
  }

  // Current month days
  for (let day = 1; day <= lastDate; day++) {
    const date = new Date(currentYear.value, currentMonth.value, day);
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    days.push({
      day,
      date: dateStr,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: dateStr === props.modelValue,
      disabled: isDateDisabled(date)
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, day);
    days.push({
      day,
      date: date.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      disabled: isDateDisabled(date)
    });
  }

  return days;
});

function isDateDisabled(date) {
  if (props.maxDate) {
    const max = new Date(props.maxDate);
    if (date > max) return true;
  }
  if (props.minDate) {
    const min = new Date(props.minDate);
    if (date < min) return true;
  }
  return false;
}

function togglePicker() {
  showPicker.value = !showPicker.value;
  if (showPicker.value && props.modelValue) {
    const date = new Date(props.modelValue);
    currentMonth.value = date.getMonth();
    currentYear.value = date.getFullYear();
  }
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function selectDate(day) {
  if (day.disabled) return;
  emit('update:modelValue', day.date);
  showPicker.value = false;
}

function selectToday() {
  const today = new Date().toISOString().split('T')[0];
  emit('update:modelValue', today);
  showPicker.value = false;
}

function selectYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  emit('update:modelValue', yesterday.toISOString().split('T')[0]);
  showPicker.value = false;
}
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>