<script setup>
import { defineProps } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <v-btn>{{ label }}</v-btn>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>
