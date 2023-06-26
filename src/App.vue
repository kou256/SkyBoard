<script setup>
import RoomDialogEnter from "./components/RoomDialogEnter.vue";
import PublisherVideo from "./components/PublisherVideo.vue";
import SubscriberView from "./components/SubscriberView.vue";
import { computed, onMounted, provide, readonly, ref } from "vue";
import CommentColumn from "./components/CommentColumn.vue";
import PublisherCanvasCtrl from "./components/PublisherCanvasCtrl.vue";
import SubscriberCtrl from "./components/SubscriberCtrl.vue";

onMounted(() => {
  window.addEventListener("resize", onResizeWindow);
});

const roomName = ref("");
const roomType = ref("");
const comments = ref([]);
provide("roomName", readonly(roomName));
provide("comments", readonly(comments));
const onClickCreate = (inputRoomName) => {
  roomName.value = inputRoomName;
  roomType.value = "publisher";

  onResizeWindow();
};
const onSendComment = (comment) => {
  console.log(comment);
  comments.value.push(comment);
};
const onResizeWindow = () => {
  const widthRatio = canvasParent.value.clientWidth / canvasWidth.value;
  const heightRatio = canvasParent.value.clientHeight / canvasHeight.value;
  if (widthRatio > heightRatio) {
    canvasWidth.value = canvasParent.value.clientWidth;
    canvasHeight.value = canvasHeight.value * widthRatio;
  } else {
    canvasWidth.value = canvasWidth.value * heightRatio;
    canvasHeight.value = canvasParent.value.clientHeight;
  }
};

const onClickJoin = (inputRoomName) => {
  roomName.value = inputRoomName;
  roomType.value = "subscriber";
};

const canvasParent = ref(null);
const canvasWidth = ref(1280);
const canvasHeight = ref(720);
provide("canvasWidth", canvasWidth);
provide("canvasHeight", canvasHeight);

const paintMode = ref("cursor");
let brushColor = ref("#000000");
let brushSize = ref(5);
provide("paintMode", paintMode);
provide("brushColor", brushColor);
provide("brushSize", brushSize);
const onChangeMode = (mode) => {
  paintMode.value = mode;
};

const onChangeColor = (newColor) => {
  brushColor.value = newColor;
};

const onChangeBrushSize = (newBrushSize) => {
  brushSize.value = newBrushSize;
};

const files = ref([]);
provide("files", files);
const onUpdateFiles = (loadedFiles) => {
  files.value.push(...loadedFiles);
};

// const onClickCreate = async () => {
//   await startPublication();
// };
// const onClickLeave = () => {
//   context.dispose();
// };
//
</script>

<template>
  <v-app class="h-100 w-auto" @resize="onResizeWindow">
    <v-app-bar title="SkyBoard"></v-app-bar>
    <v-main>
      <v-row class="mt-1 mx-1 h-100" justify="space-around">
        <v-col cols="8">
          <v-sheet class="h-100" color="#000000" @resize="onResizeWindow">
            <div ref="canvasParent" class="h-100 w-100">
              <publisher-video
                v-if="roomType === 'publisher'"
                @send="onSendComment"
              />
              <subscriber-view v-if="roomType === 'subscriber'" />
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="4">
          <comment-column :comments="['test']" />
        </v-col>
      </v-row>
    </v-main>
    <v-footer height="10">
      <publisher-canvas-ctrl
        @change-mode="onChangeMode"
        @change-color="onChangeColor"
        @change-brush-size="onChangeBrushSize"
        @update:files="onUpdateFiles"
        v-if="roomType === 'publisher'"
      />
      <subscriber-ctrl v-if="roomType === 'subscriber'" />
    </v-footer>
    <room-dialog-enter
      @click:create="onClickCreate"
      @click:join="onClickJoin"
      v-if="roomType === ''"
    />
  </v-app>
</template>

<style scoped></style>
