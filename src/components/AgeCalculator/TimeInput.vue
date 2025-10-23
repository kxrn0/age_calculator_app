<script setup lang="ts">
import { computed } from "vue";
import type { TimeState } from "@/types";

const emits = defineEmits<{
  (e: "time-input", state: TimeState, event: InputEvent): void;
}>();

const props = defineProps<{
  state: TimeState;
  label: string;
  placeholder: string;
  outOfRangeErrorMessage: string;
  isDateInvalid: boolean;
}>();
const isTerrified = computed(() => props.state.error.value !== "none" || props.isDateInvalid);

function handle_key_down(event: KeyboardEvent) {
  if (event.key === ".") event.preventDefault();
}
</script>

<template>
  <label :class="{ terrified: isTerrified }">
    <span class="input-name">{{ props.label }}</span>
    <input
      type="number"
      :placeholder="props.placeholder"
      @input="(e) => emits('time-input', props.state, e)"
      @keydown="handle_key_down"
    />
    <span v-if="props.state.error.value === 'out-of-range'" class="error">{{
      props.outOfRangeErrorMessage
    }}</span>
    <span v-else-if="props.state.error.value === 'empty'" class="error"
      >This field is required</span
    >
  </label>
</template>

<style scoped lang="scss">
@use "@/scss/text_presets.scss";
@use "@/scss/semantics.scss";
@use "@/scss/variables.scss";

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .input-name {
    @include text_presets.text-preset-5-bold;

    color: var(--grey-500);
    text-transform: uppercase;
  }

  input {
    @include text_presets.text-preset-3;

    color: black;
    border: 1px solid var(--grey-200);
    caret-color: var(--purple-500);
    outline: none;
    width: 10.625rem;
    height: 4rem;
    padding: 0.5rem 1.5rem;
    border-radius: 0.5rem;

    &::placeholder {
      color: var(--grey-700);
    }
  }

  .error {
    @include semantics.error;
  }

  &.terrified {
    .input-name {
      color: var(--red-400);
    }

    input {
      border-color: var(--red-400);
    }
  }

  @media (max-width: variables.$break-point-mobile) {
    width: 5.48rem;

    .input-name {
      @include text_presets.text-preset-6-bold;
    }

    input {
      @include text_presets.text-preset-4;

      width: 100%;
      height: 2.875rem;
      padding: 0.5rem 1rem;
    }
  }
}
</style>
