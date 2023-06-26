<script setup>
import { publishComment } from "../js/module/skyway";
import CommentFormSend from "./CommentFormSend.vue";

const emits = defineEmits(["send"]);
const onClickSend = async (e) => {
  const comment = e;
  await publishComment(comment);
  // if (data) {
  //   data.write(comment);
  //   // TODO: ちゃんとストリームをSubscribeするようにしたい。
  //   comments.value.push(comment);
  // }
};
</script>

<template>
  <comment-form-send @send="onClickSend" />
</template>

<style scoped></style>
