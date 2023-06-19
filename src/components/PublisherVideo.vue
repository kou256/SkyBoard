<script setup>
import SkyBoardVideo from "./SkyBoardVideo.vue";
import BaseButton from "./BaseButton.vue";
import CommentColumn from "./CommentColumn.vue";
import {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from "@skyway-sdk/room";
import { computed, inject, onMounted, onUnmounted, ref } from "vue";

const roomId = ref("None");
const roomName = ref("");
let room;
const hasRoomName = computed(() => roomName.value.length > 0);

const localVideo = ref(null);
let context;
const comments = ref([]);
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

const startPublication = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const { audio, video } =
      await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
    video.attach(localVideo.value.video);

    context = await SkyWayContext.Create(skyWayToken);

    room = await SkyWayRoom.FindOrCreate(context, {
      type: "p2p",
      name: roomName.value,
    });

    const me = await room.join();
    await me.publish(audio);
    await me.publish(video);

    roomId.value = room.id;
    room.onStreamPublished.add(async (e) => {
      const { stream } = await me.subscribe(e.publication.id);
      if (stream) {
        if (stream.contentType === "data") {
          stream.onData.add((comment) => {
            comments.value.push(comment);
          });
        }
      }
    });

    room.onMemberLeft.add((e) => {
      console.log("onMemberListChanged", e);
    });
  }
};

onMounted(() => {
  // skyWayToken = inject("skyWayToken", null);
});

const onClickCreate = async () => {
  await startPublication();
};

const onClickLeave = () => {
  context.dispose();
};

onUnmounted(async () => {
  if (room) {
    await room.close();
  }
});
</script>

<template>
  <sky-board-video ref="localVideo" />
  <v-text-field type="text" label="Room Name" v-model="roomName" />
  <v-label>Room ID: {{ roomId }}</v-label>
  <base-button label="Create" @click="onClickCreate" :disabled="!hasRoomName" />
  <base-button label="Leave" @click="onClickLeave" />
  <comment-column :comments="comments" />
</template>

<style scoped></style>
