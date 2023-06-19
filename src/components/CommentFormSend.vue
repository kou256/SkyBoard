<script setup>
import BaseButton from "./BaseButton.vue";
import { ref } from "vue";
const comment = ref("");
const isCommentFormEmpty = () => comment.value.length === 0;
const emit = defineEmits(["send"]);
const onClickSend = async () => {
  const timestamp = new Date().toLocaleString();
  emit("send", `${timestamp} ${comment.value}`);
  comment.value = "";
};
</script>

<template>
  <v-text-field type="text" label="comment" v-model="comment" />
  <base-button label="Send" @click="onClickSend" />
</template>

<style scoped></style>
