<script setup>
import { onMounted, onUnmounted, ref } from "vue";
const videoElement = document.createElement("video");
const videoCanvas = ref(null);

const width = 640;
const height = 480;
const frameRate = 30;

let intervalId;

onMounted(() => {
  // VideoElementは動画を取得するためだけに使用する。
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    videoElement.srcObject = stream;
    videoElement.play();
  });

  const videoCanvasElement = videoCanvas.value;
  const canvasCtx = videoCanvasElement.getContext("2d");
  videoCanvasElement.width = width;
  videoCanvasElement.height = height;
  const drawVideo = () => {
    canvasCtx.drawImage(videoElement, 0, 0, width, height);
  };
  intervalId = setInterval(drawVideo, 1000 / frameRate);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

defineExpose({
  videoCanvas,
});
</script>

<template>
  <canvas ref="videoCanvas" width="640" height="480"></canvas>
</template>

<style scoped></style>
