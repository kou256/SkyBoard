<script setup>
import SkyBoardVideo from "./SkyBoardVideo.vue";
import BaseButton from "./BaseButton.vue";
import {
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
} from "@skyway-sdk/room";
import { computed, inject, onMounted, ref } from "vue";

const roomId = ref("None");
const roomName = ref("");
const hasRoomName = computed(() => roomName.value.length > 0);

let skyWayToken;
const localVideo = ref(null);
let context;
const startPublication = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const { audio, video } =
      await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
    video.attach(localVideo.value.video);

    context = await SkyWayContext.Create(skyWayToken);

    const room = await SkyWayRoom.FindOrCreate(context, {
      type: "p2p",
      name: roomName.value,
    });

    const me = await room.join();
    await me.publish(audio);
    await me.publish(video);

    roomId.value = room.id;
  }
};

onMounted(() => {
  skyWayToken = inject("skyWayToken", null);
});

const onClickCreate = async () => {
  await startPublication();
};

const onClickLeave = () => {
  context.dispose();
};
</script>

<template>
  <sky-board-video ref="localVideo" />
  <v-text-field type="text" label="Room Name" v-model="roomName" />
  <v-label>Room ID: {{ roomId }}</v-label>
  <base-button label="Create" @click="onClickCreate" :disabled="!hasRoomName" />
  <base-button label="Leave" @click="onClickLeave" />
</template>

<style scoped></style>
