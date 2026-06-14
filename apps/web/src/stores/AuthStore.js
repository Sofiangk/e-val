import { defineStore } from 'pinia';
import router from '../routes';
import { useToast } from 'vue-toastification';
import { authApi } from '../api/auth';

const emptyUser = () => ({
  id: null,
  email: null,
  name: null,
  student_id: null,
  department_id: null,
  semester: null,
  isApproved: false,
  isEvaluated: false,
  registered_courses: [],
  evaluated_courses: [],
  token: null,
});

const emptyAdmin = () => ({ id: null, email: null, token: null });

export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: null,
    accessToken: null,
    refreshToken: null,
    user: emptyUser(),
    admin: emptyAdmin(),
  }),

  getters: {
    getRole: (s) => s.role,
    getUserToken: (s) => (s.role === 'student' ? s.accessToken : null),
    getAdminToken: (s) => (s.role === 'admin' ? s.accessToken : null),
    getUserName: (s) => s.user.name,
    getUserEmail: (s) => s.user.email,
    getStudentId: (s) => s.user.student_id,
    getIsApproved: (s) => s.user.isApproved,
    getIsEvaluated: (s) => s.user.isEvaluated,
    getDepartmentId: (s) => s.user.department_id,
    getRegisteredCourses: (s) => s.user.registered_courses,
    getEvaluatedCourses: (s) => s.user.evaluated_courses,
  },

  actions: {
    applySession(data) {
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.role = data.role;
      if (data.role === 'admin') {
        this.admin.id = data.user.id;
        this.admin.email = data.user.email;
        this.admin.token = data.access_token;
      } else {
        this.user.id = data.user.id;
        this.user.email = data.user.email;
        this.user.name = data.user.name;
        this.user.student_id = data.user.student_id;
        this.user.department_id = data.user.department_id;
        this.user.semester = data.user.semester;
        this.user.isApproved = data.user.is_approved;
        this.user.token = data.access_token;
      }
    },

    async login(credentials) {
      const toast = useToast();
      try {
        const data = await authApi.login(credentials);
        this.applySession(data);
        if (data.role === 'admin') {
          toast.success('Welcome Admin');
          router.push('/admin/dashboard');
        } else {
          await this.getUserData();
          if (!this.user.isApproved) {
            toast.info('Your account is pending approval');
            router.push('/pending');
          } else {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Invalid email or password');
      }
    },

    async register(input) {
      const toast = useToast();
      try {
        await authApi.register(input);
        toast.success('Registration successful — await admin approval, then log in.');
        router.push('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    },

    async getUserData() {
      try {
        const s = await authApi.me();
        this.user.id = s.id;
        this.user.email = s.email;
        this.user.name = s.name;
        this.user.student_id = s.student_id;
        this.user.department_id = s.department_id;
        this.user.semester = s.semester;
        this.user.isApproved = s.is_approved;
        this.user.isEvaluated = s.is_evaluated;
        this.user.registered_courses = s.registered_courses || [];
        this.user.evaluated_courses = s.evaluated_courses || [];
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },

    async refreshSession() {
      const data = await authApi.refresh(this.refreshToken);
      this.applySession(data);
    },

    async logout() {
      try {
        await authApi.logout(this.refreshToken);
      } catch (error) {
        // ignore network errors on logout
      }
      this.clearData();
      router.push('/login');
    },

    forceLogout() {
      this.clearData();
      router.push('/login');
    },

    clearData() {
      this.role = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.user = emptyUser();
      this.admin = emptyAdmin();
    },
  },

  persist: {
    pick: ['role', 'accessToken', 'refreshToken', 'user', 'admin'],
  },
});
