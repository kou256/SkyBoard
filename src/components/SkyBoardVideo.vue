<script setup>
import { inject, ref } from "vue";

const video = ref(null);
const videoWidth = inject("canvasWidth");
const videoHeight = inject("canvasHeight");

defineExpose({
  video,
});
</script>

<template>
  <video ref="video" :width="videoWidth" :height="videoHeight" autoplay></video>
</template>

<style scoped></style>
