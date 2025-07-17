### A neat approach to note-taking

## Features
- Notes creation
- Folders to organize notes
- Future feature: shared notes

## About
This is essentially a Google Keep inspired notepad with a little more ahestetic touch (for my personal taste at least).
This app was born from a need of a clean UX free of fancy or confusing extra features. While Google Keep already does a pretty good job I aimed to create something slightly more customized on my personal needs. 

The app is available both in web and mobile version, the latter is made with [Capacitor](https://github.com/ionic-team/capacitor).

### Side effects for DOM signals
Some of the signals defined in signals.ts file have side effects that directly interact with the DOM. One example of this is the selectedModal signal where a gsap animation is triggered.
Since the signals.ts file it's not part of the components tree, sideEffects like effect(()=>{}) are triggered immediately on the signal's value change; this is a problem because gsap needs the DOM to be fully updated to perform the animations correctly, so putting something like...
```javascript
effect(()=>{
 handleSideMenu(selectedSideMenu.value)
})
```
...would trigger the function immediately, causing problems with the animation itself.
Because of this I put the function's call inside a useLayoutEffect hook in the component to wait for the DOM to be fully mounted and updated before triggering the animation.
