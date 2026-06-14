<template>
  <div class="overflow-x-auto">
    <div
      class="w-full scroll-smooth scrollbar-thumb-rounded-full scrollbar-thumb-mainPurple scrollbar-track-transparent scrollbar-thin overflow-y-auto overflow-x-clip h-64 lg:p-2 py-2 bg-offWhite font-medium"
    >
      <div
        v-if="objects.length === 0"
        class="w-full h-full flex justify-center py-4 italic text-mainPurple transform pt-24"
      >
        No data available
      </div>
      <table class="w-full table-auto text-left text-mainBlack">
        <tbody class="bg-offWhite truncate">
          <tr
            v-for="object in objects"
            :key="object.id"
            class="truncate w-full text-left md:text-lg transition-all duration-200 ease-in-out cursor-pointer"
            :class="{
              'border-b border-x-0 border-lightPurple':
                border || object.id !== objects.length,
              'bg-lightPurple bg-opacity-80 ': selected === object.id,
              'md:hover:bg-lightPurple md:hover:bg-opacity-30':
                selected !== object.id,
            }"
            @click="handleClick(object)"
          >
            <td class="p-3 text-left rounded-l-md">
              {{ object.student_id ? object.student_id : object.course_code }}
            </td>
            <td class="w-full md:px-5 px-2 py-3 truncate rounded-r-md">
              {{
                object.name.value === ''
                  ? object.email.split('@')[0].replace('.', ' ')
                  : object.name
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps({
  objects: {
    type: Array,
    required: true,
  },
  border: {
    type: Boolean,
    default: false,
  },
});

const studentName = ref(''); // Reactive variable for student name

const emit = defineEmits(['object-selected']);
const selected = ref(null);

const handleClick = (object) => {
  selected.value = object.id; // Store the selected object's ID
  emit('object-selected', object); // Emit the selected object
};
</script>
