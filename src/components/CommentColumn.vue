<script setup>
import { inject } from "vue";

const comments = inject("comments", []);
</script>

<template>
  <v-card class="h-100">
    <v-card-title>コメント</v-card-title>
    <v-card-item>
      <v-virtual-scroll :height="300" :items="comments">
        <template v-slot:default="{ item }">
          {{ item }}
        </template>
      </v-virtual-scroll>
    </v-card-item>
  </v-card>
</template>

<style scoped></style>
