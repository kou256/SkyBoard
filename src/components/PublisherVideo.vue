<script setup>
import PublisherCanvasConcat from "./PublisherCanvasConcat.vue";
import { context, createRoom, dataStream, me, room } from "../js/module/skyway";
import { LocalVideoStream, SkyWayStreamFactory } from "@skyway-sdk/room";
import { computed, provide, onMounted, onUnmounted, ref, inject } from "vue";

const concatCanvas = ref(null);

const emits = defineEmits(["send"]);

const skyWayToken = inject("skyWayToken");
const roomId = ref("None");
const roomName = inject("roomName");

const startPublication = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const audio = await SkyWayStreamFactory.createMicrophoneAudioStream();
    const video = new LocalVideoStream(concatCanvas.value.canvasStreamTrack);

    try {
      await createRoom(skyWayToken.value, roomName.value, audio, video);
    } catch (e) {
      console.log(e);
    }


    roomId.value = room.id;
    room.onStreamPublished.add(async (e) => {
      const { stream } = await me.subscribe(e.publication.id);
      if (stream) {
        if (stream.contentType === "data") {
          stream.onData.add((comment) => {
            emits("send", comment);
            console.log(comment);
            dataStream.write(comment);
          });
        }
      }
    });
  }
}

onMounted(() => {
  startPublication();
});

onUnmounted(async () => {
  if (room) {
    await me.leave();
    await room.close();
    await context.dispose();
  }
});
</script>

<template>
  <publisher-canvas-concat ref="concatCanvas" />
</template>

<style scoped></style>
