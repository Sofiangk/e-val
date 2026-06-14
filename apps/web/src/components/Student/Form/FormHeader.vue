<template>
  <div
    class="w-full flex lg:flex-row flex-col justify-between lg:items-center items-start my-4 lg:mt-8 gap-4 border-b pb-4 border-lightPurple"
  >
    <div
      class="lg:w-3/5 w-full flex justify-start items-start lg:items-center gap-2"
    >
      <!-- Course Name -->
      <label for="" class="text-xl font-normal text-darkGray">Course:</label>
      <p class="text-xl font-semibold text-mainBlack truncate">
        {{ courseName }}
      </p>
    </div>

    <!-- Instructor Name -->
    <div
      class="lg:w-2/5 w-full flex justify-start items-start lg:items-center gap-2"
    >
      <label for="" class="text-xl font-normal text-darkGray"
        >Instructor:</label
      >
      <p class="text-xl font-semibold text-mainBlack truncate">
        {{ instructorName }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  courseName: String,
  instructorName: String,
});
</script>
