<template>
  <div class="overflow-x-auto">
    <!-- Card header -->
    <div
      v-if="cardTitle !== ''"
      class="flex flex-col justify-between items-center pb-0 bg-offWhite"
    >
      <div class="w-full flex justify-between items-center p-2 pb-4">
        <h1 class="text-2xl font-bold text-mainBlack">{{ cardTitle }}</h1>
        <router-link
          :to="route"
          class="text-darkPurple font-semibold hover:text-mainPurple transition-all duration-200 ease-in-out"
        >
          <p class="hidden md:block">{{ routeName }}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 md:hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </router-link>
      </div>
      <div id="divider" class="w-full h-px bg-lightPurple"></div>
    </div>
    <div
      class="w-full scrollbar-thumb-rounded-full scrollbar-thumb-mainPurple scrollbar-track-transparent scrollbar-thin overflow-y-auto overflow-x-clip h-64 lg:p-2 py-2 bg-offWhite font-medium"
    >
      <div
        v-if="objects.length === 0"
        class="w-full h-full flex justify-center py-4 italic text-mainPurple transform pt-24"
      >
        No data available
      </div>
      <table class="table-auto text-left text-mainBlack">
        <tbody class="bg-offWhite truncate">
          <tr
            v-for="(object, index) in objects"
            :key="index"
            class="truncate"
            :class="{
              'border-b border-lightPurple': border,
            }"
          >
            <td class="py-3 text-left md:table-cell">
              {{ object.student_id ? object.student_id : object.course_code }}
            </td>
            <td class="w-full lg:px-5 px-2 py-3 truncate">
              {{ object.name }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  objects: {
    type: Array,
    required: true,
    default: () => [],
  },
  cardTitle: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: false,
  },
  routeName: {
    type: String,
    required: false,
  },
  border: {
    type: Boolean,
    default: false,
  },
});
</script>
