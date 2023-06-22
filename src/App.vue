<script setup>
import RoomDialogEnter from "./components/RoomDialogEnter.vue";
import PublisherVideo from "./components/PublisherVideo.vue";
import SubscriberView from "./components/SubscriberView.vue";
import { nowInSec, SkyWayAuthToken, uuidV4 } from "@skyway-sdk/room";
import {computed, onMounted, provide, readonly, ref} from "vue";
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

const roomName = ref("");
const roomType = ref("");
provide("roomName", readonly(roomName));
const onClickCreate = (inputRoomName) => {
  roomName.value = inputRoomName;
  roomType.value = "publisher";
};
const onClickJoin = (inputRoomName) => {
  roomName.value = inputRoomName;
  roomType.value = "subscriber";
};
</script>

<template>
  <room-dialog-enter @click:create="onClickCreate" @click:join="onClickJoin" />
  <publisher-video v-if="roomType === 'publisher'" />
  <subscriber-view v-if="roomType === 'subscriber'" />
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
