<template>
  <div
    class="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-80 flex justify-center items-center z-50 transition duration-200 ease-in-out"
  >
    <div
      class="bg-mainWhite border-2 border-mainPurple rounded-lg shadow-lg sm:w-2/3 md:w-1/2 min-w-40 lg:w-2/5 w-5/6 p-8"
    >
      <div class="flex flex-col justify-between items-center mb-4">
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-center text-mainBlack">
            Student Pending
          </h1>
        </header>

        <!-- Introduction Text -->
        <section class="intro mb-8 md:px-12">
          <p class="text-lg text-center text-gray-600">
            Welcome to the course evaluation system. Your status is currently
            pending.
          </p>
        </section>

        <!-- Pending Status Information -->
        <section class="pending-info">
          <div
            class="bg-offWhite border-l-4 border-mainPurple text-darkPurple p-4"
            role="alert"
          >
            <p class="font-bold">Pending Status</p>
            <p>
              Your request is currently under review. Please be patient while we
              process your request.
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
