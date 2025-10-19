import { ref } from "vue";

type InputError = "none" | "out-of-range" | "empty";

export default function useTimeInputState(is_in_range: (n: number) => boolean) {
  const inputValue = ref<number>(0);
  const error = ref<InputError>("none");

  function handle_input(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const castValue = Number(value);

    error.value = "none";

    if (value === "") inputValue.value = 0;
    else {
      inputValue.value = castValue;

      if (is_in_range(castValue) === false) error.value = "out-of-range";
    }
  }

  return {
    inputValue,
    error,
    handle_input,
  };
}
