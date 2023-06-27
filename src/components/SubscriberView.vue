<script setup>
import SkyBoardVideo from "./SkyBoardVideo.vue";
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import { joinRoom, publishComment } from "../js/module/skyway.js";

const roomName = inject("roomName");
const hasRoomName = computed(() => roomName.value.length > 0);

const remoteVideo = ref(null);
const comments = ref([]);
const emits = defineEmits(["send"]);

const startSubscription = async () => {
  const ret = await joinRoom(roomName.value);
  console.log(ret);
  // context = await SkyWayContext.Create(skyWayToken);
  //
  // room = await SkyWayRoom.Find(
  //   context,
  //   {
  //     name: roomName.value,
  //   },
  //   "p2p"
  // );
  // me = await room.join();
  //
  // room.onStreamPublished.add(async (e) => {
  //   if (e.publication.contentType === "data") {
  //     const { stream } = await me.subscribe(e.publication.id);
  //     if (stream) {
  //       stream.onData.add((comment) => {
  //         comments.value.push(comment);
  //       });
  //     }
  //   }
  // });
  //
  // data = await SkyWayStreamFactory.createDataStream(context);
  // await me.publish(data);
  //
  // let subscribedVideo = false;
  // let subscribedAudio = false;
  // for (const publication of room.publications.filter((publication) => {
  //   return publication.publisher.id !== me.id;
  // })) {
  //   if (publication.state === "enabled") {
  //     try {
  //       const { stream } = await me.subscribe(publication.id);
  //       if (publication.contentType === "video" && !subscribedVideo) {
  //         stream.attach(remoteVideo.value.video);
  //         subscribedVideo = true;
  //       } else if (publication.contentType === "audio" && !subscribedAudio) {
  //         stream.attach(remoteVideo.value.video);
  //         subscribedAudio = true;
  //       } else if (publication.contentType === "data") {
  //         stream.onData.add((comment) => {
  //           comments.value.push(comment);
  //         });
  //       }
  //     } catch (e) {
  //       console.error(e, publication);
  //     }
  //   }
  // }
};

onMounted(async () => {
  const { me, room, streams } = await joinRoom(roomName.value);

  for (const stream of streams) {
    if (stream.contentType === "video") {
      stream.attach(remoteVideo.value.video);
    } else if (stream.contentType === "audio") {
      stream.attach(remoteVideo.value.video);
    } else if (stream.contentType === "data") {
      stream.onData.add((comment) => {
        emits("send", comment);
      });
    }
  }
  await publishComment("");
});

onUnmounted(async () => {
  // if (room) {
  //   await room.leave();
  // }
});
</script>

<template>
  <sky-board-video ref="remoteVideo" />
</template>

<style scoped></style>
