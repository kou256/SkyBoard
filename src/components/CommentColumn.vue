<script setup>
const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <v-card>
    <v-card-title>コメント</v-card-title>
    <v-card-item>
      <v-virtual-scroll :height="300" :items="props.comments">
        <template v-slot:default="{ item }">
          {{ item }}
        </template>
      </v-virtual-scroll>
    </v-card-item>
  </v-card>
</template>

<style scoped></style>
