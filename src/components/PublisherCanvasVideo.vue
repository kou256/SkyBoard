<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";
const videoElement = document.createElement("video");
const videoCanvas = ref(null);

const canvasWidth = inject("canvasWidth");
const canvasHeight = inject("canvasHeight");
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
  videoCanvasElement.width = canvasWidth.value;
  videoCanvasElement.height = canvasHeight.value;
  const drawVideo = () => {
    canvasCtx.drawImage(
      videoElement,
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    );
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
  <canvas
    ref="videoCanvas"
    :width="canvasWidth"
    :height="canvasHeight"
  ></canvas>
</template>

<style scoped></style>
