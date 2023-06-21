<script setup>
import { computed, ref } from "vue";

const isDialogOpen = ref(true);
const roomName = ref("");
const isRoomNameEmpty = computed(() => roomName.value.length === 0);

const emits = defineEmits(["click:create", "click:join"]);

const onClickCreate = () => {
  isDialogOpen.value = false;
  emits("click:create", roomName.value);
};
const onClickJoin = () => {
  isDialogOpen.value = false;
  emits("click:join", roomName.value);
};
</script>

<template>
  <v-dialog v-model="isDialogOpen" persistent>
    <v-container>
      <v-row justify="center">
        <v-col cols="6" offset="3">
          <v-card max-width="500">
            <v-card-title>Room選択</v-card-title>
            <v-card-item>
              <v-text-field type="text" label="Room名" v-model="roomName" />
            </v-card-item>
            <v-card-actions>
              <v-row justify="space-around">
                <v-col cols="4" offset="1">
                  <v-btn
                    block
                    @click="onClickCreate"
                    :disabled="isRoomNameEmpty"
                    >作成</v-btn
                  >
                </v-col>
                <v-col cols="4" offset="1">
                  <v-btn block @click="onClickJoin" :disabled="isRoomNameEmpty"
                    >参加</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<style scoped></style>
