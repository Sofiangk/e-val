<template>
  <div
    class="px-3 md:p-0 grid gap-y-0 md:gap-y-5 lg:gap-y-6 gap-x-4 md:gap-x-5 grid-cols-4 lg:grid-cols-12 h-fit"
  >
    <div class="col-span-full my-4 lg:my-2 h-auto">
      <filters-component
        @update:department="updateDepartment"
        @update:search="updateSearch"
        :objects="courses"
        :modalTitle="'Courses'"
      />
    </div>
    <div
      class="col-span-full my-4 md:my-0 h-fit rounded-md bg-offWhite p-1 border border-lightPurple"
    >
      <clickable-table
        :objects="filteredCourses"
        :border="true"
        class="p-3 bg-offWhite"
        @object-selected="handleCourseSelected"
      />
    </div>
    <div class="col-span-full lg:col-span-full w-full md:pb-16">
      <object-details
        :mainLabel="'Course'"
        :mainValue="courseName"
        :secondLabel="'Instructor'"
        :secondValue="instructorName"
        :thirdLabel="' Code'"
        :thirdValue="courseCode"
        :fourthLabel="'Credits'"
        :fourthValue="courseCredits.toString()"
        :cards="courseStatsCards"
        @card-selected="openModal"
      />
    </div>

    <Modal
      v-if="showModal"
      @close="showModal = false"
      :title="'Enrolled Students'"
      :objects="students"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import FiltersComponent from '../../components/Admin/FiltersComponent.vue';
import ClickableTable from '../../components/Admin/ClickableTable.vue';
import ObjectDetails from '../../components/Admin/ObjectDetails.vue';
import Modal from '../../components/Admin/Modal.vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/AuthStore';
import { useToast } from 'vue-toastification';

const toast = useToast();
const apiUrl = import.meta.env.VITE_APP_API_URL;

const authStore = useAuthStore();
const selectedDepartment = ref('');
const searchQuery = ref('');
const selectedCourse = ref(null);
const showModal = ref(false);

const courses = ref([]);
const courseName = ref('No Course Selected');
const instructorName = ref('N/A');
const courseCode = ref('N/A');
const courseCredits = ref('N/A');
const courseEnrolledStudents = ref(0);
const courseEvaluated = ref(0);
const courseRemaining = ref(0);

const fetchCourses = async () => {
  try {
    const response = await axios.get(apiUrl + 'courses', {
      headers: {
        Authorization: `Bearer ${authStore.admin.token}`,
      },
    });
    courses.value = response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};
onMounted(fetchCourses);

const filteredCourses = computed(() => {
  return courses.value.filter(
    (course) =>
      (!selectedDepartment.value ||
        course.department_id === selectedDepartment.value) &&
      (!searchQuery.value ||
        course.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        course.course_code
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()))
  );
});

const updateDepartment = (department) => {
  selectedDepartment.value = department;
};

const updateSearch = (query) => {
  searchQuery.value = query;
};

const handleCourseSelected = (course) => {
  selectedCourse.value = course;
  updateCourseInfo(course);
};

function updateCourseInfo(course) {
  if (course) {
    courseName.value = course.name || 'No Course Selected';
    instructorName.value = course.instructor || 'N/A';
    courseCode.value = course.course_code || 'N/A';
    courseCredits.value = course.course_credits || 'N/A';
    courseEnrolledStudents.value = course.enrolled_students;
    courseEvaluated.value = course.evaluated_students;
    courseRemaining.value =
      course.enrolled_students - course.evaluated_students;
  } else {
    courseName.value = 'No Course Selected';
    instructorName.value = 'N/A';
    courseCode.value = 'N/A';
    courseCredits.value = 'N/A';
    courseEnrolledStudents.value = 0;
    courseEvaluated.value = 0;
    courseRemaining.value = 0;
  }
}

const openModal = () => {
  showModal.value = true;
};

const exportData = async () => {
  try {
    await axios.get('http://127.0.0.1:8000/api/courses', {
      headers: {
        Authorization: `Bearer ${authStore.admin.token}`,
      },
    });
  } catch (error) {
    toast.error('Error exporting data');
  }
};

const courseStatsCards = computed(() => [
  {
    id: 1,
    title: 'Enrolled Students',
    value: courseEnrolledStudents.value,
    array: courseEnrolledStudents,
  },
  {
    id: 2,
    title: 'Evaluated',
    value: courseEvaluated.value,
    array: courseEvaluated,
  },
  {
    id: 3,
    title: 'Remaining',
    value: courseRemaining.value,
    array: courseRemaining,
  },
]);
</script>
