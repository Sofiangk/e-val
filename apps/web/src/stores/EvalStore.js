import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { authApi } from '../api/auth';
import { studentApi } from '../api/student';

export const useEvalStore = defineStore('eval', {
  state: () => ({
    isEvaluated: false,
    evaluation: [], // sections + questions
    selectedValues: {}, // questionId -> selected value
  }),

  actions: {
    async fetchSections() {
      try {
        this.evaluation = await authApi.questionSections();
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
      const toast = useToast();
      const responses = Object.entries(this.selectedValues)
        .filter(([, value]) => value !== '' && value !== null && value !== undefined)
        .map(([questionId, value]) => ({
          question_id: Number(questionId),
          selected_value: Number(value),
        }));

      try {
        await studentApi.evaluateCourse({
          course_id: Number(courseId),
          responses,
        });
        toast.success('Evaluation submitted successfully!');
        this.isEvaluated = true;
        return true;
      } catch (error) {
        console.error('Error submitting evaluation:', error);
        toast.error(
          error.response?.data?.message || 'There was an error submitting your evaluation.',
        );
        return false;
      }
    },
  },
});
