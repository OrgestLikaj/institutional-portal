/**
 * Contact form validation shared by the browser (instant feedback) and the
 * API route (authoritative check). Returns dictionary keys, not messages, so
 * each side renders errors in the active language.
 */
export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  /** honeypot — must stay empty */
  website?: string;
};

export type ContactErrorKey =
  | "nameRequired"
  | "nameShort"
  | "emailRequired"
  | "emailInvalid"
  | "subjectRequired"
  | "messageRequired"
  | "messageShort"
  | "consentRequired";

export type ContactErrors = Partial<Record<keyof ContactInput, ContactErrorKey>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = { name: 120, email: 160, subject: 160, message: 5000 };

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) errors.name = "nameRequired";
  else if (name.length < 3) errors.name = "nameShort";

  if (!email) errors.email = "emailRequired";
  else if (!EMAIL.test(email) || email.length > LIMITS.email) errors.email = "emailInvalid";

  if (!input.subject.trim()) errors.subject = "subjectRequired";

  if (!message) errors.message = "messageRequired";
  else if (message.length < 20) errors.message = "messageShort";

  if (!input.consent) errors.consent = "consentRequired";

  return errors;
}
