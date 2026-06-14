<template>
  <div
    class="flex flex-col md:flex-row md:justify-between md:items-center mb-4"
  >
    <h1 class="text-2xl font-bold">My Courses</h1>
  </div>
  <div class="overflow-x-auto rounded-md border border-lightPurple font-medium">
    <table class="w-full table-auto text-left">
      <thead>
        <tr class="bg-offWhite">
          <th class="hidden p-5 text-left md:table-cell">Course Code</th>
          <th class="p-5 text-left">Course Name</th>
          <th class="p-5 text-center">Evaluated</th>
        </tr>
      </thead>
      <tbody class="bg-white bg-opacity-50">
        <tr
          v-for="(course, index) in courses"
          :key="index"
          class="border-b border-lightPurple"
          :class="{
            'border-b-0': index === courses.length - 1,
            'border-t border-lightPurple': index === 0,
          }"
        >
          <td class="hidden p-5 text-left md:table-cell">
            {{ course.course_code }}
          </td>
          <td class="p-5">{{ course.name }}</td>
          <td class="p-5 text-center">
            <input
              type="checkbox"
              v-model="course.is_evaluated"
              class="form-checkbox bg-transparent h-5 w-5 text-darkGreen focus:ring-0 rounded-sm"
              disabled
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/AuthStore';

const authStore = useAuthStore();
const courses = ref(authStore.user.registered_courses);
</script>
