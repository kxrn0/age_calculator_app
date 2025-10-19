<script setup lang="ts">
const emits = defineEmits<{
  (e: "buttonClick"): void;
}>();
</script>

<template>
  <button @click="emits('buttonClick')">
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="44" viewBox="0 0 46 44">
      <g fill="none" stroke="#FFF" stroke-width="2">
        <path
          d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44"
        />
      </g>
    </svg>
  </button>
</template>

<style scoped lang="scss">
button {
  background: var(--purple-500);
  width: 6rem;
  height: 6rem;
  border-radius: 100%;
  border: none;
  display: grid;
  place-items: center;
  transition:
    background-color var(--base-duration),
    transform var(--base-duration);

  svg {
    pointer-events: none;
    width: 2.75rem;
    height: 2.75rem;
  }

  @media (hover: hover) {
    &:hover {
      background: black;
    }
  }

  &:active {
    background: darkslategray;
    transform: translateY(0.05rem);
  }

  @media (max-width: 43rem) {
    width: 4rem;
    height: 4rem;

    svg {
      width: 1.5rem;
      height: 1.5rem;

      g {
        stroke-width: 3;
      }
    }
  }
}
</style>
