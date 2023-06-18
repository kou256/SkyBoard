<script setup>
import { ref } from "vue";

const video = ref(null);

defineExpose({
  video,
});
</script>

<template>
  <video ref="video" autoplay></video>
</template>

<style scoped></style>
