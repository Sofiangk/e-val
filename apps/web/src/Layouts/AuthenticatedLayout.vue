<template>
  <div class="antialiased bg-mainWhite">
    <nav
      class="bg-white border-b border-mainPurple md:px-8 px-2 py-5 max-h-24 fixed left-0 right-0 top-0 z-50"
    >
      <div class="flex flex-wrap justify-between items-center">
        <div class="flex justify-start items-center">
          <button
            data-drawer-target="drawer-navigation"
            data-drawer-toggle="drawer-navigation"
            aria-controls="drawer-navigation"
            class="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-mainBlack hover:bg-mainWhite focus:bg-mainWhite focus:ring-2 focus:ring-mainWhite"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <svg
              aria-hidden="true"
              class="hidden w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <a
            href="/dashboard"
            class="hidden md:flex items-center justify-between ml-1"
          >
            <img src="/e-val-logo/main-logo2.svg" class="mr-3 h-8" alt="Logo" />
          </a>
          <a
            href="/dashboard"
            class="md:hidden flex items-center justify-between ml-1"
          >
            <img
              src="/e-val-logo/logo-icon3.svg"
              class="mr-3 h-10"
              alt="Logo"
            />
          </a>
        </div>
        <div class="flex items-center md:order-2">
          <button
            type="button"
            class="capitalize flex mx-3 rounded-full md:mr-0 items-center justify-center text-mainBlack gap-2 font-medium p-2.5 text-lg"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="dropdown"
          >
            <p>{{ userName }}</p>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              class="size-6 w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
          <!-- Dropdown menu -->
          <div
            class="hidden z-50 my-4 w-56 text-base list-none bg-white divide-y divide-mainWhite shadow rounded-xl"
            id="dropdown"
          >
            <div class="py-3 px-4">
              <!-- <span class="block text-sm font-semibold text-mainBlack">{{
                userName
              }}</span> -->
              <span class="block text-sm font-semibold text-mainBlack">
                {{
                  authStore.role === 'student'
                    ? authStore.user.email
                    : authStore.admin.email
                }}
              </span>
            </div>
            <ul class="p-1 text-gray-700" aria-labelledby="dropdown">
              <li>
                <a
                  @click="logout"
                  href="#"
                  class="rounded-lg block py-2 px-4 text-sm hover:bg-mainWhite"
                  >Sign out</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside
      class="fixed top-0 left-0 z-40 lg:w-56 md:40 h-screen pt-16 transition-transform -translate-x-full bg-white border-r border-mainPurple md:translate-x-0"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div class="flex flex-col h-full overflow-y-auto py-5 px-3 bg-white">
        <!-- Student Sidebar -->
        <ul
          v-if="authStore.role === 'student'"
          class="pt-5 flex flex-col gap-1 flex-grow"
        >
          <li>
            <router-link
              to="/dashboard"
              class="flex items-center w-full p-3 px-6 text-base font-medium text-darkGray transition duration-75 hover:bg-mainWhite rounded-md group"
            >
              <svg
                aria-hidden="true"
                class="flex-shrink-0 w-6 h-6 transition duration-75"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1m-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1"
                />
              </svg>
              <span class="ml-3">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/evaluation"
              class="flex items-center w-full p-3 px-6 text-base font-medium text-mainBlack transition duration-75 hover:bg-mainWhite rounded-md group"
            >
              <svg
                aria-hidden="true"
                class="flex-shrink-0 w-6 h-6 transition duration-75"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path
                  fill-rule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="ml-3">Evaluation</span>
            </router-link>
          </li>
        </ul>
        <!-- Admin Sidebar -->
        <ul
          v-else-if="authStore.role === 'admin'"
          class="pt-5 flex flex-col gap-1 flex-grow"
        >
          <li>
            <router-link
              to="/admin/dashboard"
              class="flex items-center w-full p-3 px-6 text-base font-medium text-darkGray transition duration-75 hover:bg-mainWhite rounded-md group"
            >
              <svg
                aria-hidden="true"
                class="flex-shrink-0 w-6 h-6 transition duration-75"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1m-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1"
                />
              </svg>
              <span class="ml-3">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/courses"
              class="flex items-center w-full p-3 px-6 text-base font-medium text-mainBlack transition duration-75 hover:bg-mainWhite rounded-md group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.13em"
                height="1em"
                class="flex-shrink-0 w-6 h-6 transition duration -75"
                viewBox="0 0 18 16"
              >
                <path
                  fill="currentColor"
                  d="M3.5 2h-3c-.275 0-.5.225-.5.5v11c0 .275.225.5.5.5h3c.275 0 .5-.225.5-.5v-11c0-.275-.225-.5-.5-.5M3 5H1V4h2zm5.5-3h-3c-.275 0-.5.225-.5.5v11c0 .275.225.5.5.5h3c.275 0 .5-.225.5-.5v-11c0-.275-.225-.5-.5-.5M8 5H6V4h2z"
                />
                <path
                  fill="currentColor"
                  d="m11.954 2.773l-2.679 1.35a.502.502 0 0 0-.222.671l4.5 8.93a.502.502 0 0 0 .671.222l2.679-1.35a.502.502 0 0 0 .222-.671l-4.5-8.93a.502.502 0 0 0-.671-.222"
                />
                <path
                  fill="currentColor"
                  d="M14.5 13.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"
                />
              </svg>
              <span class="ml-3">Courses</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/students"
              class="flex items-center w-full p-3 px-6 text-base font-medium text-mainBlack transition duration-75 hover:bg-mainWhite rounded-md group"
            >
              <svg
                aria-hidden="true"
                class="flex-shrink-0 w-6 h-6 transition duration-75"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="ml-3">Students</span>
            </router-link>
          </li>
        </ul>

        <!-- Sidebar footer -->
      </div>
    </aside>

    <main
      class="lg:px-16 sm:px-12 px-1 md:ml-48 lg:ml-56 min-h-[calc(100vh-6rem)] h-auto pt-28 pb-8"
    >
      <router-view></router-view>
    </main>

    <footer
      class="md:px-16 sm:px-12 text-sm md:text-[1rem] px-4 md:ml-40 lg:ml-56 py-4 grid grid-cols-2 md:grid-cols-3 gap-8 mt-4 justify-center items-end md:items-center text-slate-400 h-20"
    >
      <div class="text-left md:text-center md:col-start-2">
        <p>e-val &copy; {{ new Date().getFullYear() }}</p>
      </div>

      <div
        class="flex md:flex-row flex-col items-end justify-end md:items-center md:gap-4 gap-2"
      >
        <p class="w-full inline text-right">Developed by</p>
        <a
          href="https://www.instagram.com/hashed.ly/"
          target="_blank"
          class="md:h-8 h-6w-full"
        >
          <img
            src="/icons/hashed-logo.png"
            alt="Hashed.ly Logo"
            class="md:h-8 h-6 object-scale-down"
          />
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import axios from 'axios';
import { initFlowbite } from 'flowbite';
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/AuthStore';
const authStore = useAuthStore();

const user = authStore.user;

const userName =
  authStore.role === 'student'
    ? user.name
    : authStore.admin.email.split('@')[0];

async function logout() {
  await authStore.logout();
}

onMounted(() => {
  initFlowbite();
});
</script>

<style scoped>
.exact-active,
.router-link-active {
  @apply bg-mainWhite text-mainPurple;
}
</style>
