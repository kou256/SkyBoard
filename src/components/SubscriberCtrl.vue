<script setup>

import CommentFormSend from "./CommentFormSend.vue";

const emits = defineEmits(["send"]);
const onClickSend = (e) => {
  const comment = e;
  emits("send", comment);
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

<style scoped>

</style>