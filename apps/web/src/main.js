// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "flowbite";
import "flowbite/dist/flowbite.css";
import piniaPersist from "pinia-plugin-persistedstate";
import { initFlowbite } from "flowbite";

import App from "./App.vue";
import "./index.css";
import router from "./routes";
import { useAuthStore } from "./stores/AuthStore";
import { bindAuthStore } from "./api/client";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
pinia.use(piniaPersist);
app.use(pinia);

// Give the API client access to tokens (and refresh/logout) without a
// circular import.
bindAuthStore(useAuthStore(pinia));
app.use(Toast, {
  transition: "Vue-Toastification__fade",
  maxToasts: 5,
  newestOnTop: true,
});
app.mount("#app");
