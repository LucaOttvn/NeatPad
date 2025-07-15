# NeatPad
A neat approach to note-taking

 - [Features](#features)
 - [About](#about)
 - [Run the project](#run-the-project)
 - [Capacitor integration](#capacitor-integration)
 - [Project details](#project-details)
   - [Recover password page](#recover-password-page)
   - [API folder](#api-folder)
   - [Side effects for DOM signals](#side-effects-for-dom-signals)

## Features
- Notes creation
- Folders to organize notes
- Markdown capabilities
- [Notes encryption](#notes-encryption)
- Shared notes

## About
This is essentially a Google Keep inspired notepad with a little more ahestetic touch (for my personal taste at least).
This app was born from a need of a clean UX free of fancy or confusing extra features. While Google Keep already does a pretty good job I aimed to create something slightly more customized on my personal needs. 

The app is available both in web and mobile version, the latter is made with [Capacitor](https://github.com/ionic-team/capacitor), check [Capacitor integration](#capacitor-integration).

## Run the project
The db in use is Supabase, to connect your own you have to:
1. Create an account on [Supabase](https://supabase.com)
2. Create a .env in the project's root and create these variables:
   * `NEXT_PUBLIC_SUPABASE_URL`: Supabase Dashboard > Project settings > Configuration > Data API > Project URL
   * `NEXT_PUBLIC_SUPABASE_KEY`: Supabase Dashboard > Project settings > API Keys > Copy the "anon" "public" marked key
   * `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard > Project settings > API Keys > Copy the "service role" "secret" marked key
   * `JWT_SECRET`: Supabase Dashboard > Project settings > Configuration > Data API > JWT Settings > Copy the JWT Secret key
3. Create an account on [Resend](https://resend.com)
4. Add in the the .env this `EMAIL_API_KEY`, you can find it in Resend Dashboard > API Keys
5. Run `npm install` & `npm run dev`

## Capacitor integration
The capacitor integration in this project is nothing follows the [Capacitor guide](https://capacitorjs.com/solution/react).  
In the `capacitor.config.ts` you have to put the server url that points to the hosted web version of the app, the original one is: `https://neat-pad.vercel.app/` but it's obviously going to change based on your hosted version's link.

## Project details

### Notes Encryption
Your notes are **encrypted at rest** in the database. This means no one, not even with direct database access, can read their content without logging into the app as the associated user or collaborator. Your data remains private and secure.

### Recover password page
This page is a separate one because it gotta be included in the reset-password email as a link

### API folder
These are pieces of logic that use server side methods that cannot be instantiated in the client components

### Side effects for DOM signals
Some of the signals defined in `signals.ts` file have side effects that directly interact with the DOM. One example of this is the `selectedModal` signal where a [GSAP](https://gsap.com) animation is triggered.
Since the `signals.ts` file it's not part of the components tree, sideEffects like effect(()=>{}) are triggered immediately on the signal's value change; this is a problem because GSAP needs the DOM to be fully updated to perform animations correctly, so putting something like:
```javascript
effect(()=>{
 handleSideMenu(selectedSideMenu.value)
})
```
...would trigger the function immediately, causing problems with the animation itself.
Because of this I put the function's call inside a useLayoutEffect hook in the component to wait for the DOM to be fully mounted and updated before triggering the animation.
