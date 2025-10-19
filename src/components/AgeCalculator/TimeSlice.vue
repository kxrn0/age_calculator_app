<script setup lang="ts">
import AnimeCounter from "./AnimeCounter.vue";

const props = defineProps<{
  name: string;
  target: number | null;
  milliSeconds: number;
}>();
</script>

<template>
  <div class="slice">
    <AnimeCounter :target="props.target" :milli-seconds="props.milliSeconds" />
    <span class="name">{{ props.name }}</span>
  </div>
</template>

<style scoped lang="scss">
@use "@/scss/text_presets";
@use "@/scss/variables";

.slice {
  display: flex;
  gap: 0.5rem;

  .name {
    @include text_presets.text-preset-1;

    color: black;

    @media (max-width: variables.$break-point-mobile) {
      @include text_presets.text-preset-2;
    }
  }
}
</style>
