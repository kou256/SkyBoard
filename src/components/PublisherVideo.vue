<script setup>
import BaseButton from "./BaseButton.vue";
import CommentColumn from "./CommentColumn.vue";
import PublisherCanvasConcat from "./PublisherCanvasConcat.vue";
import PublisherCanvasCtrl from "./PublisherCanvasCtrl.vue";
import {
  LocalVideoStream,
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from "@skyway-sdk/room";
import {computed, provide, onMounted, onUnmounted, ref, inject} from "vue";


const roomId = ref("None");
const roomName = inject("roomName");
let room;
const hasRoomName = computed(() => roomName.value.length > 0);
const concatCanvas = ref(null);
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
    const audio = await SkyWayStreamFactory.createMicrophoneAudioStream();
    const video = new LocalVideoStream(concatCanvas.value.canvasStreamTrack);

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

onUnmounted(async () => {
  if (room) {
    await room.close();
  }
});

</script>

<template>
  <publisher-canvas-concat ref="concatCanvas" />
</template>

<style scoped></style>
