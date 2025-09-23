```
 █▄ █ ██▀ ▄▀▄ ▀█▀ █▀▄ ▄▀▄ █▀▄
 █ ▀█ █▄▄ █▀█  █  █▀  █▀█ █▄▀
```
A neat approach to note-taking

 - [Features](#features)
 - [About](#about)
 - [Run the project](#run-the-project)
 - [Capacitor integration](#capacitor-integration)
 - [Project details](#project-details)
   - [Recover password page](#recover-password-page)
   - [API folder](#api-folder)
   - [Remote syncronization logic](#remote-syncronization-logic)
   - [Remote sync process](#remote-sync-process)
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

### Remote sync process
There are some specific cases where the simple update of a note isn't enough. The two main examples of this happen when:  
- The same user updates the same note from two different devices (or browser tabs):  
   1) The user updates its local version on device 1 while the same note is open on the device 2
   2) The remote version of the note in the database is updated with the latest version from device 1
   3) Device 2, however, has not fetched the new remote version yet but is still displaying the old one(check [Why not real-time?](#why-not-real-time))
   4) The user then updates the local version on device 2. In this scenario there would be a problem, since the note's text is fully saved on each update, the changes from device 1 that are already saved remotely would be overwritten by the latest version from device 2, resulting in data loss.
   5) Therefore when the ```useSyncService``` detects any difference from the remote's version text and the local base version (the local starting point of the user 2 in this example) a **three-way merge** occurs, with the resulting data incorporating changes from both the local and remote versions.

- Two different users update the same shared note: this case is always the same of the first one but more likely to happen, the solution doesn't change though.  

#### Why not real time? 
The app refetches data when the user's focus state on the page changes. I chose this approach instead of a real-time update based on remote database changes, thinking about the most likely uses of the app itself.  
Most of the time, a user will open the app, write or read a note, and close it. For my personal use cases, the other main scenario is keeping a tab open in the browser and reopening it whenever I need to write something.  
It's with this in mind that I decided a real-time approach would have been overkill for the purpose of NeatPad. The app is designed to refetch data based on user focus in a way that avoids redundant API calls just to update content that could be merged afterward anyway.
