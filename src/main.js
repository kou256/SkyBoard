import { createApp } from "vue";
import App from "./App.vue";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/dist/vuetify.min.css";

import VueKonva from "vue-konva";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyD6eclWKxjvx2FdxjJNphIm1tGIbdnS19Q",
  authDomain: "skyboard-9bf56.firebaseapp.com",
  projectId: "skyboard-9bf56",
  storageBucket: "skyboard-9bf56.appspot.com",
  messagingSenderId: "302788477305",
  appId: "1:302788477305:web:f1672abfca1e041c45efa8"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const functions = getFunctions(firebaseApp);
// connectFunctionsEmulator(functions, "localhost", 8081);

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
