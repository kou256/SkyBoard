<script setup>
import {ref} from "vue";
const colorPicker = ref(null);
const paintMode = ref(null);
const paintModes = ["cursor", "pencil", "eraser"];
const overlay = ref(false);

const emit = defineEmits(["changeColor", "changeMode"]);

const onChangePaintMode = (modeIndex) => {
  emit("changeMode", paintModes[modeIndex]);
};
</script>

<template>
  <div>
    <v-btn-toggle v-model="paintMode" @update:model-value="onChangePaintMode">
      <v-btn icon>
        <v-icon>mdi-cursor</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-eraser</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-btn icon @click="overlay = !overlay">
      <v-icon>mdi-palette</v-icon>
    </v-btn>
    <v-overlay v-model="overlay" @click:outside="overlay = false">
      <v-color-picker v-model="colorPicker" @update:model-value="emit('changeColor', colorPicker)"/>
    </v-overlay>
  </div>
</template>

<style scoped>

</style>