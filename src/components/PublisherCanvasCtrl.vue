<script setup>
import { provide, ref } from "vue";
const colorPicker = ref("#000000");
const paintMode = ref(0);
const paintModes = ["cursor", "paint", "erase"];
const isColorPickerDialog = ref(false);
const brushSize = ref(5);

const emit = defineEmits([
  "changeColor",
  "changeMode",
  "changeBrushSize",
  "update:files",
]);
</script>

<template>
  <v-row justify="center">
    <v-col cols="3">
      <v-btn-toggle
        v-model="paintMode"
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
    </v-col>
    <v-col cols="3">
      <v-slider
        v-model="brushSize"
        thumb-label
        step="1"
        min="1"
        max="10"
        @update:model-value="emit('changeBrushSize', brushSize)"
      >
        <template v-slot:prepend>
          <v-dialog v-model="isColorPickerDialog" width="auto">
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" variant="text">
                <v-icon :color="colorPicker">mdi-palette</v-icon>
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
          <v-icon>mdi-brush</v-icon>
        </template>
      </v-slider>
    </v-col>
    <v-col cols="3">
      <v-file-input
        label="File input"
        accept="image/*"
        @update:model-value="emit('update:files', $event)"
      />
    </v-col>
  </v-row>
</template>

<style scoped></style>
