<template>
  <div
    class="px-3 md:p-0 grid gap-y-3 md:gap-y-8 lg:gap-y-6 gap-x-4 md:gap-x-5 grid-cols-4 lg:grid-cols-12"
  >
    <div class="col-span-2 lg:col-span-3" v-for="card in cards" :key="card.id">
      <stats-card
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :class="
          card.id % 2 == 0
            ? 'bg-brightGreen border border-darkGreen'
            : 'bg-offWhite border border-lightPurple'
        "
      >
        <!-- card 1 icon -->
        <svg
          v-if="card.id == 1"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          class="w-6 h-6 sm:w-10 sm:h-10"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            color="currentColor"
          >
            <path
              d="M6.514 2c-1.304.129-2.182.419-2.838 1.076c-1.175 1.177-1.175 3.072-1.175 6.863v4.02c0 3.79 0 5.686 1.175 6.864S6.743 22 10.526 22h2.007c3.783 0 5.675 0 6.85-1.177c1.067-1.07 1.166-2.717 1.175-5.846"
            />
            <path
              d="m10.526 7l1.003 3.5c.56 1.11 1.263 1.4 3.01 1.5c1.389-.034 2.195-.198 2.883-.796c.469-.408.681-1.023.784-1.635L18.55 7.5m2.508-2v5M8.601 4.933c1.587-1.317 3.001-2.024 5.934-2.802a1.94 1.94 0 0 1 1.009.005c2.596.714 3.998 1.348 5.876 2.758c.08.06.104.172.048.255c-.613.902-1.982 1.633-5.34 2.935a2.98 2.98 0 0 1-2.171-.012c-3.576-1.42-5.22-2.18-5.42-2.969a.17.17 0 0 1 .064-.17"
            />
          </g>
        </svg>

        <!-- card 2 icon -->
        <svg
          v-if="card.id == 2"
          viewBox="0 0 148 148"
          fill="none"
          class="w-6 h-6 sm:w-10 sm:h-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M135.667 64.7499V73.9999C135.667 103.07 135.667 117.604 126.632 126.632C117.611 135.667 103.07 135.667 74 135.667C44.9303 135.667 30.3955 135.667 21.3613 126.632C12.3333 117.611 12.3333 103.07 12.3333 73.9999C12.3333 44.9302 12.3333 30.3954 21.3613 21.3612C30.4017 12.3333 44.9303 12.3333 74 12.3333H83.25M88.3332 36.3611L104.5 52.528L135.667 21.3612"
            stroke="black"
            stroke-width="12"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- card 3 icon -->
        <svg
          v-if="card.id == 3"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          class="w-6 h-6 sm:w-10 sm:h-10"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            d="M22 10.5V12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2h1.5M22 2l-5 5m0-5l5 5"
          />
        </svg>
        <!-- card 4 icon -->
        <svg
          v-if="card.id == 4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          className="size-6"
          class="w-6 h-6 sm:w-10 sm:h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </stats-card>
    </div>

    <div class="col-span-full my-8 lg:my-5">
      <course-table />
    </div>

    <div class="mt-4 lg:mt-0 md:col-span-3 col-span-full">
      <router-link
        to="/evaluation"
        class="bg-mainPurple hover:bg-darkPurple text-white font-bold lg:py-5 py-4 rounded focus:outline-none focus:shadow-outline transition-all duration-150 ease-in-out text-2xl w-full h-full block text-center"
      >
        Start Evaluation
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import StatsCard from "../../components/Student/StatsCard.vue";
import CourseTable from "../../components/Student/CourseTable.vue";
import { useAuthStore } from "../../stores/AuthStore";

const student = ref({});

const authStore = useAuthStore();
student.value = authStore.user;
onMounted(() => {
  authStore.getUserData();
});
const cards = [
  {
    id: 1,
    title: "Total Courses",
    value: student.value.registered_courses.length,
  },
  {
    id: 2,
    title: "Evaluated",
    value: student.value.evaluated_courses.length,
  },
  {
    id: 3,
    title: "Remaining",
    value:
      student.value.registered_courses.length -
      student.value.evaluated_courses.length,
  },
  {
    id: 4,
    title: "Semester",
    value: student.value.semester,
  },
];
</script>
