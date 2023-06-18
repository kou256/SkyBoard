<script setup>
import SkyBoardVideo from "./SkyBoardVideo.vue";
import BaseButton from "./BaseButton.vue";
import { computed, inject, onMounted, ref } from "vue";
import { SkyWayContext, SkyWayRoom } from "@skyway-sdk/room";

const roomName = ref("");
const hasRoomName = computed(() => roomName.value.length > 0);

let skyWayToken;
const remoteVideo = ref(null);
let context;

const startSubscription = async () => {
  context = await SkyWayContext.Create(skyWayToken);
  console.debug(context);

  const room = await SkyWayRoom.Find(
    context,
    {
      name: roomName.value,
    },
    "p2p"
  );
  console.debug(room);
  const me = await room.join();

  for (const publication of room.publications) {
    const { stream } = await me.subscribe(publication.id);
    stream.attach(remoteVideo.value.video);
  }

  room.onStreamPublished.add(async (e) => {
    const { stream } = await me.subscribe(e.publication.id);
    stream.attach(remoteVideo.value.video);
  });
};

onMounted(() => {
  skyWayToken = inject("skyWayToken", null);
});

const onClickSubscribe = async () => {
  await startSubscription();
};

const onClickLeave = () => {
  context.dispose();
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
</template>

<style scoped></style>
