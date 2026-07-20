import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Zap, Check, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  CANDIDATE_ENDPOINT,
  HAS_ENDPOINT,
  dataController,
  limits,
  specialties,
  experiences,
  documents,
  availabilities,
  desiredCountries,
} from '@/candidate/config';
import { dict, Lang, LANG_STORAGE_KEY } from '@/candidate/i18n';
import {
  isValidAge,
  isValidEmail,
  isValidName,
  isValidPhone,
  isValidTelegram,
  normalizeName,
  normalizePhone,
  normalizeTelegram,
  tidyNameCasing,
} from '@/candidate/validation';

type FormState = {
  firstName: string;
  lastName: string;
  age: string;
  specialtyCode: string;
  otherSpecialty: string;
  experienceCode: string;
  experienceDetails: string;
  currentCountry: string;
  currentCity: string;
  documentCodes: string[];
  otherDocuments: string;
  primaryPhone: string;
  whatsappSame: boolean;
  whatsapp: string;
  telegramSame: boolean;
  telegram: string;
  email: string;
  availabilityCode: string;
  desiredCountryCodes: string[];
  consent: boolean;
  website: string; // honeypot — must stay empty
};

const initialState: FormState = {
  firstName: '',
  lastName: '',
  age: '',
  specialtyCode: '',
  otherSpecialty: '',
  experienceCode: '',
  experienceDetails: '',
  currentCountry: '',
  currentCity: '',
  documentCodes: [],
  otherDocuments: '',
  primaryPhone: '',
  whatsappSame: false,
  whatsapp: '',
  telegramSame: false,
  telegram: '',
  email: '',
  availabilityCode: '',
  desiredCountryCodes: [],
  consent: false,
  website: '',
};

function readInitialLang(): Lang {
  try {
    const url = new URLSearchParams(window.location.search);
    const q = url.get('lang');
    if (q === 'uk' || q === 'ru') return q;
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'uk' || saved === 'ru') return saved;
  } catch {
    /* ignore */
  }
  return 'uk';
}

/* Shared styling — sharp corners, amber focus, matches site identity. */
const fieldBase =
  'w-full border border-slate-700 bg-slate-950/70 px-4 py-3 text-base text-slate-100 placeholder-slate-500 transition-colors duration-200 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400';
const labelBase = 'mb-2 block text-sm font-medium text-slate-200';
const hintBase = 'mt-1.5 text-xs text-slate-400';
const errorBase = 'mt-1.5 flex items-start gap-1.5 text-xs text-red-400';

const CandidatePage = () => {
  const [lang, setLang] = useState<Lang>(readInitialLang);
  const t = dict[lang];

  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const submitLock = useRef(false);

  // Ad params captured once from the URL (never rendered back into the page).
  const adParams = useRef<{ source: string; campaign: string; formUrl: string }>({
    source: '',
    campaign: '',
    formUrl: '',
  });

  useEffect(() => {
    try {
      const url = new URLSearchParams(window.location.search);
      adParams.current = {
        source: (url.get('source') || '').slice(0, 120),
        campaign: (url.get('campaign') || '').slice(0, 120),
        formUrl: window.location.href.split('#')[0],
      };
    } catch {
      /* ignore */
    }
  }, []);

  // Persist language; keep <html lang> and document title in sync.
  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInArray = (key: 'documentCodes' | 'desiredCountryCodes', code: string) => {
    setData((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(code) ? arr.filter((c) => c !== code) : [...arr, code],
      };
    });
  };

  /* ---- validation ---- */
  const validate = (d: FormState): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!isValidName(d.firstName)) e.firstName = t.nameError;
    if (!isValidName(d.lastName)) e.lastName = t.nameError;
    if (!isValidAge(d.age)) e.age = t.ageError;
    if (!d.specialtyCode) e.specialtyCode = t.requiredFieldError;
    if (d.specialtyCode === 'other' && !d.otherSpecialty.trim()) e.otherSpecialty = t.requiredFieldError;
    if (!d.currentCountry.trim()) e.currentCountry = t.requiredFieldError;
    if (!d.currentCity.trim()) e.currentCity = t.requiredFieldError;
    if (d.documentCodes.includes('other') && !d.otherDocuments.trim()) e.otherDocuments = t.requiredFieldError;
    if (!isValidPhone(d.primaryPhone)) e.primaryPhone = t.primaryPhoneError;
    if (!d.whatsappSame && d.whatsapp.trim() && !isValidPhone(d.whatsapp)) e.whatsapp = t.primaryPhoneError;
    if (!d.telegramSame && !isValidTelegram(d.telegram)) e.telegram = t.telegramError;
    if (!isValidEmail(d.email)) e.email = t.emailError;
    if (!d.consent) e.consent = t.consentError;
    return e;
  };

  // Re-run validation live once the user has attempted a submit.
  useEffect(() => {
    if (showErrors) setErrors(validate(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, showErrors, lang]);

  /* ---- progress (required fields) ---- */
  const requiredDone = useMemo(() => {
    let done = 0;
    const total = 6; // firstName, lastName, specialty, country, city, phone (+consent gate)
    if (isValidName(data.firstName)) done++;
    if (isValidName(data.lastName)) done++;
    if (data.specialtyCode && (data.specialtyCode !== 'other' || data.otherSpecialty.trim())) done++;
    if (data.currentCountry.trim()) done++;
    if (data.currentCity.trim()) done++;
    if (isValidPhone(data.primaryPhone)) done++;
    return { done, total };
  }, [data]);
  const progressPct = Math.round((requiredDone.done / requiredDone.total) * 100);

  /* ---- submit ---- */
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitLock.current || status === 'submitting' || status === 'success') return;

    const eMap = validate(data);
    setErrors(eMap);
    setShowErrors(true);
    if (Object.keys(eMap).length > 0) {
      // Focus first invalid field.
      const firstKey = Object.keys(eMap)[0];
      const el = document.getElementById(firstKey);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus?.();
      return;
    }

    // Honeypot: silently succeed for bots without sending anything.
    if (data.website.trim() !== '') {
      setStatus('success');
      return;
    }

    submitLock.current = true;
    setStatus('submitting');
    setSubmitError('');

    const payload = {
      firstName: tidyNameCasing(data.firstName),
      lastName: tidyNameCasing(data.lastName),
      age: data.age.trim(),
      specialtyCode: data.specialtyCode,
      otherSpecialty: data.specialtyCode === 'other' ? data.otherSpecialty.trim().slice(0, limits.otherSpecialty) : '',
      experienceCode: data.experienceCode,
      experienceDetails: data.experienceDetails.trim().slice(0, limits.experienceDetails),
      currentCountry: data.currentCountry.trim().slice(0, limits.country),
      currentCity: data.currentCity.trim().slice(0, limits.city),
      documentCodes: data.documentCodes,
      otherDocuments: data.documentCodes.includes('other')
        ? data.otherDocuments.trim().slice(0, limits.otherDocuments)
        : '',
      primaryPhone: normalizePhone(data.primaryPhone),
      whatsapp: data.whatsappSame ? normalizePhone(data.primaryPhone) : normalizePhone(data.whatsapp),
      telegram: data.telegramSame ? normalizePhone(data.primaryPhone) : normalizeTelegram(data.telegram),
      email: data.email.trim().slice(0, limits.email),
      availabilityCode: data.availabilityCode,
      desiredCountryCodes: data.desiredCountryCodes,
      formLanguage: lang === 'uk' ? 'UK' : 'RU',
      source: adParams.current.source,
      campaign: adParams.current.campaign,
      formUrl: adParams.current.formUrl,
      website: '', // honeypot (already checked empty)
    };

    // Dry-run mode when no endpoint is configured yet.
    if (!HAS_ENDPOINT) {
      // Note: never log personal data. Only a neutral marker.
      // eslint-disable-next-line no-console
      console.info('[candidate] dry-run: endpoint not configured, submission not sent');
      window.setTimeout(() => {
        setStatus('success');
      }, 700);
      return;
    }

    try {
      const res = await fetch(CANDIDATE_ENDPOINT, {
        method: 'POST',
        // text/plain avoids a CORS preflight against the Apps Script endpoint.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });
      let ok = res.ok;
      try {
        const json = await res.json();
        ok = ok && json && json.ok !== false;
      } catch {
        /* non-JSON but 2xx — treat as success */
      }
      if (ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setSubmitError(t.genericError);
        submitLock.current = false;
      }
    } catch {
      setStatus('error');
      setSubmitError(t.networkError);
      submitLock.current = false;
    }
  };

  const resetForm = () => {
    setData(initialState);
    setErrors({});
    setShowErrors(false);
    setStatus('idle');
    setSubmitError('');
    submitLock.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const err = (key: string) =>
    showErrors && errors[key] ? (
      <p id={`${key}-error`} className={errorBase} role="alert">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> <span>{errors[key]}</span>
      </p>
    ) : null;

  const describedBy = (key: string, hintId?: string) => {
    const ids: string[] = [];
    if (hintId) ids.push(hintId);
    if (showErrors && errors[key]) ids.push(`${key}-error`);
    return ids.length ? ids.join(' ') : undefined;
  };

  const invalid = (key: string) => (showErrors && errors[key] ? true : undefined);

  /* ------------------------------------------------------------------ */
  /* Success screen                                                     */
  /* ------------------------------------------------------------------ */
  if (status === 'success') {
    return (
      <>
        <Helmet>
          <html lang={lang} />
          <title>{t.metaTitle}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16">
          <div className="blueprint-grid absolute inset-0 opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.10),transparent_45%)]" />
          <div className="relative z-10 w-full max-w-md border border-slate-800 bg-slate-900/70 p-8 text-center backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-emerald-500/40 bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" strokeWidth={2} />
            </div>
            <h1 className="font-display mb-3 text-2xl font-bold text-white">{t.successTitle}</h1>
            <p className="mb-8 text-slate-300">{t.successBody}</p>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-amber-400 hover:text-amber-300"
            >
              {t.successAgain}
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Form                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t.metaTitle}</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </Helmet>

      <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-20">
        <div className="blueprint-grid absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.10),transparent_45%)]" />

        {/* Top bar: logo + language switch */}
        <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <a href="/" className="group flex items-center gap-3" aria-label="POWER TECH">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-700 bg-slate-950 transition-colors duration-300 group-hover:border-amber-400">
                <Zap className="h-5 w-5 text-amber-400" strokeWidth={2.5} />
              </div>
              <span className="flex flex-col leading-none">
                <span className="font-display text-base font-bold tracking-tight text-white">POWER TECH</span>
                <span className="font-tech text-[10px] uppercase tracking-[0.25em] text-slate-500">{t.brandTag}</span>
              </span>
            </a>

            {/* UA | RU toggle */}
            <div
              className="flex items-center overflow-hidden border border-slate-700"
              role="group"
              aria-label={t.langLabel}
            >
              {(['uk', 'ru'] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`font-tech px-3 py-1.5 text-sm font-semibold uppercase transition-colors ${
                    lang === code
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-transparent text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {code === 'uk' ? 'UA' : 'RU'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Sticky progress bar */}
        <div className="sticky top-0 z-20 h-1 w-full bg-slate-800">
          <div
            className="h-full bg-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t.progressLabel(requiredDone.done, requiredDone.total)}
          />
        </div>

        <main className="relative z-10 mx-auto max-w-2xl px-4 pt-8">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-amber-500" />
              <span className="font-tech text-xs uppercase tracking-[0.3em] text-amber-400">
                {t.brandTag}
              </span>
            </div>
            <h1 className="font-display mb-3 text-3xl font-bold text-white sm:text-4xl">{t.formTitle}</h1>
            <p className="text-slate-300">{t.formDescription}</p>
            <p className="mt-3 text-xs text-slate-500">
              {t.progressLabel(requiredDone.done, requiredDone.total)} · {t.requiredHint}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* Honeypot — visually hidden, off-screen, not announced */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={data.website}
                onChange={(e) => set('website', e.target.value)}
              />
            </div>

            {/* Name */}
            <fieldset className="space-y-5 border border-slate-800 bg-slate-900/50 p-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelBase}>
                    {t.firstName} <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    inputMode="text"
                    autoComplete="given-name"
                    maxLength={limits.name}
                    className={fieldBase}
                    value={data.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    onBlur={() => set('firstName', normalizeName(data.firstName))}
                    aria-required="true"
                    aria-invalid={invalid('firstName')}
                    aria-describedby={describedBy('firstName', 'name-hint')}
                  />
                  {err('firstName')}
                </div>
                <div>
                  <label htmlFor="lastName" className={labelBase}>
                    {t.lastName} <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    inputMode="text"
                    autoComplete="family-name"
                    maxLength={limits.name}
                    className={fieldBase}
                    value={data.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    onBlur={() => set('lastName', normalizeName(data.lastName))}
                    aria-required="true"
                    aria-invalid={invalid('lastName')}
                    aria-describedby={describedBy('lastName', 'name-hint')}
                  />
                  {err('lastName')}
                </div>
              </div>
              <p id="name-hint" className={hintBase}>
                {t.nameHint}
              </p>
            </fieldset>

            {/* Age + specialty + experience */}
            <fieldset className="space-y-5 border border-slate-800 bg-slate-900/50 p-5">
              <div>
                <label htmlFor="age" className={labelBase}>
                  {t.age} <span className="text-slate-500">({t.optional})</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  min={18}
                  max={75}
                  className={`${fieldBase} max-w-[140px]`}
                  value={data.age}
                  onChange={(e) => set('age', e.target.value)}
                  aria-invalid={invalid('age')}
                  aria-describedby={describedBy('age', 'age-hint')}
                />
                <p id="age-hint" className={hintBase}>
                  {t.ageHint}
                </p>
                {err('age')}
              </div>

              <div>
                <label htmlFor="specialtyCode" className={labelBase}>
                  {t.specialty} <span className="text-amber-400">*</span>
                </label>
                <select
                  id="specialtyCode"
                  name="specialtyCode"
                  className={fieldBase}
                  value={data.specialtyCode}
                  onChange={(e) => set('specialtyCode', e.target.value)}
                  aria-required="true"
                  aria-invalid={invalid('specialtyCode')}
                  aria-describedby={describedBy('specialtyCode')}
                >
                  <option value="" disabled>
                    {t.specialtyPlaceholder}
                  </option>
                  {specialties.map((o) => (
                    <option key={o.code} value={o.code}>
                      {t.o[o.key]}
                    </option>
                  ))}
                </select>
                {err('specialtyCode')}
                {data.specialtyCode === 'other' && (
                  <div className="mt-3">
                    <label htmlFor="otherSpecialty" className="sr-only">
                      {t.otherSpecialty}
                    </label>
                    <input
                      id="otherSpecialty"
                      name="otherSpecialty"
                      type="text"
                      maxLength={limits.otherSpecialty}
                      placeholder={t.otherSpecialtyPlaceholder}
                      className={fieldBase}
                      value={data.otherSpecialty}
                      onChange={(e) => set('otherSpecialty', e.target.value)}
                      aria-invalid={invalid('otherSpecialty')}
                      aria-describedby={describedBy('otherSpecialty')}
                    />
                    {err('otherSpecialty')}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="experienceCode" className={labelBase}>
                  {t.experience} <span className="text-slate-500">({t.optional})</span>
                </label>
                <select
                  id="experienceCode"
                  name="experienceCode"
                  className={fieldBase}
                  value={data.experienceCode}
                  onChange={(e) => set('experienceCode', e.target.value)}
                >
                  <option value="">—</option>
                  {experiences.map((o) => (
                    <option key={o.code} value={o.code}>
                      {t.o[o.key]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="experienceDetails" className={labelBase}>
                  {t.experienceDetails} <span className="text-slate-500">({t.optional})</span>
                </label>
                <textarea
                  id="experienceDetails"
                  name="experienceDetails"
                  rows={3}
                  maxLength={limits.experienceDetails}
                  placeholder={t.experienceDetailsPlaceholder}
                  className={`${fieldBase} resize-none`}
                  value={data.experienceDetails}
                  onChange={(e) => set('experienceDetails', e.target.value)}
                />
                <p className={hintBase}>{t.charsLeft(limits.experienceDetails - data.experienceDetails.length)}</p>
              </div>
            </fieldset>

            {/* Location */}
            <fieldset className="grid gap-5 border border-slate-800 bg-slate-900/50 p-5 sm:grid-cols-2">
              <div>
                <label htmlFor="currentCountry" className={labelBase}>
                  {t.currentCountry} <span className="text-amber-400">*</span>
                </label>
                <input
                  id="currentCountry"
                  name="currentCountry"
                  type="text"
                  autoComplete="country-name"
                  maxLength={limits.country}
                  placeholder={t.currentCountryPlaceholder}
                  className={fieldBase}
                  value={data.currentCountry}
                  onChange={(e) => set('currentCountry', e.target.value)}
                  aria-required="true"
                  aria-invalid={invalid('currentCountry')}
                  aria-describedby={describedBy('currentCountry')}
                />
                {err('currentCountry')}
              </div>
              <div>
                <label htmlFor="currentCity" className={labelBase}>
                  {t.currentCity} <span className="text-amber-400">*</span>
                </label>
                <input
                  id="currentCity"
                  name="currentCity"
                  type="text"
                  autoComplete="address-level2"
                  maxLength={limits.city}
                  placeholder={t.currentCityPlaceholder}
                  className={fieldBase}
                  value={data.currentCity}
                  onChange={(e) => set('currentCity', e.target.value)}
                  aria-required="true"
                  aria-invalid={invalid('currentCity')}
                  aria-describedby={describedBy('currentCity')}
                />
                {err('currentCity')}
              </div>
            </fieldset>

            {/* Documents */}
            <fieldset className="border border-slate-800 bg-slate-900/50 p-5">
              <legend className="px-1 text-sm font-medium text-slate-200">
                {t.documentsLabel} <span className="text-slate-500">({t.documentsHint})</span>
              </legend>
              <div className="mt-3 space-y-2">
                {documents.map((o) => {
                  const checked = data.documentCodes.includes(o.code);
                  return (
                    <label
                      key={o.code}
                      className={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${
                        checked ? 'border-amber-400/60 bg-amber-400/5' : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                          checked ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-500'
                        }`}
                      >
                        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleInArray('documentCodes', o.code)}
                      />
                      <span className="text-sm text-slate-200">{t.o[o.key]}</span>
                    </label>
                  );
                })}
              </div>
              {data.documentCodes.includes('other') && (
                <div className="mt-3">
                  <label htmlFor="otherDocuments" className="sr-only">
                    {t.otherDocuments}
                  </label>
                  <input
                    id="otherDocuments"
                    name="otherDocuments"
                    type="text"
                    maxLength={limits.otherDocuments}
                    placeholder={t.otherDocumentsPlaceholder}
                    className={fieldBase}
                    value={data.otherDocuments}
                    onChange={(e) => set('otherDocuments', e.target.value)}
                    aria-invalid={invalid('otherDocuments')}
                    aria-describedby={describedBy('otherDocuments')}
                  />
                  {err('otherDocuments')}
                </div>
              )}
            </fieldset>

            {/* Contacts */}
            <fieldset className="space-y-5 border border-slate-800 bg-slate-900/50 p-5">
              <div>
                <label htmlFor="primaryPhone" className={labelBase}>
                  {t.primaryPhone} <span className="text-amber-400">*</span>
                </label>
                <input
                  id="primaryPhone"
                  name="primaryPhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={limits.phone}
                  placeholder="+48 123 456 789"
                  className={fieldBase}
                  value={data.primaryPhone}
                  onChange={(e) => set('primaryPhone', e.target.value)}
                  aria-required="true"
                  aria-invalid={invalid('primaryPhone')}
                  aria-describedby={describedBy('primaryPhone', 'phone-hint')}
                />
                <p id="phone-hint" className={hintBase}>
                  {t.primaryPhoneHint}
                </p>
                {err('primaryPhone')}
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className={labelBase}>
                  {t.whatsapp} <span className="text-slate-500">({t.optional})</span>
                </label>
                <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-amber-400"
                    checked={data.whatsappSame}
                    onChange={(e) => set('whatsappSame', e.target.checked)}
                  />
                  {t.whatsappSame}
                </label>
                {!data.whatsappSame && (
                  <>
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      inputMode="tel"
                      maxLength={limits.phone}
                      placeholder={t.whatsappPlaceholder}
                      className={fieldBase}
                      value={data.whatsapp}
                      onChange={(e) => set('whatsapp', e.target.value)}
                      aria-invalid={invalid('whatsapp')}
                      aria-describedby={describedBy('whatsapp')}
                    />
                    {err('whatsapp')}
                  </>
                )}
              </div>

              {/* Telegram */}
              <div>
                <label htmlFor="telegram" className={labelBase}>
                  {t.telegram} <span className="text-slate-500">({t.optional})</span>
                </label>
                <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-amber-400"
                    checked={data.telegramSame}
                    onChange={(e) => set('telegramSame', e.target.checked)}
                  />
                  {t.telegramSame}
                </label>
                {!data.telegramSame && (
                  <>
                    <input
                      id="telegram"
                      name="telegram"
                      type="text"
                      maxLength={limits.telegram}
                      placeholder={t.telegramPlaceholder}
                      className={fieldBase}
                      value={data.telegram}
                      onChange={(e) => set('telegram', e.target.value)}
                      aria-invalid={invalid('telegram')}
                      aria-describedby={describedBy('telegram')}
                    />
                    {err('telegram')}
                  </>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelBase}>
                  {t.email} <span className="text-slate-500">({t.optional})</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={limits.email}
                  placeholder={t.emailPlaceholder}
                  className={fieldBase}
                  value={data.email}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={invalid('email')}
                  aria-describedby={describedBy('email')}
                />
                {err('email')}
              </div>
            </fieldset>

            {/* Availability */}
            <fieldset className="border border-slate-800 bg-slate-900/50 p-5">
              <legend className="px-1 text-sm font-medium text-slate-200">{t.availability}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {availabilities.map((o) => {
                  const checked = data.availabilityCode === o.code;
                  return (
                    <label
                      key={o.code}
                      className={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${
                        checked ? 'border-amber-400/60 bg-amber-400/5' : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          checked ? 'border-amber-400' : 'border-slate-500'
                        }`}
                      >
                        {checked && <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />}
                      </span>
                      <input
                        type="radio"
                        name="availabilityCode"
                        className="sr-only"
                        value={o.code}
                        checked={checked}
                        onChange={() => set('availabilityCode', o.code)}
                      />
                      <span className="text-sm text-slate-200">{t.o[o.key]}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Desired countries */}
            <fieldset className="border border-slate-800 bg-slate-900/50 p-5">
              <legend className="px-1 text-sm font-medium text-slate-200">
                {t.desiredCountries} <span className="text-slate-500">({t.desiredCountriesHint})</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {desiredCountries.map((o) => {
                  const checked = data.desiredCountryCodes.includes(o.code);
                  return (
                    <label
                      key={o.code}
                      className={`flex cursor-pointer items-center gap-2 border px-4 py-2.5 text-sm transition-colors ${
                        checked
                          ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                          : 'border-slate-700 text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleInArray('desiredCountryCodes', o.code)}
                      />
                      {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      {t.o[o.key]}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Consent */}
            <div className="border border-slate-800 bg-slate-900/50 p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 shrink-0 accent-amber-400"
                  checked={data.consent}
                  onChange={(e) => set('consent', e.target.checked)}
                  aria-required="true"
                  aria-invalid={invalid('consent')}
                  aria-describedby={describedBy('consent')}
                />
                <span className="text-sm leading-relaxed text-slate-300">
                  {t.consent} <span className="text-amber-400">*</span>
                  {dataController.privacyPolicyUrl &&
                    !dataController.privacyPolicyUrl.startsWith('REPLACE_WITH_') && (
                      <>
                        {' '}
                        <a
                          href={dataController.privacyPolicyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 underline hover:text-amber-300"
                        >
                          {t.privacyLink}
                        </a>
                      </>
                    )}
                </span>
              </label>
              {err('consent')}
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                {dataController.name}
                {!dataController.address.startsWith('REPLACE_WITH_') && ` · ${dataController.address}`}
                {!dataController.email.startsWith('REPLACE_WITH_') && ` · ${dataController.email}`}
              </p>
            </div>

            {/* Submit error */}
            {status === 'error' && submitError && (
              <p className="flex items-center gap-2 border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" /> {submitError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="flex w-full items-center justify-center gap-2 bg-amber-400 px-6 py-4 text-base font-semibold text-slate-950 transition-colors duration-300 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> {t.submitting}
                </>
              ) : (
                t.submit
              )}
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default CandidatePage;
