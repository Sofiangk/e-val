<template>
  <div class="w-full h-full rounded-lg p-4 sm:px-8">
    <div class="flex flex-col justify-between h-full gap-2 text-left">
      <p class="text-lg font-semibold text-mainBlack sm:text-xl">
        {{ title }}
      </p>
      <div class="flex items-end justify-between">
        <p
          class="lg:text-3xl text-2xl font-semibold text-mainBlack sm:text-4xl"
        >
          {{ value }}
        </p>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  title: String,
  value: Number,
});
</script>
