import { gsap } from "gsap";
import { ModalsNames } from "./interfaces";
import { isMobile, notes, selectedModal, selectedNote } from "./signals";
import { deleteNote } from "@/serverActions/notesActions";

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
    filter: target ? "" : "brightness(0%)",
    duration: 0.3,
    ease: 'power4.out'
  });
}

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

// password policy: 
// minimum length: 8, 1 upper case, 1 lower case, 1 number, 1 special character
interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

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

// this method handles the note's saving and, if it's empty, it deletes it
export async function handleNoteEditorClose() {

  const currentNote = notes.value.find((note) => note.id == selectedNote.value)

  if (!currentNote) return
  // if note's title and text are empty, delete it
  if (currentNote.title === '' && currentNote.text === '') {
    notes.value = notes.value.filter(note => note.id != currentNote?.id)
    // delete the note from db
    deleteNote(currentNote.id!)
  }
}