import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/AuthStore'; // Ensure the correct path

// Auth views
import LoginView from '../views/Auth/LoginView.vue';
import RegisterView from '../views/Auth/RegisterView.vue';
import ForgotPasswordView from '../views/Auth/ForgotPasswordView.vue';
import ResetPasswordView from '../views/Auth/ResetPasswordView.vue';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout.vue';

// Student views
import StudentDashboardView from '../views/Student/DashboardView.vue';
import EvaluationView from '../views/Student/EvaluationView.vue';
import SubmitSuccessView from '../views/Student/SubmitSuccessView.vue';
import PendingView from '../views/Student/PendingView.vue';

// Admin views
import AdminDashboardView from '../views/Admin/DashboardView.vue';
import CoursesView from '../views/Admin/CoursesView.vue';
import StudentsView from '../views/Admin/StudentsView.vue';

const routes = [
  {
    // Authenticated Student routes
    path: '/',
    component: AuthenticatedLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: StudentDashboardView,
        meta: { requiresAuth: true, role: 'student' },
      },
      {
        path: 'evaluation',
        name: 'Evaluation',
        component: EvaluationView,
        meta: { requiresAuth: true, role: 'student' },
      },
      {
        path: 'pending',
        name: 'Pending',
        component: PendingView,
        meta: { requiresAuth: true, role: 'student' },
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore();
          if (authStore.getRole === 'student' && authStore.getIsApproved) {
            next('/dashboard');
          } else {
            next();
          }
        },
      },
    ],
  },
  // Authenticated Admin routes
  {
    path: '/admin',
    component: AuthenticatedLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboardView,
        meta: { requiresAuth: true, role: 'admin' },
      },
      {
        path: 'courses',
        name: 'Courses',
        component: CoursesView,
        meta: { requiresAuth: true, role: 'admin' },
      },
      {
        path: 'students',
        name: 'Students',
        component: StudentsView,
        meta: { requiresAuth: true, role: 'admin' },
      },
    ],
  },
  {
    path: '/success',
    name: 'SubmitSuccess',
    component: SubmitSuccessView,
    meta: { requiresAuth: true, role: 'student', isEvaluated: true },
  },
  // Authentication routes
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.getUserToken || !!authStore.getAdminToken;
  const role = authStore.getRole;
  const isApproved = authStore.getIsApproved;
  const isEvaluated = authStore.getIsEvaluated;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login');
    } else if (to.matched.some((record) => record.meta.role === 'admin')) {
      if (role === 'admin') {
        next();
      } else {
        next('/login');
      }
    } else if (to.matched.some((record) => record.meta.role === 'student')) {
      if (role === 'student') {
        if (!isApproved && to.path !== '/pending') {
          next('/pending');
        } else {
          next();
        }
      } else {
        next('/login');
      }
    } else {
      next();
    }
  } else {
    if (isAuthenticated) {
      if (role === 'admin' && !to.path.startsWith('/admin')) {
        next('/admin/dashboard');
      } else if (role === 'student' && to.path === '/login') {
        next('/dashboard');
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

export default router;
