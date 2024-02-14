<script setup lang="ts">
const { modelValue } = defineModels<{
  modelValue: number
}>()
</script>

<template>
  <input
    id="input"
    v-model="modelValue"
    v-bind="$attrs"
    type="text"
    p="y-2"
    w="220px"
    text="center"
    bg="transparent"
    border="~ rounded gray-200 dark:gray-700"
    outline="none active:none"
  >
</template>
