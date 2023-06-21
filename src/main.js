import { createApp } from "vue";
import App from "./App.vue";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

import VueKonva from "vue-konva";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(vuetify);
app.use(VueKonva, { prefix: "konva" });
app.mount("#app");
