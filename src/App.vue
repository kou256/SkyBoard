<script setup>
import RoomDialogEnter from "./components/RoomDialogEnter.vue";
import PublisherVideo from "./components/PublisherVideo.vue";
import SubscriberView from "./components/SubscriberView.vue";
import { nowInSec, SkyWayAuthToken, uuidV4 } from "@skyway-sdk/room";
import {computed, onMounted, provide, readonly, ref} from "vue";
import CommentColumn from "./components/CommentColumn.vue";
import PublisherCanvasCtrl from "./components/PublisherCanvasCtrl.vue";
import BaseButton from "./components/BaseButton.vue";
import SubscriberCtrl from "./components/SubscriberCtrl.vue";
import CommentFormSend from "./components/CommentFormSend.vue";
const skyWayToken = new SkyWayAuthToken({
  jti: uuidV4(),
  iat: nowInSec(),
  exp: nowInSec() + 60 * 60 * 24,
  scope: {
    app: {
      id: import.meta.env.VITE_SKYWAY_APP_ID,
      turn: true,
      actions: ["read"],
      channels: [
        {
          id: "*",
          name: "*",
          actions: ["write"],
          members: [
            {
              id: "*",
              name: "*",
              actions: ["write"],
              publication: {
                actions: ["write"],
              },
              subscription: {
                actions: ["write"],
              },
            },
          ],
          sfuBots: [
            {
              actions: ["write"],
              forwardings: [
                {
                  actions: ["write"],
                },
              ],
            },
          ],
        },
      ],
    },
  },
}).encode(import.meta.env.VITE_SKYWAY_SECRET_KEY);

onMounted(() => {
  provide("skyWayToken", skyWayToken);
});

const roomName = ref("");
const roomType = ref("");
provide("roomName", readonly(roomName));
const onClickCreate = (inputRoomName) => {
  roomName.value = inputRoomName;
  roomType.value = "publisher";
};
const onClickJoin = (inputRoomName) => {
  roomName.value = inputRoomName;
  roomType.value = "subscriber";
};


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
const onClickLeave = () => {
  context.dispose();
}

const rail = ref(true);
</script>

<template>
  <v-app class="h-auto w-auto my-2">
    <v-app-bar title="SkyBoard"></v-app-bar>
    <v-main>
      <v-container class="h-100">
        <v-row justify="space-around" no-gutters>
          <v-col cols="8">
            <v-sheet color="#000000" class="h-100">
              <publisher-video class="mx-auto" v-if="roomType === 'publisher'" />
              <subscriber-view v-if="roomType === 'subscriber'" />
            </v-sheet>
          </v-col>
          <v-col cols="4">
            <comment-column :comments="['test']" />
            <comment-form-send v-if="roomType === 'subscriber'" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer>
      <v-row justify="space-around">
        <v-col cols="1">
          <base-button label="Create" @click="onClickCreate" :disabled="!hasRoomName" />
        </v-col>
        <v-col cols="1">
          <base-button label="Leave" @click="onClickLeave" />
        </v-col>
        <v-col cols="6">
          <publisher-canvas-ctrl
              @change-mode="onChangeMode"
              @change-color="onChangeColor"
              @change-brush-size="onChangeBrushSize"
              @update:files="onUpdateFiles"
              v-if="roomType === 'publisher'"
          />
        </v-col>
      </v-row>
    </v-footer>
    <room-dialog-enter @click:create="onClickCreate" @click:join="onClickJoin" v-if="roomType === ''"/>
  </v-app>
</template>

<style scoped>
.v-container {
  max-width: 100%;
}
</style>
