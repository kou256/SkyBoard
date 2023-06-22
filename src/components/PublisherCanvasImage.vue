<script setup>
import {inject, onMounted, ref, watch} from "vue";

const configKonva = {
  width: 640,
  height: 480,
};
const transformer = ref(null);
const selectedFileName = ref(null);
const imageConfigs = ref([]);
const imageCanvas = ref(null);
const images = inject("files" );

onMounted(() => {
  // あとでcanvasにアクセスしたいのでquerySelectorで獲得してアクセスできるようにしておく。
  imageCanvas.value = document.querySelector(".konvajs-content > canvas");
});

watch(
    () => images.value, (newImages) => {
      const addedImages = newImages.filter(
          (image) => !imageConfigs.value.map((imageConfig) => imageConfig.name).includes(image.name)
      );
      addedImages.forEach((file) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
          const ratio = image.width / 320;
          imageConfigs.value.push({
            x: 50,
            y: 50,
            image: image,
            width: image.width / ratio,
            height: image.height / ratio,
            name: file.name,
            draggable: true,
          });
        };
      });
    },
    { deep: true }
);

const handleTransformEnd = (e) => {
  const imageConfig = imageConfigs.value.find(
    (config) => config.name === e.target.name()
  );
  imageConfig.x = e.target.x();
  imageConfig.y = e.target.y();
  imageConfig.rotation = e.target.rotation();
  imageConfig.scaleX = e.target.scaleX();
  imageConfig.scaleY = e.target.scaleY();
};
const handleStageMouseDown = (e) => {
  if (e.target === e.target.getStage()) {
    selectedFileName.value = "";
    updateTransformer();
    return;
  }

  const clickedOnTransformer = e.target.getParent().className === "Transformer";
  if (clickedOnTransformer) {
    return;
  }

  selectedFileName.value = e.target.name();
  updateTransformer();
};
const updateTransformer = () => {
  const transformerNode = transformer.value.getNode();
  const stage = transformerNode.getStage();

  const selectedNode = stage.findOne("." + selectedFileName.value);
  if (selectedNode === transformerNode.node()) {
    return;
  }

  if (selectedNode) {
    transformerNode.nodes([selectedNode]);
  } else {
    transformerNode.nodes([]);
  }
};
defineExpose({
  imageCanvas,
});
</script>

<template>
  <konva-stage :config="configKonva" @mousedown="handleStageMouseDown">
    <konva-layer>
      <konva-image
        v-for="config in imageConfigs"
        :config="config"
        @transformed="handleTransformEnd"
      ></konva-image>
      <konva-transformer ref="transformer" />
    </konva-layer>
  </konva-stage>
</template>

<style scoped></style>
