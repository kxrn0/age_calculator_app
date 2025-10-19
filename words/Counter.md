I want to write an animated counter. This would be a simple component otherwise, however I want it to animate the count from zero. I'll keep it simple and assume the number it animates to is a positive integer, and it increments at integer steps.

What's the most straightforward way of doing this? I want to give the component a target integer and integer number of seconds the animation should run for. I'll use `requestAnimationFrame` to animate things. I want to be able to stop the animation and restart it if the props change, so I'll have to use `watchEffect`.

I need a reactive for the current value to display, and one for the animation id if I want to stop it.

What was the correct way of doing animations in js? The browser will try to call `requestAnimationFrame` 60 times per second, but it could do it at a higher rate on some machines, and it can dip below that on lower end machines, of if there's a heavy workload, that's why the concept of frame rate independence was created; the rate of change of the state is dependent on the time passed, rather than frame rate. We can assume the computer's clock is always exact, regardless of how much work it would take to render a frame, so when calling the animation function we'll always get back a number that tells us how much time has passed since the last call to the animation function.

I want to start animating when the props change, so I can run run the animation function there. I want to map the time passed since the animation started to a value between 0 and the `target`. The timestamp passed to `requestAnimationFrame` is the point in time when the last frame finished rendering, so I need a variable to keep track of this value for the next frame to check how much time has passed.
