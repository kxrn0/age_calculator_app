<script setup lang="ts">
import type { TimeState } from "@/types";
import { ref } from "vue";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import duration from "dayjs/plugin/duration.js";
import objectSupport from "dayjs/plugin/objectSupport.js";
import ArrowButton from "./ArrowButton.vue";
import TimeInput from "./TimeInput.vue";
import useTimeInputState from "./composables/useTimeInputState";
import TimeSlice from "./TimeSlice.vue";

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(objectSupport);

type Age = { years: number | null; months: number | null; days: number | null };

const age = ref<Age>({ years: null, months: null, days: null });
const isDateInvalid = ref(false);
const day = useTimeInputState((n) => 1 <= n && n <= 31);
const month = useTimeInputState((n) => 1 <= n && n <= 12);
const year = useTimeInputState((n) => n <= dayjs().year());
const animationDuration = 500;

function format_date(year: number, month: number, day: number) {
  const yearS = year.toString().padStart(4, "0");
  const monthS = month.toString().padStart(2, "0");
  const dayS = day.toString().padStart(2, "0");

  return `${yearS}/${monthS}/${dayS}`;
}

function has_empty(unitedStates: TimeState[]) {
  let hasEmpty = false;

  for (const state of unitedStates)
    if (state.inputValue.value === 0) {
      hasEmpty = true;
      state.error.value = "empty";
    }

  return hasEmpty;
}

function handle_submit() {
  const unitedStates = [day, month, year];

  if (has_empty(unitedStates)) return;

  const today = dayjs();
  const yesterday = dayjs(
    format_date(year.inputValue.value!, month.inputValue.value!, day.inputValue.value!),
    "YYYY/MM/DD",
    true,
  );

  isDateInvalid.value = yesterday.isValid() === false || yesterday.isAfter(today);

  if (isDateInvalid.value) return unitedStates.forEach((state) => (state.error.value = "none"));

  const duration = dayjs.duration(today.diff(yesterday));

  age.value.years = duration.years();
  age.value.months = duration.months();
  age.value.days = duration.days();
}

function handle_input(state: TimeState, event: InputEvent) {
  age.value = { years: null, months: null, days: null };
  isDateInvalid.value = false;

  state.handle_input(event);
}
</script>

<template>
  <div class="calculator">
    <form @submit.prevent="handle_submit">
      <div class="top">
        <div class="inputs">
          <TimeInput
            label="day"
            placeholder="DD"
            out-of-range-error-message="Must be a valid day"
            @time-input="handle_input"
            :state="day"
            :is-date-invalid="isDateInvalid"
          />
          <TimeInput
            label="month"
            placeholder="MM"
            out-of-range-error-message="Must be a valid month"
            @time-input="handle_input"
            :state="month"
            :is-date-invalid="isDateInvalid"
          />
          <TimeInput
            label="year"
            placeholder="YYYY"
            out-of-range-error-message="Must be in the past"
            @time-input="handle_input"
            :state="year"
            :is-date-invalid="isDateInvalid"
          />
        </div>
        <span v-if="isDateInvalid" class="error">Must be a valid date</span>
      </div>
      <div class="bottom">
        <span></span>
        <ArrowButton />
      </div>
    </form>
    <div class="time-slices">
      <TimeSlice name="years" :target="age.years" :milli-seconds="animationDuration" />
      <TimeSlice name="months" :target="age.months" :milli-seconds="animationDuration" />
      <TimeSlice name="days" :target="age.days" :milli-seconds="animationDuration" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/scss/text_presets";
@use "@/scss/semantics";
@use "@/scss/variables";

.calculator {
  background: white;
  padding: 3.5rem;
  border-radius: 1.5rem;
  border-bottom-right-radius: 8.33rem;

  form {
    display: flex;
    flex-direction: column;

    .top {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .inputs {
        display: flex;
        gap: 2rem;
        position: relative;
      }

      .error {
        @include semantics.error;
      }
    }

    .bottom {
      display: flex;
      align-items: center;

      span {
        background: var(--grey-200);
        width: 39.5rem;
        height: 1px;
      }
    }
  }

  @media (max-width: variables.$break-point-tablet) {
    form {
      .bottom {
        display: grid;
        grid-template-areas: "stack";

        & > * {
          grid-area: stack;
        }

        span {
          width: 100%;
        }

        button {
          margin: 2rem;
          place-self: center;
        }
      }
    }
  }

  @media (max-width: variables.$break-point-mobile) {
    padding: 3rem 1.5rem;
    border-bottom-right-radius: 6.25rem;

    form {
      .top {
        .inputs {
          gap: 1rem;
        }

        .error {
          width: 5.5rem;
        }
      }
    }
  }
}
</style>
