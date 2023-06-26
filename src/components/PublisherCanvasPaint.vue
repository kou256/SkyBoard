<script setup>
import { inject, onMounted, provide, ref, watch } from "vue";
const paintCanvas = ref(null);
const cursor = ref({ x: 0, y: 0, prevX: 0, prevY: 0 });
const isDrawing = ref(false);
const canvasWidth = inject("canvasWidth");
const canvasHeight = inject("canvasHeight");
onMounted(() => {
  const canvasElement = paintCanvas.value;
  const canvasCtx = canvasElement.getContext("2d");

  canvasCtx.lineWidth = brushSize.value;
  canvasCtx.strokeStyle = brushColor.value;

  canvasElement.addEventListener("mousedown", (e) => {
    getCursorPos(e);
    cursor.value.prevX = cursor.value.x;
    cursor.value.prevY = cursor.value.y;
    isDrawing.value = true;
    canvasElement.addEventListener("mousemove", (e) => {
      getCursorPos(e);
      if (!isDrawing.value) {
        return;
      }
      draw();
    });
  });
  canvasElement.addEventListener("mouseup", () => {
    isDrawing.value = false;
  });
});
const getCursorPos = (e) => {
  const rect = paintCanvas.value.getBoundingClientRect();
  cursor.value.x = e.clientX - rect.left;
  cursor.value.y = e.clientY - rect.top;
};

const draw = () => {
  const canvasElement = paintCanvas.value;
  const canvasCtx = canvasElement.getContext("2d");

  canvasCtx.beginPath();
  canvasCtx.moveTo(cursor.value.prevX, cursor.value.prevY);
  canvasCtx.lineTo(cursor.value.x, cursor.value.y);
  canvasCtx.lineCap = "round";
  canvasCtx.stroke();
  cursor.value.prevX = cursor.value.x;
  cursor.value.prevY = cursor.value.y;
};

const paintMode = inject("paintMode");
const brushColor = inject("brushColor");
const brushSize = inject("brushSize");
watch(
  () => paintMode,
  (newMode) => {
    setPaintMode(newMode);
  },
  { deep: true }
);
watch(
  () => brushColor,
  (newBrushColor) => {
    setBrushColor(newBrushColor);
  },
  { deep: true }
);
watch(
  () => brushSize,
  (newBrushSize) => {
    setBrushSize(newBrushSize);
  },
  { deep: true }
);

const setPaintMode = (newMode) => {
  const canvasCtx = paintCanvas.value.getContext("2d");
  if (newMode === "paint") {
    canvasCtx.globalCompositeOperation = "source-over";
  } else if (newMode === "erase") {
    canvasCtx.globalCompositeOperation = "destination-out";
  }
};

const setBrushColor = (newBrushColor) => {
  const canvasCtx = paintCanvas.value.getContext("2d");
  canvasCtx.strokeStyle = newBrushColor.value;
  console.log(canvasCtx.strokeStyle);
};

const setBrushSize = (newBrushSize) => {
  const canvasCtx = paintCanvas.value.getContext("2d");
  canvasCtx.lineWidth = newBrushSize.value;
  console.log(canvasCtx.lineWidth);
};

defineExpose({
  paintCanvas,
});
</script>

<template>
  <canvas
    ref="paintCanvas"
    :width="canvasWidth"
    :height="canvasHeight"
  ></canvas>
</template>

<style scoped>
canvas {
  z-index: 1;
}
</style>
