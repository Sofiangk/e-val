<!-- EvaluationForm.vue -->
<template>
  <div
    class="px-3 md:p-0 grid gap-y-3 md:gap-y-8 lg:gap-y-6 gap-x-4 md:gap-x-5 grid-cols-4 lg:grid-cols-12"
  >
    <!-- Floating Notification -->
    <div
      v-if="showNotification && !authStore.user.isEvaluated"
      class="fixed top-1/3 left-1/2 transform -translate-x-1/2 lg:-translate-x-20 bg-brightGreen border border-darkGreen text-lightOil px-4 py-3 rounded-md shadow-md z-10 lg:text-center text-lg cursor-help"
      role="alert"
    >
      Please select a course to start the evaluation.
    </div>
    <div
      v-if="showNotification && authStore.user.isEvaluated"
      class="fixed top-1/3 left-1/2 transform -translate-x-1/2 lg:-translate-x-20 bg-brightGreen border border-darkGreen text-lightOil px-4 py-3 rounded-md shadow-md z-10 lg:text-center text-lg cursor-help"
      role="alert"
    >
      You have completed the evaluation. Thank you!
    </div>

    <!-- Select Course -->
    <div
      class="col-span-full place-self-center lg:col-span-6 lg:col-start-4 w-full"
    >
      <select
        v-model="selectedCourseId"
        @change="updateCourseInfo"
        name="course"
        id="course"
        class="mx-auto cursor-pointer w-full border border-lightPurple bg-offWhite p-4 rounded-md focus:ring-0 focus:outline-none focus:shadow-outline"
      >
        <!-- Default option when no course is selected -->
        <option value="" disabled>Select a course</option>

        <!-- Dynamic options for available courses -->
        <option
          v-for="course in registeredCourses"
          :key="course.id"
          :value="course.id"
          :disabled="course.is_evaluated"
        >
          {{ course.name }}
        </option>
      </select>
    </div>

    <!-- Form Header -->
    <FormHeader
      :courseName="courseName"
      :instructorName="instructorName"
      class="col-span-full"
    />

    <!-- Form Body -->
    <FormBody :sections="sections" :isFormEnabled="isFormEnabled" />

    <!-- Submit Button -->
    <button
      @click="submitForm"
      :disabled="!isFormEnabled"
      :class="{
        'cursor-not-allowed opacity-50': !isFormEnabled,
      }"
      class="bg-mainPurple hover:bg-darkPurple text-white font-bold lg:py-5 py-4 rounded focus:outline-none focus:shadow-outline transition-all duration-150 ease-in-out text-2xl w-full h-full block text-center mx-auto col-span-full lg:col-span-4 lg:col-start-5 mt-6 lg:mt-0"
    >
      Submit Evaluation
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/AuthStore';
import { useEvalStore } from '../../stores/EvalStore';
import FormHeader from '../../components/Student/Form/FormHeader.vue';
import FormBody from '../../components/Student/Form/FormBody.vue';

const authStore = useAuthStore();
const evalStore = useEvalStore();
const toast = useToast();
const router = useRouter();

const registeredCourses = ref([]);
const selectedCourseId = ref('');
const courseName = ref('No Course Selected');
const instructorName = ref('No Course Selected');
const showNotification = ref(true);

const isFormEnabled = computed(() => selectedCourseId.value !== '');
const sections = computed(() => evalStore.evaluation);

async function fetchRegisteredCourses() {
  try {
    registeredCourses.value = authStore.getRegisteredCourses;
  } catch (error) {
    console.error('Error fetching registered courses:', error);
  }
}

function updateCourseInfo() {
  const selectedCourse = registeredCourses.value.find(
    (course) => course.id === selectedCourseId.value
  );
  if (selectedCourse) {
    courseName.value = selectedCourse.name;
    instructorName.value = selectedCourse.instructor;
    showNotification.value = false;
  } else {
    courseName.value = 'No Course Selected';
    instructorName.value = 'No Course Selected';
    showNotification.value = true;
  }
}

function resetForm() {
  selectedCourseId.value = '';
  updateCourseInfo();
  evalStore.initializeSelectedValues();
}

async function submitForm() {
  if (!isFormEnabled.value) return;

  const allQuestionsAnswered = evalStore.evaluation.every((section) =>
    section.questions.every(
      (question) => evalStore.selectedValues[question.id] !== ''
    )
  );

  if (!allQuestionsAnswered) {
    toast.error('Please answer all questions');
    return;
  }

  try {
    await evalStore.submitEvaluation(selectedCourseId.value);
    resetForm();
    router.push('/success');
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    toast.error('There was an error submitting your evaluation.');
  }
}

onMounted(() => {
  fetchRegisteredCourses();
  evalStore.fetchSections();
});
</script>
