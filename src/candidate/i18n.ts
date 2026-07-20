/**
 * Candidate form localization — Ukrainian (default) and Russian.
 * Self-contained so it never touches the site-wide pl/de/en LanguageContext.
 */

export type Lang = 'uk' | 'ru';

export const LANG_STORAGE_KEY = 'powertech-candidate-lang';

/** Codes here match config.ts option codes exactly. */
type Dict = {
  // meta
  metaTitle: string;
  brandTag: string;
  formTitle: string;
  formDescription: string;
  // progress
  progressLabel: (done: number, total: number) => string;
  requiredHint: string;
  optional: string;
  // sections / fields
  firstName: string;
  lastName: string;
  nameHint: string;
  nameError: string;
  age: string;
  ageHint: string;
  ageError: string;
  specialty: string;
  specialtyPlaceholder: string;
  otherSpecialty: string;
  otherSpecialtyPlaceholder: string;
  experience: string;
  experienceDetails: string;
  experienceDetailsPlaceholder: string;
  currentCountry: string;
  currentCountryPlaceholder: string;
  currentCity: string;
  currentCityPlaceholder: string;
  documentsLabel: string;
  documentsHint: string;
  otherDocuments: string;
  otherDocumentsPlaceholder: string;
  primaryPhone: string;
  primaryPhoneHint: string;
  primaryPhoneError: string;
  whatsapp: string;
  whatsappSame: string;
  whatsappPlaceholder: string;
  telegram: string;
  telegramSame: string;
  telegramPlaceholder: string;
  telegramError: string;
  email: string;
  emailPlaceholder: string;
  emailError: string;
  availability: string;
  desiredCountries: string;
  desiredCountriesHint: string;
  consent: string;
  consentError: string;
  privacyLink: string;
  // buttons / states
  submit: string;
  submitting: string;
  requiredFieldError: string;
  genericError: string;
  networkError: string;
  successTitle: string;
  successBody: string;
  successAgain: string;
  langLabel: string;
  charsLeft: (n: number) => string;
  // option label maps
  o: Record<string, string>;
};

const uk: Dict = {
  metaTitle: 'Анкета кандидата — POWER TECH',
  brandTag: 'Робота в Європі',
  formTitle: 'Анкета кандидата',
  formDescription:
    'Заповніть коротку анкету — це займе близько 1–2 хвилин. Ми зв’яжемося з вами, коли матимемо відповідну вакансію.',
  progressLabel: (done, total) => `Заповнено ${done} з ${total} обов’язкових полів`,
  requiredHint: 'Поля з * — обов’язкові',
  optional: 'необов’язково',

  firstName: 'Ім’я',
  lastName: 'Прізвище',
  nameHint: 'Латинськими літерами, як у закордонному паспорті.',
  nameError: 'Введіть ім’я та прізвище латинськими літерами, як у закордонному паспорті.',
  age: 'Вік',
  ageHint: 'Від 18 до 75 років',
  ageError: 'Вік має бути від 18 до 75 років.',
  specialty: 'Спеціальність',
  specialtyPlaceholder: 'Оберіть спеціальність',
  otherSpecialty: 'Уточніть спеціальність',
  otherSpecialtyPlaceholder: 'Ваша спеціальність',
  experience: 'Досвід роботи',
  experienceDetails: 'Коротко про досвід',
  experienceDetailsPlaceholder: 'Наприклад: об’єкти, обладнання, навички…',
  currentCountry: 'Країна, де ви зараз перебуваєте',
  currentCountryPlaceholder: 'Наприклад: Україна, Польща…',
  currentCity: 'Місто',
  currentCityPlaceholder: 'Наприклад: Варшава',
  documentsLabel: 'Документи',
  documentsHint: 'Можна обрати декілька',
  otherDocuments: 'Уточніть документи',
  otherDocumentsPlaceholder: 'Які саме документи',
  primaryPhone: 'Основний номер телефону',
  primaryPhoneHint: 'Тільки міжнародний формат, починається з +. Приклад: +48 123 456 789',
  primaryPhoneError: 'Введіть номер у міжнародному форматі, починаючи з +. Приклад: +48 123 456 789',
  whatsapp: 'WhatsApp',
  whatsappSame: 'Такий самий, як основний номер',
  whatsappPlaceholder: '+48 123 456 789',
  telegram: 'Telegram',
  telegramSame: 'Такий самий, як основний номер',
  telegramPlaceholder: '+48 123 456 789 або @username',
  telegramError: 'Введіть номер (починається з +) або @username.',
  email: 'Email',
  emailPlaceholder: 'name@example.com',
  emailError: 'Перевірте формат email.',
  availability: 'Коли готові почати',
  desiredCountries: 'Які країни роботи цікавлять',
  desiredCountriesHint: 'Можна обрати декілька',
  consent: 'Я даю згоду на обробку моїх персональних даних з метою розгляду моєї кандидатури.',
  consentError: 'Потрібна згода на обробку персональних даних.',
  privacyLink: 'Політика конфіденційності',

  submit: 'Надіслати анкету',
  submitting: 'Надсилаємо…',
  requiredFieldError: 'Заповніть усі обов’язкові поля.',
  genericError: 'Не вдалося надіслати анкету. Спробуйте ще раз.',
  networkError: 'Проблема зі з’єднанням. Перевірте інтернет і спробуйте ще раз.',
  successTitle: 'Дякуємо!',
  successBody:
    'Вашу анкету отримано. Ми зв’яжемося з вами, коли матимемо відповідну вакансію.',
  successAgain: 'Заповнити ще одну анкету',
  langLabel: 'Мова',
  charsLeft: (n) => `Залишилось ${n} символів`,

  o: {
    // specialties
    electrician: 'Електрик',
    electrician_helper: 'Помічник електрика',
    plumber: 'Сантехнік',
    ventilation_installer: 'Монтажник вентиляції',
    painter: 'Маляр',
    drywall_installer: 'Гіпсокартонник',
    tiler: 'Плиточник',
    general_worker: 'Різноробочий',
    other: 'Інше',
    // experience
    exp_none: 'Без досвіду',
    exp_lt_1: 'До 1 року',
    exp_1_3: '1–3 роки',
    exp_3_5: '3–5 років',
    exp_gt_5: 'Понад 5 років',
    // documents
    doc_passport_ua: 'Паспорт України',
    doc_pesel_ukr: 'PESEL UKR',
    doc_karta_pobytu: 'Карта побиту',
    doc_pl_work_visa: 'Польська робоча віза',
    doc_eu_citizenship: 'Громадянство ЄС',
    doc_other: 'Інші документи',
    doc_none: 'Немає документів для роботи в ЄС',
    // availability
    avail_now: 'Вже зараз',
    avail_week: 'Протягом тижня',
    avail_month: 'Протягом місяця',
    avail_later: 'Пізніше',
    // countries
    country_poland: 'Польща',
    country_germany: 'Німеччина',
    country_netherlands: 'Нідерланди',
    country_belgium: 'Бельгія',
    country_other: 'Інша',
  },
};

const ru: Dict = {
  metaTitle: 'Анкета кандидата — POWER TECH',
  brandTag: 'Работа в Европе',
  formTitle: 'Анкета кандидата',
  formDescription:
    'Заполните короткую анкету — это займёт около 1–2 минут. Мы свяжемся с вами, когда появится подходящая вакансия.',
  progressLabel: (done, total) => `Заполнено ${done} из ${total} обязательных полей`,
  requiredHint: 'Поля с * — обязательные',
  optional: 'необязательно',

  firstName: 'Имя',
  lastName: 'Фамилия',
  nameHint: 'Латинскими буквами, как в заграничном паспорте.',
  nameError: 'Введите имя и фамилию латинскими буквами, как в заграничном паспорте.',
  age: 'Возраст',
  ageHint: 'От 18 до 75 лет',
  ageError: 'Возраст должен быть от 18 до 75 лет.',
  specialty: 'Специальность',
  specialtyPlaceholder: 'Выберите специальность',
  otherSpecialty: 'Уточните специальность',
  otherSpecialtyPlaceholder: 'Ваша специальность',
  experience: 'Опыт работы',
  experienceDetails: 'Коротко об опыте',
  experienceDetailsPlaceholder: 'Например: объекты, оборудование, навыки…',
  currentCountry: 'Страна, где вы сейчас находитесь',
  currentCountryPlaceholder: 'Например: Украина, Польша…',
  currentCity: 'Город',
  currentCityPlaceholder: 'Например: Варшава',
  documentsLabel: 'Документы',
  documentsHint: 'Можно выбрать несколько',
  otherDocuments: 'Уточните документы',
  otherDocumentsPlaceholder: 'Какие именно документы',
  primaryPhone: 'Основной номер телефона',
  primaryPhoneHint: 'Только международный формат, начинается с +. Пример: +48 123 456 789',
  primaryPhoneError: 'Введите номер в международном формате, начиная с +. Пример: +48 123 456 789',
  whatsapp: 'WhatsApp',
  whatsappSame: 'Такой же, как основной номер',
  whatsappPlaceholder: '+48 123 456 789',
  telegram: 'Telegram',
  telegramSame: 'Такой же, как основной номер',
  telegramPlaceholder: '+48 123 456 789 или @username',
  telegramError: 'Введите номер (начинается с +) или @username.',
  email: 'Email',
  emailPlaceholder: 'name@example.com',
  emailError: 'Проверьте формат email.',
  availability: 'Когда готовы начать',
  desiredCountries: 'Какие страны работы интересуют',
  desiredCountriesHint: 'Можно выбрать несколько',
  consent: 'Я даю согласие на обработку моих персональных данных с целью рассмотрения моей кандидатуры.',
  consentError: 'Требуется согласие на обработку персональных данных.',
  privacyLink: 'Политика конфиденциальности',

  submit: 'Отправить анкету',
  submitting: 'Отправляем…',
  requiredFieldError: 'Заполните все обязательные поля.',
  genericError: 'Не удалось отправить анкету. Попробуйте ещё раз.',
  networkError: 'Проблема с соединением. Проверьте интернет и попробуйте ещё раз.',
  successTitle: 'Спасибо!',
  successBody:
    'Ваша анкета получена. Мы свяжемся с вами, когда появится подходящая вакансия.',
  successAgain: 'Заполнить ещё одну анкету',
  langLabel: 'Язык',
  charsLeft: (n) => `Осталось ${n} символов`,

  o: {
    electrician: 'Электрик',
    electrician_helper: 'Помощник электрика',
    plumber: 'Сантехник',
    ventilation_installer: 'Монтажник вентиляции',
    painter: 'Маляр',
    drywall_installer: 'Гипсокартонщик',
    tiler: 'Плиточник',
    general_worker: 'Разнорабочий',
    other: 'Другое',
    exp_none: 'Без опыта',
    exp_lt_1: 'До 1 года',
    exp_1_3: '1–3 года',
    exp_3_5: '3–5 лет',
    exp_gt_5: 'Более 5 лет',
    doc_passport_ua: 'Паспорт Украины',
    doc_pesel_ukr: 'PESEL UKR',
    doc_karta_pobytu: 'Карта побыту',
    doc_pl_work_visa: 'Польская рабочая виза',
    doc_eu_citizenship: 'Гражданство ЕС',
    doc_other: 'Другие документы',
    doc_none: 'Нет документов для работы в ЕС',
    avail_now: 'Уже сейчас',
    avail_week: 'В течение недели',
    avail_month: 'В течение месяца',
    avail_later: 'Позже',
    country_poland: 'Польша',
    country_germany: 'Германия',
    country_netherlands: 'Нидерланды',
    country_belgium: 'Бельгия',
    country_other: 'Другая',
  },
};

export const dict: Record<Lang, Dict> = { uk, ru };

/**
 * English canonical labels stored in the Sheet so the team reads stable English
 * text regardless of the candidate's form language. Kept per-category because
 * codes like `other` / `none` repeat across categories.
 * These MUST stay identical to the maps in apps-script/Code.gs.
 */
export const englishLabels = {
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
  } as Record<string, string>,
  experience: {
    none: 'No experience',
    lt_1: 'Up to 1 year',
    '1_3': '1–3 years',
    '3_5': '3–5 years',
    gt_5: 'More than 5 years',
  } as Record<string, string>,
  document: {
    passport_ua: 'Ukraine passport',
    pesel_ukr: 'PESEL UKR',
    karta_pobytu: 'Residence card (karta pobytu)',
    pl_work_visa: 'Polish work visa',
    eu_citizenship: 'EU citizenship',
    other: 'Other documents',
    none: 'No documents for working in the EU',
  } as Record<string, string>,
  availability: {
    now: 'Right now',
    within_week: 'Within a week',
    within_month: 'Within a month',
    later: 'Later',
  } as Record<string, string>,
  country: {
    poland: 'Poland',
    germany: 'Germany',
    netherlands: 'Netherlands',
    belgium: 'Belgium',
    other: 'Other',
  } as Record<string, string>,
};
