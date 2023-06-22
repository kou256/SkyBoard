<script setup>
import { inject, onMounted, ref } from "vue";
import PublisherCanvasVideo from "./PublisherCanvasVideo.vue";
import PublisherCanvasPaint from "./PublisherCanvasPaint.vue";
import PublisherCanvasImage from "./PublisherCanvasImage.vue";
const canvasStreamTrack = ref(null);
const videoCanvas = ref(null);
const paintCanvas = ref(null);
const imageCanvas = ref(null);
const width = 640;
const height = 480;
const frameRate = 30;
const paintMode = inject("paintMode");
const concatCanvasElement = document.createElement("canvas");

onMounted(() => {
  concatCanvasElement.width = width;
  concatCanvasElement.height = height;

  setInterval(concat, 1000 / frameRate);

  const canvasStream = concatCanvasElement.captureStream(frameRate);
  canvasStreamTrack.value = canvasStream.getVideoTracks()[0];
});

const concat = () => {
  const concatCanvasCtx = concatCanvasElement.getContext("2d");
  concatCanvasCtx.drawImage(videoCanvas.value.videoCanvas, 0, 0, width, height);
  if (paintMode.value === "cursor") {
    imageCanvas.value.imageCanvas.style.zIndex = "2";
    paintCanvas.value.paintCanvas.style.zIndex = "1";
  } else if (paintMode.value === "paint") {
    imageCanvas.value.imageCanvas.style.zIndex = "1";
    paintCanvas.value.paintCanvas.style.zIndex = "2";
  }
  concatCanvasCtx.drawImage(imageCanvas.value.imageCanvas, 0, 0, width, height);
  concatCanvasCtx.drawImage(paintCanvas.value.paintCanvas, 0, 0, width, height);
};

defineExpose({
  canvasStreamTrack,
  paintCanvas,
});
</script>

<template>
  <div class="canvas-wrapper">
    <publisher-canvas-video ref="videoCanvas" />
    <publisher-canvas-paint ref="paintCanvas" />
    <publisher-canvas-image ref="imageCanvas" />
  </div>
</template>

<style scoped>
.canvas-wrapper {
  position: relative;
  width: 640px;
  height: 480px;
}

.canvas-wrapper > canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
