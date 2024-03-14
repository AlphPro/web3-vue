<script setup lang="ts">
import { ref } from "vue";

const counter = ref(0)
</script>

<template>
  <button @click="counter++"> Clicked me {{ counter }} times </button>
</template>
