<!-- FormBody.vue -->
<template>
  <section
    v-for="section in sections"
    :key="section.id"
    class="col-span-full lg:col-span-full w-full"
  >
    <h1 class="text-2xl font-bold mb-4 lg:mb-5 text-darkPurple">
      {{ section.title }}
    </h1>
    <div
      class="w-full flex flex-col md:gap-8 gap-4"
      :class="{
        'pb-8 border-b border-lightPurple mb-4':
          section.id !== sections[sections.length - 1].id,
      }"
    >
      <div
        v-for="question in section.questions"
        :key="question.id"
        class="w-full border rounded-md bg-white flex gap-8 md:min-h-48 md:h-auto h-auto justify-between flex-col border-lightPurple p-4 lg:p-4"
      >
        <div class="w-full flex gap-4">
          <label class="hidden md:block text-xl font-normal text-darkGray">
            Q{{ question.id }}:
          </label>
          <p class="text-xl font-semibold text-mainBlack">
            {{ question.text }}
          </p>
        </div>
        <!-- Mobile View -->
        <div class="md:hidden">
          <select
            v-model="selectedValues[question.id]"
            :disabled="!isFormEnabled"
            class="w-full border border-lightPurple bg-offWhite p-4 rounded-lg focus:ring-0 focus:outline-none focus:shadow-outline"
          >
            <option disabled value="">Select an option</option>
            <option
              v-for="option in parsedOptions(question.options)"
              :value="option.value"
              :key="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
        <!-- Mid and Large Screens -->
        <div class="hidden md:block">
          <div class="grid grid-cols-5 gap-4">
            <template v-for="option in parsedOptions(question.options)">
              <input
                type="radio"
                :name="`question-${section.id}-${question.id}`"
                :id="`question-${section.id}-${question.id}-${option.value}`"
                :value="option.value"
                v-model="selectedValues[question.id]"
                class="sr-only"
                aria-hidden="true"
                :disabled="!isFormEnabled"
              />
              <label
                :for="`question-${section.id}-${question.id}-${option.value}`"
                :aria-label="option.text"
                :class="{
                  'bg-mainPurple text-white':
                    selectedValues[question.id] === option.value,
                  'bg-offWhite text-black hover:brightness-95':
                    selectedValues[question.id] !== option.value,
                  'cursor-not-allowed opacity-50': !isFormEnabled,
                }"
                class="hover:filter border-none p-4 rounded-lg cursor-pointer text-center transition-all duration-300 ease-in-out flex justify-center items-center"
              >
                {{ option.text }}
              </label>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { watch } from 'vue';
import { useEvalStore } from '../../../stores/EvalStore';

const props = defineProps({
  sections: {
    type: Array,
    required: true,
  },
  isFormEnabled: {
    type: Boolean,
    required: true,
  },
});

const evalStore = useEvalStore();
const selectedValues = ref(evalStore.selectedValues);

const parsedOptions = (optionsString) => {
  try {
    return JSON.parse(optionsString);
  } catch (error) {
    console.error('Error parsing options:', error);
    return [];
  }
};

// Watch for changes in the selectedValues and update the store
watch(
  () => selectedValues.value,
  (newValues) => {
    for (const [questionId, value] of Object.entries(newValues)) {
      evalStore.updateSelectedValue(questionId, value);
    }
  },
  { deep: true }
);
</script>
