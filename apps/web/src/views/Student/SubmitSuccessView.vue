<template>
  <main
    class="grid lg:grid-cols-12 min-h-screen lg:bg-mainWhite bg-mainWhite py-20"
  >
    <div
      class="mx-auto min-h-2/3 py-12 px-10 w-full col-span-full lg:col-span-10 lg:col-start-2 h-full col-start-2 rounded-lg sm:col-span-10 sm:col-start-2 md:col-span-4 md:col-start-5 lg:bg-white lg:border border-darkPurple lg:shadow-md shadow-darkPurple z-10 place-self-center"
    >
      <div class="flex items-center justify-center mx-auto mb-4">
        <img
          class="mx-auto mt-6 w-40 lg:h-40 h-24 my-auto"
          src="/e-val-logo/logo-icon3.svg"
          alt=""
        />
      </div>
      <div class="mx-auto w-fit my-8 text-center">
        <p
          class="text-4xl lg:text-6xl text-center font-bold mb-4 text-mainPurple"
        >
          Thanks for submitting!
        </p>
        <p
          class="text-center text-2xl lg:text-4xl font-normal text-darkGray lg:leading-snug lg:tracking-wide"
        >
          you have successfully <br />
          completed the evaluation!
        </p>
      </div>
      <div class="lg:mt-12 flex items-center justify-center mt-8">
        <router-link
          to="/"
          class="bg-mainPurple hover:bg-darkPurple text-white font-medium lg:py-5 py-4 rounded focus:outline-none focus:shadow-outline transition-all duration-150 ease-in-out text-2xl w-full h-full lg:px-12 lg:text-2xl lg:w-fit block text-center"
        >
          Back to dashboard
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../../stores/AuthStore';
const authStore = useAuthStore();
onMounted(() => {
  authStore.getUserData();
});
</script>

<style></style>
