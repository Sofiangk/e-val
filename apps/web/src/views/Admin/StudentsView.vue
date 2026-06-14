<template>
  <div
    class="px-3 md:p-0 grid gap-y-0 md:gap-y-5 lg:gap-y-6 gap-x-4 md:gap-x-5 grid-cols-4 lg:grid-cols-12 h-fit"
  >
    <div class="col-span-full my-4 lg:my-2 h-auto">
      <filters-component
        @update:department="updateDepartment"
        @update:search="updateSearch"
        :objects="students"
        :modalTitle="'Students'"
      />
    </div>
    <div
      class="col-span-full my-4 md:my-0 h-fit rounded-md bg-offWhite p-1 border border-lightPurple"
    >
      <clickable-table
        :objects="filteredStudents"
        :border="true"
        class="p-3 bg-offWhite"
        @object-selected="handleStudentSelected"
      />
    </div>
    <div class="col-span-full lg:col-span-full w-full md:pb-16">
      <object-details
        :mainLabel="'Name'"
        :mainValue="studentName"
        :secondLabel="'Email'"
        :secondValue="studentEmail"
        :thirdLabel="'Student ID'"
        :thirdValue="studentId.toString()"
        :fourthLabel="'Semester'"
        :fourthValue="studentSemester.toString()"
        :cards="studentStatsCards"
        @card-selected="openModal"
      />
    </div>

    <Modal
      v-if="showModal"
      @close="showModal = false"
      :title="'Enrolled Courses'"
      :objects="courses"
    >
    </Modal>
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

// Reactive variable for selected department and search query
const selectedDepartment = ref('');
const searchQuery = ref('');

// Reactive variable for the selected student and modal visibility
const selectedStudent = ref(null);
const showModal = ref(false);

// Reactive variables for student details
const studentName = ref('No Student Selected');
const studentEmail = ref('N/A');
const studentId = ref('N/A');
const studentSemester = ref('N/A');
const studentDepartment = ref('N/A');
const enrolledCourses = ref(0);
const evaluated = ref(0);
const remaining = ref(0);

const students = ref([]);

const studentStatsCards = computed(() => [
  {
    id: 1,
    title: 'Enrolled Courses',
    value: enrolledCourses.value,
  },
  {
    id: 2,
    title: 'Evaluated',
    value: evaluated.value,
  },
  {
    id: 3,
    title: 'Remaining',
    value: remaining.value,
  },
]);

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
  } catch (error) {
    console.error(error);
  }
}

// Computed property to filter students based on selected department and search query
const filteredStudents = computed(() => {
  return students.value.filter(
    (student) =>
      (!selectedDepartment.value ||
        student.department_id === selectedDepartment.value) &&
      (!searchQuery.value ||
        student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        student.id.toString().includes(searchQuery.value))
  );
});

// Function to update the selected department
const updateDepartment = (department) => {
  selectedDepartment.value = department;
};

// Function to update the search query
const updateSearch = (query) => {
  searchQuery.value = query;
};

// Function to handle student selection
const handleStudentSelected = (student) => {
  selectedStudent.value = student;
  updateStudentInfo(student);
};

// Function to update student info based on selected student
function updateStudentInfo(student) {
  if (student) {
    studentName.value = student.name || 'No Student Selected';
    studentEmail.value = student.email || 'N/A';
    studentId.value = student.id || 'N/A';
    studentSemester.value = student.semester || 'N/A';
    studentDepartment.value = student.department || 'N/A';
    enrolledCourses.value = student.registered_courses.length || 0;
    evaluated.value =
      student.registered_courses.filter((course) => course.is_evaluated)
        .length || 0;
    remaining.value = enrolledCourses.value - evaluated.value;
  } else {
    studentName.value = 'No Student Selected';
    studentEmail.value = 'N/A';
    studentId.value = 'N/A';
    studentSemester.value = 'N/A';
    studentDepartment.value = 'N/A';
    enrolledCourses.value = 0;
    evaluated.value = 0;
    remaining.value = 0;
  }
}

// Function to open the modal
const openModal = () => {
  showModal.value = true;
};

onMounted(() => {
  getStudents();
});
</script>
