<script setup>
import {onMounted, ref} from "vue";
const paintCanvas = ref(null);
const cursor = ref({x: 0, y: 0, prevX: 0, prevY: 0});
const isDrawing = ref(false);

onMounted(() => {
  const canvasElement = paintCanvas.value;

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

  canvasCtx.beginPath()
  canvasCtx.lineWidth = 5;
  canvasCtx.moveTo(cursor.value.prevX, cursor.value.prevY)
  canvasCtx.lineTo(cursor.value.x, cursor.value.y);
  canvasCtx.lineCap = "round";
  canvasCtx.stroke();
  cursor.value.prevX = cursor.value.x;
  cursor.value.prevY = cursor.value.y;
};

const setPaintMode = (mode) => {
  const canvasCtx = paintCanvas.value.getContext("2d");
  if (mode === "pencil") {
    canvasCtx.globalCompositeOperation = "source-over";
    console.log(canvasCtx.globalCompositeOperation)
  } else if (mode === "eraser") {
    canvasCtx.globalCompositeOperation = "destination-out";
    console.log(canvasCtx.globalCompositeOperation)
  }
  console.log(mode);
};

const setPaintColor = (color) => {
  const canvasCtx = paintCanvas.value.getContext("2d");
  canvasCtx.strokeStyle = color;
};

defineExpose({
  paintCanvas,
  setPaintMode,
  setPaintColor
});

</script>

<template>
  <canvas ref="paintCanvas" width="640" height="480"></canvas>
</template>

<style scoped>
canvas {
  z-index: 1;
}
</style>