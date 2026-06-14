<template>
  <div class="overflow-x-auto">
    <div class="flex flex-col justify-between items-center pb-0 bg-mainWhite">
      <div class="w-full flex justify-between items-center p-2 pb-4">
        <h1 class="text-2xl font-bold text-mainBlack">{{ cardTitle }}</h1>
      </div>
      <div id="divider" class="w-full h-px bg-lightPurple"></div>
    </div>
    <div
      class="w-full scrollbar-thumb-rounded-full scrollbar-thumb-mainPurple scrollbar-track-transparent scrollbar-thin overflow-y-auto overflow-x-clip h-64 lg:p-2 py-2 bg-mainWhite font-medium"
    >
      <div
        v-if="objects.length === 0"
        class="w-full h-full flex justify-center items-center py-4 italic text-mainPurple"
      >
        No requests available
      </div>
      <table class="table-auto text-left text-mainBlack">
        <tbody class="bg-mainWhite truncate">
          <tr v-for="(object, index) in objects" :key="index" class="truncate">
            <td class="pr-5 py-2 text-left md:table-cell">
              {{ object.student_id }}
            </td>
            <td class="w-full md:px-5 px-2 py-3 truncate">
              {{ object.name }}
            </td>
            <td class="md:table-cell py-2 truncate">
              <div class="flex gap-2">
                <span
                  @click="$emit('accept', index)"
                  class="md:px-3 md:py-1 p-1 rounded-sm bg-darkGreen text-white hover:filter hover:brightness-90 cursor-pointer transition duration-200 ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="3"
                    stroke="currentColor"
                    class="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </span>
                <span
                  @click="$emit('reject', index)"
                  class="md:px-3 md:py-1 p-1 rounded-sm bg-mainRed text-white hover:filter hover:brightness-90 cursor-pointer transition duration-200 ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="3"
                    stroke="currentColor"
                    class="w-4 h-4 md:w-6 md:h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  objects: {
    type: Array,
    required: true,
  },
  cardTitle: {
    type: String,
    required: true,
  },
  tagName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['accept', 'reject']);
</script>
