import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../routes';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useAuthStore = defineStore('auth', {
  // State definition
  state: () => ({
    role: null,
    user: {
      email: null,
      password: null,
      name: null,
      student_id: null,
      department_id: null,
      token: null,
      isApproved: false,
      errorMessage: null,
      isEvaluated: false,
      registered_courses: [],
      evaluated_courses: [],
      semester: null,
    },
    admin: {
      email: null,
      password: null,
      token: null,
      errorMessage: null,
    },
  }),
  // Getters for accessing state properties
  getters: {
    getUserEmail: (state) => state.user.email,
    getAdminEmail: (state) => state.admin.email,
    getUserName: (state) => state.user.name,
    getUserToken: (state) => state.user.token,
    getAdminToken: (state) => state.admin.token,
    getUserPassword: (state) => state.user.password,
    getAdminPassword: (state) => state.admin.password,
    getStudentId: (state) => state.user.student_id,
    getUserErrorMessages: (state) => state.user.errorMessage,
    getAdminErrorMessages: (state) => state.admin.errorMessage,
    getRole: (state) => state.role,
    getIsApproved: (state) => state.user.isApproved,
    getIsEvaluated: (state) => state.user.isEvaluated,
    getDepartmentId: (state) => state.user.department_id,
    // getSemester: (state) => state.user.semester,
    getRegisteredCourses: (state) => state.user.registered_courses,
    getEvaluatedCourses: (state) => state.user.evaluated_courses,
  },
  // Actions for performing asynchronous operations
  actions: {
    // Register a new user
    async register() {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      try {
        const response = await axios.post(apiUrl + 'register', {
          email: this.user.email,
          password: this.user.password,
          name: this.user.name,
          student_id: this.user.student_id,
        });

        // Update state based on the response
        this.isEvaluated = response.data.student.is_evaluated;
        this.isApproved = response.data.student.is_approved;
        this.user.evaluated_courses =
          response.data.student.evaluated_courses || [];
        this.user.registered_courses =
          response.data.student.registered_courses || [];
        this.user.department_id = response.data.student.department_id;

        console.log('Registered Courses:', this.user.registered_courses);

        // Show success message and redirect to login
        toast.success('Register Successful');
        router.push('/login');
      } catch (error) {
        // Show error message
        toast.error('Register Failed');
        console.log('Error:', error.response.data.message);
      }
    },
    // Log out the current user
    async logout() {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      try {
        const response = await axios.post(
          apiUrl + 'logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.admin.token ?? this.user.token}`,
            },
          }
        );
        console.log(response);
        this.clearData();
        router.push('/login');
      } catch (error) {
        console.log('Error', error);
        router.push('/login');
      }
    },
    async getUserData() {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      try {
        const response = await axios.get(apiUrl + 'student', {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
          },
        });
        this.isEvaluated = response.data.student.is_evaluated;
        this.isApproved = response.data.student.is_approved;
        this.user.evaluated_courses =
          response.data.student.evaluated_courses || [];
        this.user.registered_courses =
          response.data.student.registered_courses || [];
        this.user.department_id = response.data.student.department_id;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    // Clear user and admin data
    clearData() {
      this.user.email = null;
      this.user.name = null;
      this.user.password = null;
      this.user.student_id = null;
      this.user.department_id = null;
      this.user.errorMessage = null;
      this.admin.email = null;
      this.admin.password = null;
      this.admin.errorMessage = null;
      this.role = null;
      this.user.token = null;
      this.admin.token = null;
      this.user.isApproved = false;
    },
  },
  persist: true,
});
