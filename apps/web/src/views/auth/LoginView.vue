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
        Good to see you again!
      </p>
      <form @submit.prevent="login" class="w-full">
        <div class="flex flex-col gap-2 mb-4">
          <label for="email" class="block text-sm font-normal text-mainBlack"
            >Email</label
          >
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="yourname_id@limu.edu.ly"
            class="block w-full rounded-md border border-darkPurple h-12 bg-white text-sm font-normal p-4"
            required
          />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label for="password" class="block text-sm font-normal text-mainBlack"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="••••••••"
            class="block w-full rounded-md border border-darkPurple h-12 bg-white pr-4 text-lg font-normal p-3.5"
            required
          />
        </div>
        <div class="flex items-center justify-end mb-6 pb-5">
          <!-- <div class="flex items-start">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              class="form-checkbox h-5 w-5 text-brightGreen focus:ring-0 rounded-sm ring-offset-0"
            />
            <label for="remember" class="ml-2 text-sm text-gray-500"
              >Remember me</label
            >
          </div> -->
          <router-link
            to="/forgot-password"
            class="text-sm font-medium text-primary-600 hover:underline text-darkPurple"
          >
            Forgot password?
          </router-link>
        </div>
        <div class="mb-4 pb-5">
          <input
            type="submit"
            class="block w-full bg-mainPurple hover:bg-darkPurple h-[3.375rem] text-white font-medium text-lg rounded-md transition-all duration-100 ease-in-out text-center cursor-pointer"
            value="Login"
          />
        </div>
      </form>
      <div>
        <p class="text-center text-sm font-normal text-slate-700">
          First time?
          <router-link
            to="/register"
            class="text-darkPurple font-semibold text-primary-600 hover:underline"
          >
            Register Now!
          </router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/AuthStore';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();

function login() {
  authStore.login({ email: email.value, password: password.value });
}
</script>

<style>
body {
  background-color: #efefef;
}
</style>
