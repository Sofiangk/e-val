<template>
  <main
    class="grid sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 min-h-screen lg:bg-mainWhite bg-mainWhite"
  >
    <div
      class="mx-auto min-h-2/3 py-12 px-10 w-full col-span-full lg:col-span-4 lg:col-start-5 h-fit col-start-2 rounded-lg sm:col-span-4 sm:col-start-2 md:col-span-4 md:col-start-3 lg:bg-white lg:border border-darkPurple lg:shadow-md shadow-darkPurple z-10 place-self-center"
    >
      <div class="flex items-center justify-center mx-auto mb-4">
        <img
          class="mx-auto mt-6 w-40 h-12 my-auto"
          src="/e-val-logo/main-logo2.svg"
          alt=""
        />
      </div>
      <p
        class="mx-auto w-fit text-2xl text-center my-8 font-semibold text-mainBlack"
      >
        Welcome to the <br />
        E-Valuation System!
      </p>
      <form @submit.prevent="signup" class="w-full">
        <div class="flex flex-col md:flex-row gap-2 mb-4">
          <div class="flex flex-col gap-2 mb-4 md:mb-0 md:w-3/4">
            <label for="email" class="block text-sm font-normal text-mainBlack"
              >Email</label
            >
            <input
              v-model="authStore.user.email"
              id="email"
              type="email"
              placeholder="yourname_id@limu.edu.ly"
              class="block w-full rounded-md border border-darkPurple h-12 bg-white text-sm font-normal p-4"
              required
            />
          </div>
          <div class="flex flex-col gap-2 mb-4 md:mb-0 md:w-1/4">
            <label
              for="studentId"
              class="block text-sm font-normal text-mainBlack"
              >Student ID</label
            >
            <input
              v-model="authStore.user.student_id"
              type="number"
              id="studentId"
              placeholder="1234"
              class="block w-full rounded-md border border-darkPurple h-12 bg-white text-sm font-normal p-4 appearance:textfield [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="1000"
              max="9999"
              required
              @input="validateStudentId"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label
            for="student-name"
            class="block text-sm font-normal text-mainBlack"
            >Name</label
          >
          <input
            v-model="authStore.user.name"
            type="text"
            id="student-name"
            placeholder="Your Name"
            class="block w-full rounded-md border border-darkPurple h-12 bg-white text-sm font-normal p-4 appearance:textfield [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label for="password" class="block text-sm font-normal text-mainBlack"
            >Password</label
          >
          <input
            v-model="authStore.user.password"
            type="password"
            id="password"
            placeholder="••••••••"
            class="block w-full rounded-md border border-darkPurple h-12 bg-white text-sm font-normal p-4"
            required
          />
        </div>
        <div class="mt-10 mb-4 pb-5">
          <input
            type="submit"
            class="block w-full bg-mainPurple hover:bg-darkPurple h-12 text-white font-medium text-lg rounded-md transition-all duration-100 ease-in-out text-center cursor-pointer"
            value="Sign up"
          />
        </div>
      </form>
      <div>
        <p class="text-center text-sm font-normal text-slate-700">
          Already have an account?
          <router-link
            to="/login"
            class="text-darkPurple font-semibold text-primary-600 hover:underline"
          >
            Login
          </router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/AuthStore';

const email = ref('');
const studentId = ref('');
const password = ref('');
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const validateStudentId = (event) => {
  const value = event.target.value;
  if (value.length > 4) {
    event.target.value = value.slice(0, 4);
    studentId.value = value.slice(0, 4);
  }
};

const signup = async () => {
  await authStore.register();
};
onMounted(() => {
  authStore.clearData();
});
</script>

<style>
body {
  background-color: #efefef;
}

.bg-circle {
  top: 50%;
}
</style>
