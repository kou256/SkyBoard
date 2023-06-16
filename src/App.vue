<script setup>
import PublisherVideo from "./components/PublisherVideo.vue";
import { nowInSec, SkyWayAuthToken, uuidV4 } from "@skyway-sdk/room";
import { onMounted, provide } from "vue";
const skyWayToken = new SkyWayAuthToken({
  jti: uuidV4(),
  iat: nowInSec(),
  exp: nowInSec() + 60 * 60 * 24,
  scope: {
    app: {
      id: import.meta.env.VITE_SKYWAY_APP_ID,
      turn: true,
      actions: ["read"],
      channels: [
        {
          id: "*",
          name: "*",
          actions: ["write"],
          members: [
            {
              id: "*",
              name: "*",
              actions: ["write"],
              publication: {
                actions: ["write"],
              },
              subscription: {
                actions: ["write"],
              },
            },
          ],
          sfuBots: [
            {
              actions: ["write"],
              forwardings: [
                {
                  actions: ["write"],
                },
              ],
            },
          ],
        },
      ],
    },
  },
}).encode(import.meta.env.VITE_SKYWAY_SECRET_KEY);

onMounted(() => {
  provide("skyWayToken", skyWayToken);
});
</script>

<template>
  <v-row>
    <v-col cols="6">
      <publisher-video />
    </v-col>
    <v-col cols="6"> </v-col>
  </v-row>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
