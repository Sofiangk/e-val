<template>
  <div
    class="px-3 md:p-0 grid gap-y-3 md:gap-y-8 lg:gap-y-6 gap-x-4 md:gap-x-5 grid-cols-4 lg:grid-cols-12"
  >
    <div class="col-span-2 lg:col-span-3" v-for="card in cards" :key="card.id">
      <stats-card
        :title="card.title"
        :value="card.value"
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
          viewBox="0 0 256 256"
        >
          <path
            fill="currentColor"
            d="m227.79 52.62l-96-32a11.85 11.85 0 0 0-7.58 0l-96 32A12 12 0 0 0 20 63.37a6 6 0 0 0 0 .63v80a12 12 0 0 0 24 0V80.65l23.71 7.9a67.92 67.92 0 0 0 18.42 85A100.36 100.36 0 0 0 46 209.44a12 12 0 1 0 20.1 13.11C80.37 200.59 103 188 128 188s47.63 12.59 61.95 34.55a12 12 0 1 0 20.1-13.11a100.36 100.36 0 0 0-40.18-35.92a67.92 67.92 0 0 0 18.42-85l39.5-13.17a12 12 0 0 0 0-22.76Zm-99.79-8L186.05 64L128 83.35L70 64ZM172 120a44 44 0 1 1-81.06-23.71l33.27 11.09a11.9 11.9 0 0 0 7.58 0l33.27-11.09A43.85 43.85 0 0 1 172 120"
          />
        </svg>
        <!-- card 4 icon -->
        <svg
          v-if="card.id == 4"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          class="w-6 h-6 sm:w-10 sm:h-10"
          viewBox="0 0 48 48"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="4"
          >
            <path
              d="M40 23v-9L31 4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h12m7-14l12 12m0-12L29 42"
            />
            <path d="M30 4v10h10" />
          </g>
        </svg>
      </stats-card>
    </div>

    <div class="col-span-full lg:grid grid-cols-12 gap-4">
      <div
        class="col-span-6 my-6 lg:my-4 p-4 bg-offWhite border border-lightPurple rounded-md"
      >
        <general-table
          :objects="courses"
          :cardTitle="'Courses'"
          :routeName="`View Courses (${courses.length})`"
          :route="'/admin/courses'"
        />
      </div>
      <div
        class="col-span-6 my-6 lg:my-4 p-4 bg-offWhite border border-lightPurple rounded-md"
      >
        <general-table
          :objects="students"
          :cardTitle="'Students'"
          :routeName="`View Students (${students.length})`"
          :route="'/admin/students'"
        />
      </div>
    </div>
    <div
      class="col-span-full my-6 lg:my-2 p-4 border border-lightPurple rounded-md"
    >
      <request-table
        :objects="requests"
        :cardTitle="'Student Requests'"
        :tagName="`${requests.length} Requests`"
        @accept="acceptStudent"
        @reject="rejectStudent"
      />
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, computed, ref } from 'vue';
import { useAuthStore } from '../../stores/AuthStore';
import { useToast } from 'vue-toastification';
import StatsCard from '../../components/Student/StatsCard.vue';
import GeneralTable from '../../components/Admin/GeneralTable.vue';
import RequestTable from '../../components/Admin/RequestsTable.vue';

const totalStudents = ref(0);
const evaluatedStudents = ref(0);
const remainingStudents = ref(0);

const totalCourses = ref(0);
const evaluatedCourses = ref(0);
const remainingCourses = ref(0);

const toast = useToast();
const authStore = useAuthStore();

const requests = ref([]);

const courses = ref([]);

const students = ref([]);

async function getStudents() {
  const authStore = useAuthStore();
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  try {
    const response = await axios.get(apiUrl + 'students', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authStore.admin.token,
      },
    });
    students.value = response.data.data.filter(
      (student) => student.is_approved === 1
    );
    totalStudents.value = response.data.total_students;
    evaluatedStudents.value = students.value.filter(
      (student) => student.is_evaluated === 1
    ).length;
    console.log(evaluatedStudents.value);
    remainingStudents.value = totalStudents.value - evaluatedStudents.value;
  } catch (error) {
    console.error(error);
  }
}

async function getCourses() {
  const authStore = useAuthStore();
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  try {
    const response = await axios.get(apiUrl + 'courses', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authStore.admin.token,
      },
    });
    courses.value = response.data;
    totalCourses.value = courses.value.length;
    evaluatedCourses.value = courses.value.filter(
      (course) => course.is_evaluated === 1
    ).length;
    remainingCourses.value = totalCourses.value - evaluatedCourses.value;
  } catch (error) {
    console.error(error);
  }
}

async function getRequests() {
  const authStore = useAuthStore();
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  try {
    const response = await axios.get(apiUrl + 'students/unapproved', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authStore.admin.token,
      },
    });
    requests.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function acceptStudent(index) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const token = authStore.admin?.token;

  if (!token) {
    toast.error('User is not authenticated');
    return;
  }

  try {
    const response = await axios.post(
      `${apiUrl}approve-user/${requests.value[index].id}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(
      `Accepted student with ID ${requests.value[index].student_id}`
    );
    getStudents();
    console.log(response.data);
    // Optionally, remove the accepted request from the list
    requests.value.splice(index, 1);
  } catch (error) {
    toast.error('Failed to accept student');
    console.error(error);
  }
}

async function rejectStudent(index) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const token = authStore.admin?.token;

  if (!token) {
    toast.error('User is not authenticated');
    return;
  }

  try {
    const response = await axios.delete(
      `${apiUrl}students/${requests.value[index].id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.error(`Rejected student with ID ${requests.value[index].student_id}`);
    console.log(response.data);
    // Optionally, remove the rejected request from the list
    requests.value.splice(index, 1);
  } catch (error) {
    toast.error('Failed to reject student');
    console.error(error);
  }
}

const cards = computed(() => [
  {
    id: 1,
    title: 'Total Courses',
    value: totalCourses.value,
  },
  {
    id: 2,
    title: 'Evaluated',
    value: evaluatedCourses.value,
  },
  {
    id: 3,
    title: 'Total Students',
    value: totalStudents.value,
  },
  {
    id: 4,
    title: 'Remaining',
    value: remainingStudents.value,
  },
]);

// Function to get the evaluated count for each course
function getEvaluatedCount(courseId) {
  return students.value.reduce((count, student) => {
    if (
      student.evaluated_courses &&
      student.evaluated_courses.includes(courseId)
    ) {
      count++;
    }
    return count;
  }, 0);
}

// Updating the courses evaluated_students property
courses.value.forEach((course) => {
  course.evaluated_students = getEvaluatedCount(course.id);
});

onMounted(() => {
  getRequests();
  getStudents();
  getCourses();
});
</script>
