/**
 * Candidate form configuration.
 *
 * Everything the operator (business owner) must provide or adjust lives here.
 * NO Google API keys or secrets belong in this file — the Apps Script Web App
 * URL below is a public HTTPS endpoint, not a secret.
 */

/**
 * Google Apps Script Web App endpoint that receives candidate submissions and
 * writes them into the existing Google Sheet (tab "Candidates").
 *
 * Set it either here (replace the placeholder) or via a build-time env var:
 *   VITE_CANDIDATE_ENDPOINT="https://script.google.com/macros/s/XXXX/exec"
 *
 * Until a real endpoint is set the form runs in "dry-run" mode: it validates
 * everything and logs a notice instead of hitting the network.
 */
const ENV_ENDPOINT =
  (typeof import.meta !== 'undefined' &&
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_CANDIDATE_ENDPOINT) ||
  '';

export const CANDIDATE_ENDPOINT: string =
  ENV_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbyM7JCHrgg-d4g7iUJQp_-WpAEKCgHOyh8HRc3AwG4FegdzisJ_dbC1p4ipsEKZgDru/exec';

/** True when a real endpoint has been configured. */
export const HAS_ENDPOINT =
  !!CANDIDATE_ENDPOINT && !CANDIDATE_ENDPOINT.startsWith('REPLACE_WITH_');

/** Final production URL of the form — used only for QR generation / docs. */
export const CANDIDATE_PRODUCTION_URL = 'https://www.powertech.net.pl/candidate';

/**
 * Data controller / privacy details.
 * These are placeholders — replace with the real legal values before launch.
 * They are shown in the consent block and (optionally) linked from it.
 */
export const dataController = {
  name: 'POWER TECH Sp. z o.o.',
  email: 'info@powertech.net.pl',
  address: 'ul. Turkusowa 23A, 05-077 Warszawa, Polska',
  // No privacy policy page yet — leave empty so no dead link is shown.
  // When the page exists, set e.g. 'https://www.powertech.net.pl/privacy'.
  privacyPolicyUrl: '',
};

/** Field length limits (kept in sync with the Apps Script backend). */
export const limits = {
  name: 60,
  city: 80,
  country: 80,
  experienceDetails: 500,
  otherSpecialty: 120,
  otherDocuments: 200,
  email: 120,
  phone: 32,
  telegram: 64,
};

/* ------------------------------------------------------------------ *
 * Option lists. Each option carries a STABLE technical `code` (never
 * translated) plus a translation key used to render the label.
 * The backend stores both the code and the resolved English text.
 * ------------------------------------------------------------------ */

export type Option = { code: string; key: string };

export const specialties: Option[] = [
  { code: 'electrician', key: 'electrician' },
  { code: 'electrician_helper', key: 'electrician_helper' },
  { code: 'plumber', key: 'plumber' },
  { code: 'ventilation_installer', key: 'ventilation_installer' },
  { code: 'painter', key: 'painter' },
  { code: 'drywall_installer', key: 'drywall_installer' },
  { code: 'tiler', key: 'tiler' },
  { code: 'general_worker', key: 'general_worker' },
  { code: 'other', key: 'other' },
];

export const experiences: Option[] = [
  { code: 'none', key: 'exp_none' },
  { code: 'lt_1', key: 'exp_lt_1' },
  { code: '1_3', key: 'exp_1_3' },
  { code: '3_5', key: 'exp_3_5' },
  { code: 'gt_5', key: 'exp_gt_5' },
];

export const documents: Option[] = [
  { code: 'passport_ua', key: 'doc_passport_ua' },
  { code: 'pesel_ukr', key: 'doc_pesel_ukr' },
  { code: 'karta_pobytu', key: 'doc_karta_pobytu' },
  { code: 'pl_work_visa', key: 'doc_pl_work_visa' },
  { code: 'eu_citizenship', key: 'doc_eu_citizenship' },
  { code: 'other', key: 'doc_other' },
  { code: 'none', key: 'doc_none' },
];

export const availabilities: Option[] = [
  { code: 'now', key: 'avail_now' },
  { code: 'within_week', key: 'avail_week' },
  { code: 'within_month', key: 'avail_month' },
  { code: 'later', key: 'avail_later' },
];

export const desiredCountries: Option[] = [
  { code: 'poland', key: 'country_poland' },
  { code: 'germany', key: 'country_germany' },
  { code: 'netherlands', key: 'country_netherlands' },
  { code: 'belgium', key: 'country_belgium' },
  { code: 'other', key: 'country_other' },
];
