// stores/EvalStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from './AuthStore';

export const useEvalStore = defineStore('eval', {
  state: () => ({
    isEvaluated: false,
    evaluation: [], // This will store the sections and questions data
    selectedValues: {}, // This will store selected values for questions
  }),

  actions: {
    async fetchSections() {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      const authStore = useAuthStore();
      try {
        const response = await axios.get(apiUrl + 'question-sections', {
          headers: {
            Authorization: `Bearer ${authStore.user.token}`,
          },
        });
        this.evaluation = response.data;
        this.initializeSelectedValues();
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    },

    initializeSelectedValues() {
      this.selectedValues = this.evaluation.reduce((acc, section) => {
        section.questions.forEach((question) => {
          acc[question.id] = '';
        });
        return acc;
      }, {});
    },

    updateSelectedValue(questionId, value) {
      this.selectedValues[questionId] = value;
    },

    async submitEvaluation(courseId) {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      const authStore = useAuthStore();
      const toast = useToast();
      const formData = new FormData();

      formData.append('course_id', courseId);
      Object.keys(this.selectedValues).forEach((questionId, index) => {
        formData.append(`responses[${index}][question_id]`, questionId);
        formData.append(
          `responses[${index}][selected_value]`,
          this.selectedValues[questionId]
        );
      });

      try {
        await axios.post(apiUrl + 'student/evaluate-course', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authStore.user.token}`,
          },
        });
        toast.success('Evaluation submitted successfully!');
        this.isEvaluated = true;
      } catch (error) {
        console.error('Error submitting evaluation:', error);
        toast.error('There was an error submitting your evaluation.');
      }
    },
  },
});
