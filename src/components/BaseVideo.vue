<script setup>
import { onMounted } from "vue";
import { SkyWayStreamFactory } from "@skyway-sdk/room";

const initVideo = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const { audio, video } =
      await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
    const localVideo = document.getElementById("local-video");
    video.attach(localVideo);
    await localVideo.play();
  }
};

onMounted(() => {
  initVideo();
});
</script>

<template>
  <video id="local-video" playsinline></video>
</template>

<style scoped></style>
