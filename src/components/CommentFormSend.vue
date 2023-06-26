<script setup>
import BaseButton from "./BaseButton.vue";
import { ref } from "vue";
const commentInput = ref("");
const isCommentFormEmpty = () => commentInput.value.length === 0;
const emit = defineEmits(["send"]);
const onClickSend = async () => {
  const timestamp = new Date().toLocaleString();
  const comment = `${timestamp} ${commentInput.value}`;
  emit("send", comment);
  commentInput.value = "";
};
</script>

<template>
  <v-row jsutify="spae-around" align="center">
    <v-col cols="10">
      <v-text-field type="text" label="コメント" v-model="commentInput" />
    </v-col>
    <v-col cols="2">
      <base-button label="送信" @click="onClickSend" />
    </v-col>
  </v-row>
</template>

<style scoped></style>
