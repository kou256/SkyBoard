<script setup>
import { publishComment } from "../js/module/skyway";
import CommentFormSend from "./CommentFormSend.vue";
import {onMounted} from "vue";

const onClickSend = async (e) => {
  await publishComment(e);
};
</script>

<template>
  <comment-form-send @send="onClickSend" />
</template>

<style scoped></style>
