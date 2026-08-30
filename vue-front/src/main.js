import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { vMobileObserve } from "./directives/vMobileObserve";

const app = createApp(App);

// Registra a diretiva globalmente com o nome 'mobile-observe'
app.directive("mobile-observe", vMobileObserve);

app.mount("#app");
