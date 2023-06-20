<script setup>
import {inject, onMounted, ref} from "vue";
import PublisherCanvasPaint from "./PublisherCanvasPaint.vue";
import PublisherCanvasImageArea from "./PublisherCanvasImageArea.vue";
const video = ref(null);
const videoCanvas = ref(null);
const canvasStreamTrack = ref(null);
const paintCanvas = ref(null);
const concatCanvas = ref(null);
let canvasCtx;
const width = 640;
const height = 480;
const frameRate = 60;
const paintMode = inject("paintMode");

onMounted(() => {
  const videoElement = video.value;
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    videoElement.srcObject = stream;
  });

  canvasCtx = videoCanvas.value.getContext("2d");
  const canvasElement = videoCanvas.value;
  canvasElement.width = width;
  canvasElement.height = height;
  const drawVideo = () => {
    canvasCtx.drawImage(videoElement, 0, 0, width, height);
    concat();
  };
  setInterval(drawVideo, 1000 / frameRate);
  const canvasStream = concatCanvas.value.captureStream(frameRate);
  canvasStreamTrack.value = canvasStream.getVideoTracks()[0];
});

const concat = () => {
  const concatCanvasElement = concatCanvas.value;
  const concatCanvasCtx = concatCanvasElement.getContext("2d");
  concatCanvasCtx.drawImage(videoCanvas.value, 0, 0, width, height);
  const imageCanvasElement = document.querySelector(".konvajs-content").querySelector("canvas");
  if (paintMode.value === "move") {
    imageCanvasElement.style.zIndex = "2";
    paintCanvas.value.paintCanvas.style.zIndex = "1";
  } else if (paintMode.value === "paint") {
    imageCanvasElement.style.zIndex = "1";
    paintCanvas.value.paintCanvas.style.zIndex = "2";
  }
  concatCanvasCtx.drawImage(imageCanvasElement, 0, 0, width, height);
  concatCanvasCtx.drawImage(paintCanvas.value.paintCanvas, 0, 0, width, height);
};

defineExpose({
  canvasStreamTrack,
  paintCanvas,
});
</script>

<template>
  <div>
    <video ref="video" autoplay v-show="false"></video>
    <div class="canvas-wrapper">
      <canvas ref="videoCanvas" width="640" height="480"></canvas>
      <publisher-canvas-paint ref="paintCanvas"/>
      <publisher-canvas-image-area />
    </div>
    <canvas ref="concatCanvas" width="640" height="480" v-show="false"></canvas>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  position: relative;
  width: 640px;
  height: 480px;
}
.canvas-wrapper canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
