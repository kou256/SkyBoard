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
  <v-row>
    <v-col cols="8">
      <v-text-field type="text" label="コメント" v-model="comment" />
    </v-col>
    <v-col cols="3">
      <base-button label="送信" @click="onClickSend" />
    </v-col>
  </v-row>
</template>

<style scoped></style>
