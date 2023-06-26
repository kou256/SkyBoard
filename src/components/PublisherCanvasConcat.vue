<script setup>
import { inject, onMounted, ref } from "vue";
import PublisherCanvasVideo from "./PublisherCanvasVideo.vue";
import PublisherCanvasPaint from "./PublisherCanvasPaint.vue";
import PublisherCanvasImage from "./PublisherCanvasImage.vue";
const canvasStreamTrack = ref(null);
const videoCanvas = ref(null);
const paintCanvas = ref(null);
const imageCanvas = ref(null);
const canvasWidth = inject("canvasWidth");
const canvasHeight = inject("canvasHeight");
const frameRate = 30;
const paintMode = inject("paintMode");
const concatCanvasElement = document.createElement("canvas");
const canvasWrapper = ref(null);

onMounted(() => {
  const canvasWrapperWidth = canvasWrapper.value.clientWidth;
  const canvasWrapperHeight = canvasWrapper.value.clientHeight;
  if (canvasWidth.value > canvasWrapperWidth) {
  }

  concatCanvasElement.width = canvasWidth.value;
  concatCanvasElement.height = canvasHeight.value;

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
  <div
    ref="canvasWrapper"
    class="canvas-wrapper h-100 w-100 d-flex justify-center align-content-center"
  >
    <publisher-canvas-video ref="videoCanvas" />
    <publisher-canvas-paint ref="paintCanvas" />
    <publisher-canvas-image ref="imageCanvas" />
  </div>
</template>

<style scoped>
.canvas-wrapper {
  position: relative;
}

.canvas-wrapper > canvas {
  position: absolute;
  margin: auto;
  //top: 0;
  //left: 0;
}
</style>
