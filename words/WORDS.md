I'll use date-fns to deal with dates. From the requirements, and from looking at the date-fns docs, I see I could use `compareAsc` to check that the provided date is not in the future. But if I get a valid date from the user, wouldn't it be easier to do something like

```js
const userDate = new Date(get_user_date());
const today = new Date();
const isDateInPast = today.valueOf() - userDate.valueOf() > 0;
```

I'll use date-fns for consistency, and I'll use `isBefore` because it's simpler.

I can get the value this whole thing is about with `intervalToDuration` as long as I have two date objects.

I can check if the given value is a valid date with `isValid`... or can I?

This code doesn't work as I'd expect

```js
import { isValid } from "date-fns";

const v1 = new Date();
const v2 = { year: 2020, month: 3, day: 2 };
const v3 = "2020/03/05";

console.log(isValid(v1));
console.log(isValid(v2));
console.log(isValid(v3));
```

only the first value logs true, and perusing the codumentation suggests that there's no other way to check if a date is valid.

Day.js seems to have have this functionality, so I'll replace date-fns with it.

I can get the birth date of the user, I have access to the year, month, and day from three different variables. How do I find their age? Some of the input fields may be empty, so we first check for that, if that's the case, then we return early, as there's nothing to compute.

Assume we have values for year, month and day. The date could still be invalid, so we first have to check that. According to the [codumentation](https://day.js.org/docs/en/parse/is-valid) we can use the `isValid` method for that. We need to make a string of the form `"YYYY/MM/DD"`, or some other, but I'll use a string since that's what the codumentation suggests.

I can make a date object [from an object](https://day.js.org/docs/en/parse/object), and I can [format that date into a string](https://day.js.org/docs/en/display/format), and then I'll check if it's valid... or do I? I don't think I can. If I try to make a date from an invalid object, I'd expect an error to be thrown, or for it to fail silently, and parse it as a different date, so it looks like it may be better to manually build the string.

I have a manufactured string that may or may not be a valid date. I can check if it is. If it's not valid, I set the invalid date error in the form and stop here. If it's valid, I can calculate the age from here.

The year input element checks if the inputted value is a year in the past, and if it's not, it toggles a flag that displays an error, however the user can still submit that date; they can check for a valid date in the future, which shouldn't happen, so the date is invalid if the year is greater or equal to the current one, or if the date doesn't exist.

Assume we have a valid date in the past. To compute the age, we need to check the time duration between that date `yesterday`, and `today`. We can get `today` with `dayjs()`. So far we haven't built `yesterday` yet, only a string literal of the form `"YYYY/MM/DD"`. We can convert this string to a dayjs object [by parsing it](https://day.js.org/docs/en/parse/string-format). We can use the same object we use for validation here like

```js
// rest of the fucking...

const yesterday = dayjs(formattedDateString, "YYYY/MM/DD", true);

if (yesterday.isValid() === false) {
  unitedStates.forEach((state) => (state.error.value = "none"));
  isDateValid.value = false;

  return;
}

const today = dayjs();
```

Thus, we have date objects for `today` and `yesterday`. We can get the age with [difference](https://day.js.org/docs/en/display/difference).

We know the age in milliseconds. We want a duration, not a date, we can't just pass the raw number of milliseconds to `dayjs` and expect our answer to come out.

We can simply use the `dayjs.duration` function for this.

---

I have something that kind of works, but now I'll have to refactor it. The state belongs more to the parent than to the child, and it's a bad practice to mutate parent state from the child; it's better to use events. That's not the only reason I'm doing this. I'm also doing it because is the only way to remove the parent's invalid date error.

I pass down some of the state to the child, and then when there's an input event in the element I listen to it on the parent and handle it appropriately. How will I know which piece of state to update? I may do something like `<TimeInput :time-input="handle_input(day)" />`, so `handle_input` takes in a time slice object. This feels very tangled, there should be a better way. I'll at least make the child pass up the state object that needs to change.

---

I'm almost done, but I'd like to do two things; clean up the code a bit by breaking down long functions, and change how the date is validated. I'll work on the second issue first.

The problem is that currently a year is considered invalid if it's greater than or equal to the current one, so a valid date is considered invalid. I have to change that. I want to make it so that dates are considered valid as long as they are less than the current one, so a date from the same year as the current one would be valid.

I don't think I need to change how `useInputState` works; the callback should only concern itself with getting a value, and it should be able to figure out if the date is valid.

The thing is that the date can be incomplete; the user could have inputted only the day and year, and not the month. When should a year be invalid? when the given year is greater than the current one. If that's the case it's an easy return.

When the given year is equal to the current one then we
have be more granular. If the month is defined, then if it is greater than the current month, we return false, otherwise we return true. It doesn't matter if the day is invalid, someone else will take care of that.

If the month is defined and less or equal to the current one, then if the day is not defined we return true, otherwise we check it against the current day. If the current day is greater or equal to the reactive day we return true, otherwise false.

```
day = useInputState((d: number) => d <= 31)
month = useInputState((m: number) => m <= 12)

validate_year = (year: number) => {
  today = dayjs()
  current = today.year()

  if year > current
    return false
  else if year == current {
    if month.value == 0 return true
    else {
      currentMonth = today.month()

      if month.value > currentMonth return false
      else {
        if day.value == 0 return false
        else {
          currentDay = today.date()

          return day.value < currentDay
        }
      }
    }
  }
  else return true
}

year = useInputState(validate_year)
```

This only works when the year input changes, so I'd have to listen for changes in the day and month fields as well, but that would tangle up state between the input fields. I think a better compromise is to leave the year check as is; only checking if the year is less than or equal to the current one, and then checking that the date is correct when the user submits.
