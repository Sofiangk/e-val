<template>
  <div
    class="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-80 flex justify-center items-center z-50 transition duration-200 ease-in-out"
  >
    <div
      class="bg-offWhite rounded-lg shadow-lg p-6 sm:w-2/3 md:w-1/2 min-w-40 lg:w-2/5 w-5/6"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 v-if="title" class="text-xl font-bold">{{ title }}</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="overflow-y-auto h-64">
        <general-table :objects="objects" cardTitle="" :border="border" />
      </div>
      <div v-if="showExportButton" class="w-full flex justify-center mt-4">
        <a
          :href="exportLink"
          @click="$emit('export', selectedItems)"
          class="w-full bg-mainPurple hover:bg-darkPurple text-white px-4 py-2 rounded-[4px] text-center transition duration-100 ease-in-out"
        >
          {{ buttonText }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits, defineProps } from 'vue';
import GeneralTable from '../../components/Admin/GeneralTable.vue';
import { useAuthStore } from '../../stores/AuthStore';
import { useToast } from 'vue-toastification';

const emit = defineEmits(['close', 'export']);

const apiUrl = import.meta.env.VITE_APP_API_URL;
const exportLink = apiUrl + 'export/evaluations';
const authStore = useAuthStore();
const toast = useToast();

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  objects: {
    type: Array,
    required: true,
  },
  border: {
    type: Boolean,
    default: true,
  },
  showExportButton: {
    type: Boolean,
    default: false,
  },
  checkboxText: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: 'Export',
  },
});

const selectedItems = ref([]);
</script>

<style scoped></style>
