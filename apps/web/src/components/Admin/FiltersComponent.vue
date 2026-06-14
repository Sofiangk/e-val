<template>
  <div
    class="flex h-24 flex-col md:flex-row justify-between items-end font-semibold text-lg"
  >
    <div
      class="w-full h-full flex-col gap-y-4 flex justify-between items-start gap-2"
    >
      <div
        class="flex gap-2 items-start w-full h-full md:w-auto justify-between"
      >
        <h1 class="md:text-2xl text-lg font-bold text-mainBlack">
          {{ modalTitle }}
        </h1>
        <div
          id="search"
          class="w-2/3 h-full flex md:hidden items-center bg-transparent min-w-1/2 border border-lightPurple rounded-[4px] px-4"
        >
          <input
            v-model="searchQuery"
            @input="updateSearchQuery"
            type="text"
            placeholder="Search"
            class="md:hidden bg-transparent text-mainBlack placeholder:text-slate-500 placeholder:font-normal font-medium min-w-1/2 w-full border-none focus:outline-none focus:ring-0"
          />
          <div class="pl-3 py-1 border-l border-l-mainPurple text-mainPurple">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="w-full md:w-auto flex justify-between items-center">
        <div class="flex gap-2 md:gap-4 items-center h-12">
          <button
            class="text-sm md:text-xl flex place-self-end h-12 bg-mainPurple text-white md:px-4 px-4 text-center items-center rounded-[4px] hover:bg-darkPurple transition"
            @click="selectAllDepartments"
          >
            All
          </button>
          <select
            v-model="selectedDepartment"
            @change="updateSelectedDepartment"
            class="min-h-full bg-brightGreen hover:filter hover:brightness-95 cursor-pointer text-mainOil px-4 py-2 rounded-[4px] border-none transition"
          >
            <option value="" disabled>All Department</option>
            <option
              v-for="department in departments"
              :key="department.id"
              :value="department.id"
            >
              {{ department.name }}
            </option>
          </select>
        </div>
        <button
          v-if="modalTitle !== 'Students'"
          class="md:hidden text-sm flex place-self-end h-12 bg-mainPurple text-white px-3 py-1 text-center items-center rounded-[4px] hover:bg-darkPurple transition"
          @click="openExportModal"
        >
          Export
        </button>
      </div>
    </div>
    <div
      class="w-full flex justify-end md:flex-col gap-2 items-end mt-2 md:mt-0"
    >
      <button
        v-if="modalTitle !== 'Students'"
        class="hidden md:block bg-mainPurple text-white px-4 py-2 rounded-[4px] hover:bg-darkPurple transition"
        @click="openExportModal"
      >
        Export
      </button>
      <div
        id="Search"
        class="w-full h-12 hidden md:flex items-center bg-transparent min-w-1/2 border border-lightPurple rounded-[4px] px-4"
      >
        <input
          v-model="searchQuery"
          @input="updateSearchQuery"
          type="text"
          placeholder="Search"
          class="hidden md:block bg-transparent text-mainBlack placeholder:text-slate-500 placeholder:font-normal font-medium min-w-1/2 w-full border-none focus:outline-none focus:ring-0"
        />
        <div class="pl-3 py-1 border-l border-l-mainPurple text-mainPurple">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>
    </div>
    <Modal
      v-if="showModal"
      @close="showModal = false"
      :title="modalTitle"
      :objects="objects"
      :showExportButton="true"
      @export="openExportModal"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import Modal from './Modal.vue';
import { useAuthStore } from '../../stores/AuthStore';

const authStore = useAuthStore();
const emit = defineEmits(['update:department', 'update:search']);
const title = ref('Courses');
const departments = ref([]);
const selectedDepartment = ref('');
const searchQuery = ref('');
const showModal = ref(false);

const props = defineProps({
  objects: {
    type: Array,
    required: true,
  },
  modalTitle: {
    type: String,
    required: true,
  },
});

const fetchDepartments = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/departments', {
      headers: {
        Authorization: `Bearer ${authStore.admin.token}`,
      },
    });
    departments.value = response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
};

onMounted(fetchDepartments);

const selectAllDepartments = () => {
  selectedDepartment.value = '';
  emit('update:department', selectedDepartment.value);
};

const openExportModal = () => {
  showModal.value = true;
};

const updateSelectedDepartment = () => {
  emit('update:department', selectedDepartment.value);
};

const updateSearchQuery = () => {
  emit('update:search', searchQuery.value);
};

watch(selectedDepartment, (newVal) => {
  emit('update:department', newVal);
});

watch(searchQuery, (newVal) => {
  emit('update:search', newVal);
});
</script>

<style scoped>
* {
  @apply focus:outline-none focus:ring-0 focus:ring-offset-0;
}
</style>
