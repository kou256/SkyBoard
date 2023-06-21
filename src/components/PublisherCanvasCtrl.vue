<script setup>
import { ref } from "vue";
const colorPicker = ref("#000000");
const paintMode = ref(0);
const paintModes = ["cursor", "pencil", "eraser"];
const isColorPickerDialog = ref(false);
const brushSize = ref(5);

const emit = defineEmits(["changeColor", "changeMode", "changeBrushSize"]);
</script>

<template>
  <div>
    <v-btn-toggle
      v-model="paintMode"
      variant="outlined"
      mandatory
      @update:model-value="emit('changeMode', paintModes[paintMode])"
    >
      <v-btn icon>
        <v-icon>mdi-cursor-pointer</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-eraser</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-dialog v-model="isColorPickerDialog" width="auto">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" variant="outlined" rounded="xs">
          <v-icon color="light-blue">mdi-palette</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-item>
          <v-color-picker
            v-model="colorPicker"
            @update:model-value="emit('changeColor', colorPicker)"
          />
        </v-card-item>
        <v-card-actions>
          <v-btn block @click="isColorPickerDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-slider
      v-model="brushSize"
      thumb-label
      step="1"
      min="1"
      max="10"
      @update:model-value="emit('changeBrushSize', brushSize)"
    ></v-slider>
  </div>
</template>

<style scoped></style>
