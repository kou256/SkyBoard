<script setup>
import SkyBoardVideo from "./SkyBoardVideo.vue";
import BaseButton from "./BaseButton.vue";
import CommentFormSend from "./CommentFormSend.vue";
import CommentColumn from "./CommentColumn.vue";
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from "@skyway-sdk/room";

const roomName = ref("");
let room;
let me;
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
const comments = ref([]);
let context;
let data;

const startSubscription = async () => {
  context = await SkyWayContext.Create(skyWayToken);

  room = await SkyWayRoom.Find(
    context,
    {
      name: roomName.value,
    },
    "p2p"
  );
  me = await room.join();

  room.onStreamPublished.add(async (e) => {
    if (e.publication.contentType === "data") {
      const { stream } = await me.subscribe(e.publication.id);
      if (stream) {
        stream.onData.add((comment) => {
          comments.value.push(comment);
        });
      }
    }
  });

  data = await SkyWayStreamFactory.createDataStream(context);
  await me.publish(data);

  let subscribedVideo = false;
  let subscribedAudio = false;
  for (const publication of room.publications.filter((publication) => {
    return publication.publisher.id !== me.id;
  })) {
    if (publication.state === "enabled") {
      try {
        const { stream } = await me.subscribe(publication.id);
        if (publication.contentType === "video" && !subscribedVideo) {
          stream.attach(remoteVideo.value.video);
          subscribedVideo = true;
        } else if (publication.contentType === "audio" && !subscribedAudio) {
          stream.attach(remoteVideo.value.video);
          subscribedAudio = true;
        } else if (publication.contentType === "data") {
          stream.onData.add((comment) => {
            comments.value.push(comment);
          });
        }
      } catch (e) {
        console.error(e, publication);
      }
    }
  }
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
const onClickSend = async (e) => {
  const comment = e;
  if (data) {
    data.write(comment);
    // TODO: ちゃんとストリームをSubscribeするようにしたい。
    comments.value.push(comment);
  }
};

onUnmounted(async () => {
  if (room) {
    await room.leave();
  }
});
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
  <comment-column :comments="comments" />
  <comment-form-send @send="onClickSend" />
</template>

<style scoped></style>
