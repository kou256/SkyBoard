<script setup>
import { onMounted, ref } from "vue";
const video = ref(null);
const videoCanvas = ref(null);
const canvasStreamTrack = ref(null);
let canvasCtx;
const width = 640;
const height = 480;
const frameRate = 60;
const file = ref(null);
let pos = { x: 0, y: 0 };

onMounted(() => {
  const videoElement = video.value;
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    videoElement.srcObject = stream;
  });

  canvasCtx = videoCanvas.value.getContext("2d");
  const canvasElement = videoCanvas.value;
  canvasElement.width = width;
  canvasElement.height = height;
  canvasElement.addEventListener("mousedown", (e) => {
    canvasElement.addEventListener("mousemove", getMousePos);
  });
  canvasElement.addEventListener("mouseup", (e) => {
    canvasElement.removeEventListener("mousemove", getMousePos);
  });
  const drawVideo = () => {
    canvasCtx.drawImage(videoElement, 0, 0, width, height);
    if (file.value) {
      canvasCtx.drawImage(file.value, pos.x, pos.y, 100, 100);
    }
  };
  setInterval(drawVideo, 1000 / frameRate);
  const canvasStream = canvasElement.captureStream(frameRate);
  canvasStreamTrack.value = canvasStream.getVideoTracks()[0];
});

const onUpdateFiles = async (e) => {
  const image = new Image();
  image.src = URL.createObjectURL(e[0]);
  image.onload = () => {
    file.value = image;
  };
};

const getMousePos = (e) => {
  const rect = videoCanvas.value.getBoundingClientRect();
  pos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

defineExpose({
  canvasStreamTrack,
});
</script>

<template>
  <div>
    <video ref="video" autoplay v-show="false"></video>
    <canvas ref="videoCanvas"></canvas>
    <v-file-input
      label="File input"
      accept="image/*"
      @update:model-value="onUpdateFiles"
    />
  </div>
</template>

<style scoped></style>
