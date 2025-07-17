import { gsap, Power4 } from "gsap";
import { ModalsNames, Note } from "./interfaces";

export function handleModal(
  target: ModalsNames | undefined,
) {
  // if target is undefined close the generalBackdrop that stays behind each modal, in this way every modal in the app gets closed even without having a specific id to point at
  gsap.to((target ? "#" : '.') + (target || 'generalModalBackdrop'), {
    scale: target != undefined ? 1 : 0,
    duration: 0.2,
    ease: Power4.easeOut,
  });
}

export function handleSideMenu(target: string | undefined, isMobile: boolean) {
  gsap.to((target ? "#" : '.') + (target || 'generalSideMenu'), {
    width: target ? (isMobile ? '100%' : '35vw') : 0,
    duration: 0.2,
    ease: Power4.easeOut,
  });
}

export function animateDivUnmount(ids: string[], onComplete: () => void) {

  // this is a timeline because it can happen to animate more than one div at the same time, so wait for the whole timeline to be completed and then trigger the onComplete()
  const tl = gsap.timeline({ onComplete });

  ids.forEach((id) => {
    tl.to("#" + id, {
      opacity: 0,
      duration: 0.2,
      ease: Power4.easeOut
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