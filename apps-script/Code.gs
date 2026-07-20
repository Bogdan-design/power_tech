/**
 * POWER TECH — Candidate form backend (Google Apps Script Web App).
 *
 * Receives candidate submissions from https://www.powertech.net.pl/candidate
 * and writes them into the EXISTING Google Sheet, tab "Candidates".
 *
 * Setup (see README-candidate.md):
 *   1. Open the existing spreadsheet → Extensions → Apps Script.
 *   2. Paste this file, set SPREADSHEET_ID below.
 *   3. Deploy → New deployment → type "Web app":
 *        Execute as:  Me
 *        Who has access:  Anyone
 *   4. Copy the /exec URL into the frontend (VITE_CANDIDATE_ENDPOINT or config.ts).
 *
 * This script only ever touches the "Candidates" tab. It never reads, edits,
 * or deletes any other tab, and it never creates a new spreadsheet.
 */

/* ======================= CONFIG ======================= */

// ID of the EXISTING spreadsheet (from its URL: /spreadsheets/d/<THIS>/edit).
var SPREADSHEET_ID = '1QZBmOgRyeTBzpFcfHUo-OltMJybjIxmyApWQX3G340Q';

var SHEET_NAME = 'Candidates';

var HEADERS = [
  'Candidate ID',
  'First Application',
  'Last Application',
  'Application Count',
  'First Name',
  'Last Name',
  'Age',
  'Specialty Code',
  'Specialty',
  'Other Specialty',
  'Experience Code',
  'Experience',
  'Experience Details',
  'Current Country',
  'Current City',
  'Document Codes',
  'Documents',
  'Other Documents',
  'Primary Phone',
  'WhatsApp',
  'Telegram',
  'Email',
  'Availability Code',
  'Availability',
  'Desired Country Codes',
  'Desired Countries',
  'Form Language',
  'Source',
  'Campaign',
  'Status',
  'Assigned To',
  'Next Contact Date',
  'Manager Comment',
];

// 1-based column indexes (must match HEADERS order).
var COL = {
  candidateId: 1,
  firstApplication: 2,
  lastApplication: 3,
  applicationCount: 4,
  firstName: 5,
  lastName: 6,
  age: 7,
  specialtyCode: 8,
  specialty: 9,
  otherSpecialty: 10,
  experienceCode: 11,
  experience: 12,
  experienceDetails: 13,
  currentCountry: 14,
  currentCity: 15,
  documentCodes: 16,
  documents: 17,
  otherDocuments: 18,
  primaryPhone: 19,
  whatsapp: 20,
  telegram: 21,
  email: 22,
  availabilityCode: 23,
  availability: 24,
  desiredCountryCodes: 25,
  desiredCountries: 26,
  formLanguage: 27,
  source: 28,
  campaign: 29,
  status: 30,
  assignedTo: 31,
  nextContactDate: 32,
  managerComment: 33,
};

// Manager-owned columns that must NEVER be overwritten on a duplicate update.
var MANAGER_COLS = [COL.status, COL.assignedTo, COL.nextContactDate, COL.managerComment];

// Columns written as plain text (number format '@'). This preserves the leading
// "+" in phones and the leading "@" in Telegram usernames (Sheets would
// otherwise treat them as formulas), and neutralizes formula/CSV injection from
// free-text fields.
var TEXT_COLS = [
  COL.candidateId, COL.firstName, COL.lastName, COL.age,
  COL.specialtyCode, COL.specialty, COL.otherSpecialty,
  COL.experienceCode, COL.experience, COL.experienceDetails,
  COL.currentCountry, COL.currentCity,
  COL.documentCodes, COL.documents, COL.otherDocuments,
  COL.primaryPhone, COL.whatsapp, COL.telegram, COL.email,
  COL.availabilityCode, COL.availability,
  COL.desiredCountryCodes, COL.desiredCountries,
  COL.formLanguage, COL.source, COL.campaign, COL.status,
];

/* --- code → stable English text maps (keep in sync with src/candidate/i18n.ts) --- */
var LABELS = {
  specialty: {
    electrician: 'Electrician',
    electrician_helper: 'Electrician helper',
    plumber: 'Plumber',
    ventilation_installer: 'Ventilation installer',
    painter: 'Painter',
    drywall_installer: 'Drywall installer',
    tiler: 'Tiler',
    general_worker: 'General worker',
    other: 'Other',
  },
  experience: {
    none: 'No experience',
    lt_1: 'Up to 1 year',
    '1_3': '1–3 years',
    '3_5': '3–5 years',
    gt_5: 'More than 5 years',
  },
  document: {
    passport_ua: 'Ukraine passport',
    pesel_ukr: 'PESEL UKR',
    karta_pobytu: 'Residence card (karta pobytu)',
    pl_work_visa: 'Polish work visa',
    eu_citizenship: 'EU citizenship',
    other: 'Other documents',
    none: 'No documents for working in the EU',
  },
  availability: {
    now: 'Right now',
    within_week: 'Within a week',
    within_month: 'Within a month',
    later: 'Later',
  },
  country: {
    poland: 'Poland',
    germany: 'Germany',
    netherlands: 'Netherlands',
    belgium: 'Belgium',
    other: 'Other',
  },
};

var LIMITS = {
  name: 60,
  city: 80,
  country: 80,
  experienceDetails: 500,
  otherSpecialty: 120,
  otherDocuments: 200,
  email: 120,
  phone: 32,
  telegram: 64,
  freeText: 120,
};

/* ======================= ENTRY POINTS ======================= */

function doGet() {
  return json({ ok: true, service: 'powertech-candidate', status: 'up' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // serialize writes to avoid dedupe race conditions
  } catch (err) {
    return json({ ok: false, error: 'busy' });
  }
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    // Honeypot: pretend success, write nothing.
    if (body.website && String(body.website).trim() !== '') {
      return json({ ok: true, duplicate: false, ignored: true });
    }

    var clean = sanitize(body);
    var validationError = validate(clean);
    if (validationError) {
      return json({ ok: false, error: validationError });
    }

    var sheet = getOrCreateSheet();
    var result = upsertCandidate(sheet, clean);
    return json({ ok: true, duplicate: result.duplicate, candidateId: result.candidateId });
  } catch (err) {
    // Do NOT log personal data — only the error message.
    Logger.log('doPost error: ' + (err && err.message ? err.message : err));
    return json({ ok: false, error: 'server_error' });
  } finally {
    lock.releaseLock();
  }
}

/* ======================= SANITIZE / VALIDATE ======================= */

function sanitize(b) {
  return {
    firstName: tidyName(str(b.firstName, LIMITS.name)),
    lastName: tidyName(str(b.lastName, LIMITS.name)),
    age: digits(str(b.age, 3)),
    specialtyCode: code(b.specialtyCode),
    otherSpecialty: str(b.otherSpecialty, LIMITS.otherSpecialty),
    experienceCode: code(b.experienceCode),
    experienceDetails: str(b.experienceDetails, LIMITS.experienceDetails),
    currentCountry: str(b.currentCountry, LIMITS.country),
    currentCity: str(b.currentCity, LIMITS.city),
    documentCodes: codeArray(b.documentCodes),
    otherDocuments: str(b.otherDocuments, LIMITS.otherDocuments),
    primaryPhone: normalizePhone(str(b.primaryPhone, LIMITS.phone)),
    whatsapp: normalizePhone(str(b.whatsapp, LIMITS.phone)),
    telegram: normalizeTelegram(str(b.telegram, LIMITS.telegram)),
    email: str(b.email, LIMITS.email),
    availabilityCode: code(b.availabilityCode),
    desiredCountryCodes: codeArray(b.desiredCountryCodes),
    formLanguage: b.formLanguage === 'RU' ? 'RU' : 'UK',
    source: str(b.source, LIMITS.freeText),
    campaign: str(b.campaign, LIMITS.freeText),
  };
}

function validate(c) {
  if (!isValidName(c.firstName)) return 'invalid_first_name';
  if (!isValidName(c.lastName)) return 'invalid_last_name';
  if (c.age && !isValidAge(c.age)) return 'invalid_age';
  if (!c.specialtyCode || !LABELS.specialty[c.specialtyCode]) return 'invalid_specialty';
  if (c.specialtyCode === 'other' && !c.otherSpecialty) return 'missing_other_specialty';
  if (!c.currentCountry) return 'missing_country';
  if (!c.currentCity) return 'missing_city';
  if (!isValidPhone(c.primaryPhone)) return 'invalid_phone';
  if (c.email && !isValidEmail(c.email)) return 'invalid_email';
  return null;
}

/* ---- validation primitives (mirror src/candidate/validation.ts) ---- */

var NAME_ALLOWED = /^[\p{Script=Latin}\p{Mark} '’\-]+$/u;
var HAS_LATIN = /\p{Script=Latin}/u;

function isValidName(s) {
  if (!s || s.length < 2 || s.length > LIMITS.name) return false;
  return NAME_ALLOWED.test(s) && HAS_LATIN.test(s);
}

function isValidPhone(s) {
  return /^\+\d{8,15}$/.test(s);
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= LIMITS.email;
}

function isValidAge(s) {
  if (!/^\d{1,3}$/.test(s)) return false;
  var n = parseInt(s, 10);
  return n >= 18 && n <= 75;
}

/* ---- normalization helpers ---- */

function str(v, max) {
  var s = (v === null || v === undefined) ? '' : String(v);
  s = s.replace(/\s+/g, ' ').trim();
  if (max && s.length > max) s = s.substring(0, max);
  return s;
}

function digits(v) {
  return String(v || '').replace(/\D/g, '');
}

function code(v) {
  return String(v || '').replace(/[^a-z0-9_]/gi, '').toLowerCase();
}

function codeArray(v) {
  if (!v) return [];
  var arr = Array.isArray(v) ? v : [v];
  var out = [];
  for (var i = 0; i < arr.length && i < 20; i++) {
    var c = code(arr[i]);
    if (c) out.push(c);
  }
  return out;
}

function tidyName(s) {
  if (!s) return '';
  return s.replace(/(^|[ '’\-])(\p{Script=Latin})/gu, function (_m, sep, letter) {
    return sep + letter.toUpperCase();
  });
}

function normalizePhone(s) {
  if (!s) return '';
  var hadPlus = s.charAt(0) === '+';
  var d = s.replace(/\D/g, '');
  return (hadPlus ? '+' : '') + d;
}

function normalizeTelegram(s) {
  if (!s) return '';
  if (s.charAt(0) === '@') {
    var uname = s.replace(/[^A-Za-z0-9_@]/g, '');
    return uname.substring(0, LIMITS.telegram);
  }
  return normalizePhone(s);
}

function labelsFor(map, codes) {
  var out = [];
  for (var i = 0; i < codes.length; i++) {
    out.push(map[codes[i]] || codes[i]);
  }
  return out;
}

/* ======================= SHEET ======================= */

function getOrCreateSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    writeHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    writeHeaders(sheet);
  }
  return sheet;
}

function writeHeaders(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  var header = sheet.getRange(1, 1, 1, HEADERS.length);
  header
    .setFontWeight('bold')
    .setBackground('#0b0e14')
    .setFontColor('#f59e0b')
    .setVerticalAlignment('middle');
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 30);
}

/**
 * Insert a new candidate, or update an existing one matched by normalized
 * primary phone. Manager-owned columns are preserved on update.
 */
function upsertCandidate(sheet, c) {
  var now = new Date();
  var specialtyText =
    c.specialtyCode === 'other' ? (c.otherSpecialty || 'Other') : (LABELS.specialty[c.specialtyCode] || '');
  var experienceText = c.experienceCode ? (LABELS.experience[c.experienceCode] || '') : '';
  var documentsText = labelsFor(LABELS.document, c.documentCodes).join(', ');
  var availabilityText = c.availabilityCode ? (LABELS.availability[c.availabilityCode] || '') : '';
  var countriesText = labelsFor(LABELS.country, c.desiredCountryCodes).join(', ');

  var existingRow = findRowByPhone(sheet, c.primaryPhone);

  if (existingRow > 0) {
    // Update questionnaire + contact data; keep First Application, bump count,
    // set Last Application; do NOT touch manager columns.
    var prevCount = Number(sheet.getRange(existingRow, COL.applicationCount).getValue()) || 1;
    var updates = [
      [COL.lastApplication, now],
      [COL.applicationCount, prevCount + 1],
      [COL.firstName, c.firstName],
      [COL.lastName, c.lastName],
      [COL.age, c.age],
      [COL.specialtyCode, c.specialtyCode],
      [COL.specialty, specialtyText],
      [COL.otherSpecialty, c.specialtyCode === 'other' ? c.otherSpecialty : ''],
      [COL.experienceCode, c.experienceCode],
      [COL.experience, experienceText],
      [COL.experienceDetails, c.experienceDetails],
      [COL.currentCountry, c.currentCountry],
      [COL.currentCity, c.currentCity],
      [COL.documentCodes, c.documentCodes.join(', ')],
      [COL.documents, documentsText],
      [COL.otherDocuments, c.documentCodes.indexOf('other') >= 0 ? c.otherDocuments : ''],
      [COL.primaryPhone, c.primaryPhone],
      [COL.whatsapp, c.whatsapp],
      [COL.telegram, c.telegram],
      [COL.email, c.email],
      [COL.availabilityCode, c.availabilityCode],
      [COL.availability, availabilityText],
      [COL.desiredCountryCodes, c.desiredCountryCodes.join(', ')],
      [COL.desiredCountries, countriesText],
      [COL.formLanguage, c.formLanguage],
      [COL.source, c.source],
      [COL.campaign, c.campaign],
    ];
    for (var i = 0; i < updates.length; i++) {
      if (MANAGER_COLS.indexOf(updates[i][0]) >= 0) continue; // safety
      writeCell(sheet, existingRow, updates[i][0], updates[i][1]);
    }
    var existingId = sheet.getRange(existingRow, COL.candidateId).getValue();
    return { duplicate: true, candidateId: existingId };
  }

  // New candidate — append a full row.
  var candidateId = 'C-' + Utilities.formatDate(now, 'Etc/GMT', 'yyyyMMdd') + '-' +
    ('000' + Math.floor(Math.random() * 100000).toString(36)).slice(-5).toUpperCase();

  var row = new Array(HEADERS.length).fill('');
  row[COL.candidateId - 1] = candidateId;
  row[COL.firstApplication - 1] = now;
  row[COL.lastApplication - 1] = now;
  row[COL.applicationCount - 1] = 1;
  row[COL.firstName - 1] = c.firstName;
  row[COL.lastName - 1] = c.lastName;
  row[COL.age - 1] = c.age;
  row[COL.specialtyCode - 1] = c.specialtyCode;
  row[COL.specialty - 1] = specialtyText;
  row[COL.otherSpecialty - 1] = c.specialtyCode === 'other' ? c.otherSpecialty : '';
  row[COL.experienceCode - 1] = c.experienceCode;
  row[COL.experience - 1] = experienceText;
  row[COL.experienceDetails - 1] = c.experienceDetails;
  row[COL.currentCountry - 1] = c.currentCountry;
  row[COL.currentCity - 1] = c.currentCity;
  row[COL.documentCodes - 1] = c.documentCodes.join(', ');
  row[COL.documents - 1] = documentsText;
  row[COL.otherDocuments - 1] = c.documentCodes.indexOf('other') >= 0 ? c.otherDocuments : '';
  row[COL.primaryPhone - 1] = c.primaryPhone;
  row[COL.whatsapp - 1] = c.whatsapp;
  row[COL.telegram - 1] = c.telegram;
  row[COL.email - 1] = c.email;
  row[COL.availabilityCode - 1] = c.availabilityCode;
  row[COL.availability - 1] = availabilityText;
  row[COL.desiredCountryCodes - 1] = c.desiredCountryCodes.join(', ');
  row[COL.desiredCountries - 1] = countriesText;
  row[COL.formLanguage - 1] = c.formLanguage;
  row[COL.source - 1] = c.source;
  row[COL.campaign - 1] = c.campaign;
  row[COL.status - 1] = 'New';
  // Assigned To / Next Contact Date / Manager Comment left blank for the team.

  sheet.appendRow(row);
  // Re-write text columns of the new row as plain text so leading "+"/"@" and
  // any formula-like input are preserved literally (Sheets would otherwise
  // evaluate them). This also keeps phone dedup reliable.
  var newRow = sheet.getLastRow();
  for (var j = 0; j < TEXT_COLS.length; j++) {
    writeCell(sheet, newRow, TEXT_COLS[j], row[TEXT_COLS[j] - 1]);
  }
  return { duplicate: false, candidateId: candidateId };
}

/** Write a value; text columns get plain-text number format applied first. */
function writeCell(sheet, row, col, value) {
  var cell = sheet.getRange(row, col);
  if (TEXT_COLS.indexOf(col) >= 0) {
    cell.setNumberFormat('@');
  }
  cell.setValue(value);
}

/** Compare phones by their digits only, so "+48 000" and "48000" match. */
function phoneDigits(v) {
  return String(v === null || v === undefined ? '' : v).replace(/\D/g, '');
}

function findRowByPhone(sheet, phone) {
  var wanted = phoneDigits(phone);
  if (!wanted) return -1;
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var values = sheet.getRange(2, COL.primaryPhone, last - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (phoneDigits(values[i][0]) === wanted) {
      return i + 2; // account for header + 0-based
    }
  }
  return -1;
}

/* ======================= UTIL ======================= */

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
