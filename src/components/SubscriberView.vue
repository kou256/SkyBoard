<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";
import { joinRoom, publishComment } from "../js/module/skyway.js";

const video = ref(null);
const videoWidth = inject("canvasWidth");
const videoHeight = inject("canvasHeight");

const roomName = inject("roomName");
const emits = defineEmits(["send"]);
let me = null;
let room = null;

const startSubscription = async () => {
  const { user, joinedRoom, streams } = await joinRoom(roomName.value);
  me = user;
  room = joinedRoom;

  for (const stream of streams) {
    if (stream.contentType === "video") {
      stream.attach(video.value);
    } else if (stream.contentType === "audio") {
      stream.attach(video.value);
    } else if (stream.contentType === "data") {
      stream.onData.add((comment) => {
        emits("send", comment);
      });
    }
  }
};

onMounted(async () => {
  await startSubscription();
  await publishComment("");
});

onUnmounted(async () => {
  if (me) {
    await me.leave();
  }
  if (room) {
    await room.leave();
  }
});
</script>

<template>
  <video ref="video" :width="videoWidth" :height="videoHeight" autoplay></video>
</template>

<style scoped></style>
