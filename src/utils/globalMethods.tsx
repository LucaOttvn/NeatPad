import { gsap } from "gsap";
import { Folder, ModalsNames, Note } from "./interfaces";
import { foldersToShow, isMobile, notesToShow, selectedFolder, selectedModal, selectedNote } from "./signals";
import { db } from "./db";

let modalAnimation: gsap.core.Tween | undefined

export function handleModal(
  target: ModalsNames | undefined,
  callback?: () => void
) {
  // avoid triggering multiple animations when the user rapidly clicks on buttons
  if (modalAnimation && modalAnimation.isActive()) return

  const openingModal = target != undefined
  const animationEase = {
    direction: openingModal ? 'out' : 'in',
    // on desktops the effect is a bit less visible, so set a bigger depth
    depth: isMobile.value ? 0.7 : 1
  }

  // prevent the user from scrolling the body when a modal is open
  gsap.set('body', {
    overflowY: openingModal ? 'hidden' : ''
  })

  // if target is undefined close the generalBackdrop that stays behind each modal, in this way every modal in the app gets closed even without having a specific id to point at
  modalAnimation = gsap.to((target ? "#" : '.') + (target || 'generalModalBackdrop'), {
    scale: openingModal ? 1 : 0,
    duration: openingModal ? 0.3 : 0.4,
    bottom: openingModal ? 0 : '-100%',
    ease: `back.${animationEase.direction}(${animationEase.depth})`,
    delay: 0.1,
    onComplete: () => {
      if (callback) callback()
      if (target == undefined) selectedModal.value = undefined
    }
  });
}

export function handleSideMenu(target: string | undefined, isMobile: boolean) {
  gsap.to((target ? "#" : '.') + (target || 'generalSideMenu'), {
    width: target ? (isMobile ? '100%' : '35vw') : 0,
    duration: 0.3,
    ease: 'power4.out'
  });
}

/**
 * this method is used to smoothly unmount the note cards selected to be deleted  
 div animation on onMount function, it accepts a callback onComplete that will be triggered after the animation  
 the goal is making the card disappear and then calling the actual callback to delete the card from the db, since immediately removing the card from the db would make it snap away without any animation instead
 * @param ids 
 * @param onComplete 
 */
export function animateDivUnmount(ids: string[], onComplete: () => void) {

  // this is a timeline because it can happen to animate more than one div at the same time, so wait for the whole timeline to be completed and then trigger the onComplete()
  const tl = gsap.timeline({ onComplete });

  ids.forEach((id) => {
    tl.to("#" + id, {
      opacity: 0,
      duration: 0.2,
      ease: 'power4.out'
    }, 0); // all animations start at the same time
  });
}

interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): EmailValidationResult {
  // regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address.",
    };
  }

  return {
    isValid: true,
  };
}

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * password policy: 
minimum length: 8, 1 upper case, 1 lower case, 1 number, 1 special character
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const minLength = 8;

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long.`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

export function isEncrypted(text: string): boolean {
  const parts = text.split(':');
  if (parts.length !== 2) {
    return false;
  }
  const [ivHex, encryptedDataHex] = parts;

  // Check if IV part is 32 hex characters long
  if (!/^[0-9a-fA-F]{32}$/.test(ivHex)) {
    return false;
  }

  // Check if encrypted data part contains only hex characters
  if (!/^[0-9a-fA-F]+$/.test(encryptedDataHex)) {
    return false;
  }

  return true;
}

/**
 * whenever the note editor closes, if the note's title and text are empty, delete it
 */
export const handleNoteEditorClose = async () => {

  const currentNote = (await db.notes.toArray()).find((note) => note.id === selectedNote.value)

  if (!currentNote) return

  // if note's title and text are empty, delete it
  if (currentNote.title === '' && currentNote.text === '') {
    // notes.value = notes.value.filter(note => note.id != currentNote?.id)
    // add the note's id to the tombstones list
    await db.notesTombstones.put(currentNote)
  }
}

/**
 * whenever the db.notes local table gets updated:
 * 1) filter them by selected folder
 * 2) sort them by last_update
 * 3) update notesToShow.value
 * @param notes 
 */
export const updateNotesToShow = (notes: Note[]) => {
  let updatedNotes: Note[] = notes
  // if there's a selected folder, filter the notes by it, otherwise show them all
  if (selectedFolder.value) {
    updatedNotes = notes.filter(note => note.folders.some(el => el == selectedFolder.value))
  }
  updatedNotes.sort((a: Note, b: Note) => new Date(b.last_update).getTime() - new Date(a.last_update).getTime())
  notesToShow.value = updatedNotes
}

/**
 * whenever the db.folders local table gets updated:
 * 1) alphabetically sort them
 * 2) update foldersToShow.value
 * @param foldersInput  
 */
export const updateFolders = (foldersInput: Folder[]) => {
  const sortedFolders = foldersInput.sort((a, b) => a.name.localeCompare(b.name));
  foldersToShow.value = sortedFolders
}