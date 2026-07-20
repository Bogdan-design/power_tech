/**
 * Shared client-side validation & normalization.
 * The SAME rules are re-implemented on the backend (apps-script/Code.gs) so
 * that data is never trusted from the browser alone.
 */

import { limits } from './config';

/**
 * Latin-letters-only name validation using Unicode script properties, so
 * Polish and other European Latin letters (ą ć ę ł ń ó ś ź ż, ü ö ä ß, é è ç…)
 * are accepted while Cyrillic, digits and stray symbols are rejected.
 *
 * Allowed: Latin letters (any diacritics), space, apostrophe ' ’, hyphen -.
 */
const NAME_ALLOWED = /^[\p{Script=Latin}\p{Mark} '’\-]+$/u;
const HAS_LATIN_LETTER = /\p{Script=Latin}/u;

/** Collapse whitespace and trim. */
export function normalizeName(raw: string): string {
  return String(raw || '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Gently capitalize the first letter of each space/hyphen/apostrophe-separated
 * part, without forcing the rest to lower-case (keeps e.g. "McLeod", "D'Angelo"
 * reasonable and never mangles intentional casing aggressively).
 */
export function tidyNameCasing(raw: string): string {
  const s = normalizeName(raw);
  if (!s) return s;
  return s.replace(/(^|[ '’\-])(\p{Script=Latin})/gu, (_m, sep, letter) => sep + letter.toUpperCase());
}

export function isValidName(raw: string): boolean {
  const s = normalizeName(raw);
  if (s.length < 2 || s.length > limits.name) return false;
  if (!NAME_ALLOWED.test(s)) return false; // rejects Cyrillic, digits, symbols
  if (!HAS_LATIN_LETTER.test(s)) return false; // must contain at least one Latin letter
  return true;
}

/**
 * Phone: international format, must start with "+", digits (spaces/dashes/parens
 * allowed as separators). Normalized form is "+" followed by 8–15 digits.
 */
export function normalizePhone(raw: string): string {
  let s = String(raw || '').trim();
  if (!s) return '';
  const hadPlus = s.startsWith('+');
  const digits = s.replace(/\D/g, '');
  return (hadPlus ? '+' : '') + digits;
}

export function isValidPhone(raw: string): boolean {
  const n = normalizePhone(raw);
  return /^\+\d{8,15}$/.test(n);
}

/** Telegram: either a phone (+…) or an @username (5–32 chars, letters/digits/_). */
export function isValidTelegram(raw: string): boolean {
  const s = String(raw || '').trim();
  if (!s) return true; // optional
  if (s.startsWith('@')) return /^@[A-Za-z0-9_]{4,32}$/.test(s);
  return isValidPhone(s);
}

/** Normalize a telegram value (phone → normalized phone, else keep @username). */
export function normalizeTelegram(raw: string): string {
  const s = String(raw || '').trim();
  if (!s) return '';
  if (s.startsWith('@')) return s;
  return normalizePhone(s);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(raw: string): boolean {
  const s = String(raw || '').trim();
  if (!s) return true; // optional
  return s.length <= limits.email && EMAIL_RE.test(s);
}

export function isValidAge(raw: string): boolean {
  const s = String(raw ?? '').trim();
  if (!s) return true; // optional
  if (!/^\d{1,3}$/.test(s)) return false;
  const n = Number(s);
  return n >= 18 && n <= 75;
}
