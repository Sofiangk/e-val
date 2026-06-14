<template>
  <div
    class="w-full flex flex-col md:flex-row justify-between md:items-start items-start my-4 md:mt-6 md:gap-4 border-t md:pt-4 md:pb-12 pb-4 pt-8 border-darkPurple text-mainBlack"
  >
    <!-- Main Details -->
    <div
      class="md:w-3/4 w-full h-24 flex flex-col md:flex-row md:items-start items-start md:mt-8 gap-4"
    >
      <div
        class="w-full flex flex-col justify-start items-start md:items-center gap-6 md:gap-10"
      >
        <div
          class="w-full flex justify-start items-start md:items-center gap-2"
        >
          <!-- Main Label -->
          <label
            for=""
            class="md:min-w-32 min-w-20 md:text-lg lg:text-xl text-md font-normal text-darkGray"
            >{{ mainLabel }}:</label
          >
          <p
            class="md:text-lg lg:text-xl text-lg font-semibold text-mainBlack truncate"
          >
            {{ mainValue }}
          </p>
        </div>

        <!-- second Label -->
        <div
          class="w-full flex justify-start items-start md:items-center gap-2"
        >
          <label
            for=""
            class="md:min-w-32 min-w-20 md:text-lg lg:text-xl text-md font-normal text-darkGray"
            >{{ secondLabel }}:</label
          >
          <p
            class="md:text-lg lg:text-xl text-lg font-semibold text-mainBlack truncate"
          >
            {{ secondValue }}
          </p>
        </div>
      </div>
    </div>

    <!-- third and fourth Details -->
    <div
      class="md:w-1/4 w-full flex md:flex-col flex-row justify-between md:items-start items-start mt-2 md:mt-8 gap-4"
    >
      <div
        class="w-full flex md:flex-col flex-row justify-start items-start md:items-center gap-6 md:gap-10"
      >
        <!-- third Label -->
        <div
          class="w-full flex justify-start items-start md:items-center gap-2"
        >
          <label
            for=""
            class="md:min-w-24 min-w-16 md:text-lg lg:text-xl text-md font-normal text-darkGray"
            >{{ thirdLabel }}:</label
          >
          <p class="md:text-lg lg:text-xl text-lg font-semibold text-mainBlack">
            {{ thirdValue }}
          </p>
        </div>

        <!-- fourth Label -->
        <div
          class="w-full flex justify-start items-start md:items-center gap-2"
        >
          <label
            for=""
            class="md:min-w-24 min-w-16 md:text-lg lg:text-xl text-md font-normal text-darkGray"
            >{{ fourthLabel }}:</label
          >
          <p class="md:text-lg lg:text-xl text-lg font-semibold text-mainBlack">
            {{ fourthValue }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Cards -->
  <div class="w-full h-auto grid grid-cols-12 gap-4 md:gap-6">
    <div
      v-for="card in cards"
      :key="card.id"
      class="col-span-12 md:col-span-3"
      :class="{
        'md:col-span-6': card.id === 1,
        'md:col-span-3': card.id !== 1,
      }"
    >
      <stats-card
        :title="card.title"
        :value="card.value"
        @click="() => openModal(card.array)"
        class="bg-offWhite border w-full border-lightPurple hover:bg-lightPurple hover:bg-opacity-40 transition duration-200 ease-in-out col-span-6 cursor-pointer"
        :class="{
          ' col-span-6 w-full': card.id == 1,
          'col-span-3 w-full': card.id !== 1,
        }"
      >
        <!-- card 1 icon -->
        <svg
          v-if="card.id === 1"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          class="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            color="currentColor"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19.5 13v-3c0-3.3 0-4.95-1.025-5.975S15.8 3 12.5 3h-3C6.2 3 4.55 3 3.525 4.025S2.5 6.7 2.5 10v5c0 3.3 0 4.95 1.025 5.975S6.2 22 9.5 22H11m5-20v2m-5-2v2M6 2v2m7.5 16s1 0 2 2c0 0 3.177-5 6-6M7 15h4m-4-5h8"
              color="currentColor"
            />
          </g>
        </svg>

        <!-- card 2 icon -->
        <svg
          v-if="card.id === 2"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          class="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19.5 13v-3c0-3.3 0-4.95-1.025-5.975S15.8 3 12.5 3h-3C6.2 3 4.55 3 3.525 4.025S2.5 6.7 2.5 10v5c0 3.3 0 4.95 1.025 5.975S6.2 22 9.5 22H11m5-20v2m-5-2v2M6 2v2m7.5 16s1 0 2 2c0 0 3.177-5 6-6M7 15h4m-4-5h8"
            color="currentColor"
          />
        </svg>
        <!-- card 3 remaining icon -->
        <svg
          v-if="card.id === 3"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          class="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M16 2v2m-5-2v2M6 2v2m13.5 8.5V10c0-3.3 0-4.95-1.025-5.975S15.8 3 12.5 3h-3C6.2 3 4.55 3 3.525 4.025S2.5 6.7 2.5 10v5c0 3.3 0 4.95 1.025 5.975S6.2 22 9.5 22h2m10-7L18 18.5m0 0L14.5 22m3.5-3.5l3.5 3.5M18 18.5L14.5 15M7 15h4m-4-5h8"
            color="currentColor"
          />
        </svg>
      </stats-card>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import StatsCard from '../Student/StatsCard.vue';

const props = defineProps({
  mainLabel: String,
  mainValue: String,
  secondLabel: String,
  secondValue: String,
  thirdLabel: String,
  thirdValue: String,
  fourthLabel: String,
  fourthValue: String,
  cards: Array,
});

const emit = defineEmits(['card-selected']);

/**
 * Emits the card-selected event with the card ID.
 * @param {number} cardId - The ID of the selected card.
 */
const openModal = (cardId) => {
  emit('card-selected', cardId);
};
</script>
