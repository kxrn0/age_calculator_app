The "input" I'll refer to in this case is the component the user enters numbers into.

When we add a regular HTML `<input />` element to a part of our app we know the element itself doesn't own its value. It kind of does, as if the input is of text type, and we declare a `max` attribute, we add a `maxlength` attribute, it won't let us write more than the number of characters we set that attribute to, however when we have an input element we know some other ancestor will be making use of that input.

Likewise, our input component should share state with its parent. We can define a custom `v-model` to make things more smooth.

We'll cram the labels and error messages into this component, maybe it could be broken down further, but I won't do that here.

The component needs a label, placeholder, error message, and a way to trigger the error message as props. That last one is because while we can handle the day and month input by making sure the value is in a given range, the year input has to check that the inputted year is in the past, which requires checking what the current year is, and comparing it to the inputted value. While it's unlikely that the app may stay open for several years for this to be an issue, it wouldn't be terribly difficult to patch this.

From the design it looks like the user can enter things like `"09"`, so I can't just have a number variable and call it a day, I should let the user enter a string and I'd be managing a number in the background... or should I? I can enter strings like "023" in regular input fields already, so maybe not.

There are still some issues. If I type a string like "input" in firefox I can see the string in the input, but if I log the input's value it logs the empty string. Chrome doesn't let me enter regular strings, but I can enter things like "0e-", firefox as well, and both log an empty string, but if I form a value in valid scientific notation like "2e3" they both log that exact same string, which the number constructor parses as the actual value of 2000.

I need to understand how to handle errors properly. I have a reactive value in the parent, say `day`, which is initially set to zero. I bind it to the `<TimeInput />` component with `v-model`. The `<TimeInput />` component takes a callback to check if the input value is valid, if it's not an error message is displayed. How can the input value be invalid? if the callback returns false when evaluated on the parsed value of the input element, then the input value is invalid, however the user can enter random strings in firefox and half finished numbers in scientific notation, which the browser converts to the empty string, but I can't set the error message to true when I detect an empty string as deleting a valid value competely also registers as an empty string, and I don't want to show an error when the user clears a field; only when they attempt to calculate with an empty field. I have no way of knowing if the empty string I get is because the input is invalid, or because the user deleted a valid input... or do I? Can I use the javaScript validation API to fix this?

I want to show two errors; one immediately after the user enters an invalid value, like 13 for the month, or "1e-". The other error is for when the user attempts to submit the form with an empty field.

I think I should lift more state to the parent element, and by more state I mean the error status.

I could try having a composable that is declared in the parent and passed down to the input component.

The composable creates the state that is shared between the parent and the input. What would that state be? I need a numeric value for time, and two other reactives, both for error stuff.

I have lifted the state, and now it lives between the parent and the child, but the isse about not being able to tell between the user clearing the input, or giving malformed values still remains.

---

I'm enabling the error when the user enters a malformed input, in firefox is any string with anything other than numbers, for example "123a", or "hfkjdsa", and in chrome is a malformed attempt at scientific notation like "3e", or "2-e3". Whenever there's such input the input element's value is the empty string, so I can't reliably display an error message because I don't want to show an error on an empty input field before the user attempts to calculate age. Such error message is set by the parent when the form is submitted. I can just not display an error when the user enters malformed input, and wait until the form is submitted to check for missing values. I'd need to manually set the value of the input element to the empty string to clear up any malformed input. There's already a type of error I can handle, and that is the validation callback prop returning false when evaluated to the cast value of the input's value.

How should this be handled then? When the user enters something we first check if it's the empty string, this means that it's either the empty string, or a malformed input. I feel like I should set the `inputValue` to `null` in this case for clarity. Assuming the input is empty, we set `inputValue` to `null`. If the value is not empty, then it ought to be a number, which we cast to a number. If the value is outside of the allowed range, we enable the range error. Regardless, we set the value of `inputValue` to this cast value in either case.

What if the user enters a decimal number? According to stack overflow we can just do things like this

```html
<input type="number" onkeydown="if (event.key === '.') event.preventDefault();" />
```

it's the first time I hear we can have js expressions instead of callbacks in event handlers, and that's probably a good thing. I can use something like that to prevent the user from entering a decimal number.

Thus, before the form is submitted we only check if the value entered is outside of the allowed range.

When the form is submitted we first check for any missing values, if there are any we set the `missingError` to true in those inputs and stop here.

If all fields are filled, then we then check if the date is valid, if it is not valid we remove the invalid range errors from any fields that have them, and set the form's invalid date error to true.

When the user types in an input in a form with an invalid date error we remove the error from the form.

When the user types in an input with an empty error, we remove the error.

There are three states for the error of an input; `"none" | "out-of-range" | "empty"`.

---

I need to clean up the calculator component. I don't think there should be that much raw code in a component, I should try to move some of it to other files.
