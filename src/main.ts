import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { useDark } from "@vueuse/core";

createApp(App).mount("#app");

useDark();
