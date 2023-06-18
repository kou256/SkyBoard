<script setup>
import SkyBoardVideo from "./SkyBoardVideo.vue";
import BaseButton from "./BaseButton.vue";
import { computed, inject, onMounted, ref } from "vue";
import {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from "@skyway-sdk/room";

const roomName = ref("");
const hasRoomName = computed(() => roomName.value.length > 0);

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
const remoteVideo = ref(null);
let context;
const comment = ref("");
let data;
const items = ref([]);

const startSubscription = async () => {
  context = await SkyWayContext.Create(skyWayToken);

  const room = await SkyWayRoom.Find(
    context,
    {
      name: roomName.value,
    },
    "p2p"
  );
  const me = await room.join();

  for (const publication of room.publications) {
    const { stream } = await me.subscribe(publication.id);
    if (publication.contentType === "video") {
      stream.attach(remoteVideo.value.video);
    } else if (publication.contentType === "audio") {
      stream.attach(remoteVideo.value.video);
    } else if (publication.contentType === "data") {
      data = stream;
      stream.onData.add((e) => {
        items.value.push(e);
      });
    }
  }

  room.onStreamPublished.add(async (e) => {
    console.log(e);
    const { stream } = await me.subscribe(e.publication.id);
    stream.attach(remoteVideo.value.video);
  });
};

onMounted(() => {
  // skyWayToken = inject("skyWayToken", null);
});

const onClickSubscribe = async () => {
  await startSubscription();
};

const onClickLeave = () => {
  context.dispose();
};
const onClickSend = async () => {
  const timestamp = new Date().toLocaleString();
  data.write(`${timestamp} ${comment.value}`);
};
</script>

<template>
  <sky-board-video ref="remoteVideo" />
  <v-text-field type="text" label="Room Name" v-model="roomName" />
  <base-button
    label="Join"
    @click="onClickSubscribe"
    :disabled="!hasRoomName"
  />
  <base-button label="Leave" @click="onClickLeave" />
  <v-virtual-scroll :height="300" :items="items">
    <template v-slot:default="{ item }">
      {{ item }}
    </template>
  </v-virtual-scroll>
  <v-text-field type="text" label="comment" v-model="comment" />
  <base-button label="Send" @click="onClickSend" />
</template>

<style scoped></style>
