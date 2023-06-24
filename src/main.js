import { createApp } from "vue";
import App from "./App.vue";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/dist/vuetify.min.css";

import VueKonva from "vue-konva";

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VContainer: {
      color: "black",
    },
  },
});

const app = createApp(App);
app.use(vuetify);
app.use(VueKonva, { prefix: "konva" });
app.mount("#app");
