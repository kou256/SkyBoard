<script setup>
import SkyBoardVideo from "./SkyBoardVideo.vue";
import BaseButton from "./BaseButton.vue";
import {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from "@skyway-sdk/room";
import { computed, inject, onMounted, ref } from "vue";

const roomId = ref("None");
const roomName = ref("");
const hasRoomName = computed(() => roomName.value.length > 0);

const localVideo = ref(null);
let context;
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

const items = ref(Array.from({ length: 100000 }).map((_, i) => i));
const comment = ref("");
let data;

const startPublication = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const { audio, video } =
      await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
    video.attach(localVideo.value.video);

    data = await SkyWayStreamFactory.createDataStream();

    context = await SkyWayContext.Create(skyWayToken);

    const room = await SkyWayRoom.FindOrCreate(context, {
      type: "p2p",
      name: roomName.value,
    });

    const me = await room.join();
    await me.publish(audio);
    await me.publish(video);
    await me.publish(data);

    roomId.value = room.id;
  }
};

onMounted(() => {
  // skyWayToken = inject("skyWayToken", null);
});

const onClickCreate = async () => {
  await startPublication();
};

const onClickLeave = () => {
  context.dispose();
};
const onClickSend = async () => {
  const timestamp = new Date().toLocaleString();
  data.write(`${timestamp} ${comment.value}`);
};
</script>

<template>
  <sky-board-video ref="localVideo" />
  <v-text-field type="text" label="Room Name" v-model="roomName" />
  <v-label>Room ID: {{ roomId }}</v-label>
  <base-button label="Create" @click="onClickCreate" :disabled="!hasRoomName" />
  <base-button label="Leave" @click="onClickLeave" />
  <v-text-field type="text" label="comment" v-model="comment" />
  <base-button label="Send" @click="onClickSend" />
</template>

<style scoped></style>
