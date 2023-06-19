<script setup>
const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <v-virtual-scroll :height="300" :items="props.comments">
    <template v-slot:default="{ item }">
      {{ item }}
    </template>
  </v-virtual-scroll>
</template>

<style scoped></style>
