<script setup>
import { onMounted, ref } from "vue";
const video = ref(null);
const videoCanvas = ref(null);
const canvasStreamTrack = ref(null);
const width = 640;
const height = 480;
const frameRate = 60;

onMounted(() => {
  const videoElement = video.value;
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    videoElement.srcObject = stream;
  });

  const ctx = videoCanvas.value.getContext("2d");
  const canvasElement = videoCanvas.value;
  canvasElement.width = width;
  canvasElement.height = height;
  const drawVideo = () => {
    ctx.drawImage(videoElement, 0, 0, width, height);
  };
  setInterval(drawVideo, 1000 / frameRate);
  const canvasStream = canvasElement.captureStream(frameRate);
  canvasStreamTrack.value = canvasStream.getVideoTracks()[0];
});

defineExpose({
  canvasStreamTrack,
});
</script>

<template>
  <div>
    <video ref="video" autoplay v-show="false"></video>
    <canvas ref="videoCanvas" @click="onClickCanvas"></canvas>
  </div>
</template>

<style scoped></style>
