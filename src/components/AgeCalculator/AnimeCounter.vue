<script setup lang="ts">
import { watch, ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  target: number | null;
  milliSeconds: number;
}>();
const current = ref(0);
let startTime = 0;
let animeId: number | null = null;

function anime(timestamp: number) {
  if (props.target === null) return;

  if (!startTime) startTime = timestamp;

  const elapsedTime = timestamp - startTime;

  if (elapsedTime < props.milliSeconds) {
    const progress = elapsedTime / props.milliSeconds;

    current.value = Math.round(props.target * progress);

    animeId = requestAnimationFrame(anime);
  } else current.value = props.target;
}

function init() {
  if (animeId !== null) cancelAnimationFrame(animeId);

  if (props.target === null) return;

  startTime = 0;
  current.value = 0;

  animeId = requestAnimationFrame(anime);
}

onMounted(init);

onUnmounted(() => {
  if (animeId !== null) cancelAnimationFrame(animeId);
});

watch(() => props.target, init);
</script>

<template>
  <span v-if="props.target !== null">{{ current }}</span>
  <span v-else>--</span>
</template>

<style scoped lang="scss">
@use "@/scss/text_presets";
@use "@/scss/variables";

span {
  @include text_presets.text-preset-1;

  color: var(--purple-500);

  @media (max-width: variables.$break-point-mobile) {
    @include text_presets.text-preset-2;
  }
}
</style>
