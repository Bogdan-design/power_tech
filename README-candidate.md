# POWER TECH — Анкета кандидата (`/candidate`)

Двомовна (UA / RU) вебформа для збору кандидатів на роботу. Вбудована в наявний
сайт Power Tech (Vite + React + TypeScript + Tailwind) як **окрема сторінка з
постійним URL** `/candidate`. Дані автоматично потрапляють у **наявну Google
Таблицю**, вкладка `Candidates`, через backend на Google Apps Script.

- Форма: <https://www.powertech.net.pl/candidate>
- Українська мова — за замовчуванням. Перемикач `UA | RU` без перезавантаження.

---

## 1. Що потрібно надати / вставити вручну

Залишилось заповнити **2 значення** (`SPREADSHEET_ID` уже вписано —
таблиця «POWER TECH», `1QZBmOgRyeTBzpFcfHUo-OltMJybjIxmyApWQX3G340Q`):

| Де | Значення | Приклад |
|----|----------|---------|
| ✅ `apps-script/Code.gs` → `SPREADSHEET_ID` | ID наявної таблиці — **вже заданий** | `1QZBmOgRyeTBzpFcfHUo-OltMJybjIxmyApWQX3G340Q` |
| ⬜ Frontend endpoint (див. нижче) | URL Web App після деплою Apps Script | `https://script.google.com/macros/s/AKfy…/exec` |
| ⬜ `src/candidate/config.ts` → `dataController` | Назва контролера даних, email, адреса, URL політики конфіденційності | `rekrutacja@powertech.net.pl`, `https://www.powertech.net.pl/privacy` |

> **Юридичні реквізити не вигадані навмисно** — впишіть реальні дані контролера
> у `src/candidate/config.ts` (об’єкт `dataController`). Поки email/адреса/URL —
> плейсхолдери, вони просто не показуються у блоці згоди.

### Куди вставити endpoint (URL Apps Script)

Два способи — оберіть один:

- **Змінна оточення (рекомендовано):** створіть `.env` у корені проєкту:
  ```
  VITE_CANDIDATE_ENDPOINT=https://script.google.com/macros/s/AKfy…/exec
  ```
- **Або прямо у файлі:** `src/candidate/config.ts` → замініть
  `REPLACE_WITH_APPS_SCRIPT_WEB_APP_URL`.

Поки endpoint не заданий, форма працює в **dry-run** режимі: усе валідовується,
показується екран «Дякуємо», але дані нікуди не відправляються (у консоль
пишеться лише нейтральна позначка, без персональних даних).

---

## 2. Backend: Google Apps Script

1. Відкрийте **наявну** Google Таблицю → меню **Розширення → Apps Script**.
2. Видаліть шаблонний код, вставте вміст [`apps-script/Code.gs`](apps-script/Code.gs).
3. Вгорі файлу впишіть `SPREADSHEET_ID` (ID цієї ж таблиці).
4. **Розгортання → Новий розгорток → тип «Веб-застосунок»**:
   - **Виконувати як:** Я (ваш акаунт).
   - **Хто має доступ:** Усі (Anyone).
5. Скопіюйте URL, що закінчується на `/exec`, і вставте у frontend (розділ 1).
6. При першому запуску Google попросить надати дозволи — погодьтеся.

### Що робить backend

- Якщо вкладки `Candidates` немає — **створює її**, додає заголовки (тільки
  англійською), закріплює й оформлює перший рядок. Інші вкладки таблиці **не
  чіпає, не змінює й не видаляє**. Нову таблицю **не створює**.
- Валідує та очищає дані повторно (ім’я — латиниця Unicode, телефон, email,
  вік, довжини полів). Персональні дані **не логуються**.
- Заповнює автоматично: `Candidate ID`, `First Application`, `Last Application`,
  `Application Count = 1`, `Status = New`, `Form Language = UK|RU`, `Source`,
  `Campaign`.
- **Дублікати** визначає за нормалізованим `Primary Phone`. Якщо кандидат уже є:
  оновлює контактні й анкетні дані, оновлює `Last Application`, збільшує
  `Application Count` і **не чіпає** заповнені менеджером поля: `Status`,
  `Assigned To`, `Next Contact Date`, `Manager Comment`.

### Колонки вкладки `Candidates` (тільки англійською)

`Candidate ID`, `First Application`, `Last Application`, `Application Count`,
`First Name`, `Last Name`, `Age`, `Specialty Code`, `Specialty`,
`Other Specialty`, `Experience Code`, `Experience`, `Experience Details`,
`Current Country`, `Current City`, `Document Codes`, `Documents`,
`Other Documents`, `Primary Phone`, `WhatsApp`, `Telegram`, `Email`,
`Availability Code`, `Availability`, `Desired Country Codes`,
`Desired Countries`, `Form Language`, `Source`, `Campaign`, `Status`,
`Assigned To`, `Next Contact Date`, `Manager Comment`.

Технічні коди (`electrician`, `plumber`, `1_3`, `pesel_ukr`, `poland`, …)
зберігаються окремо від людських англійських назв — не переплутуються з
перекладеним інтерфейсом.

---

## 3. Рекламні параметри та приклади посилань

Форма читає параметри з URL і записує їх у таблицю:

- `source`  → колонка `Source`
- `campaign` → колонка `Campaign`
- `lang=uk` / `lang=ru` → примусова мова (інакше — збережена в `localStorage`,
  за замовчуванням `uk`)

Приклади:

```
https://www.powertech.net.pl/candidate
https://www.powertech.net.pl/candidate?source=facebook&campaign=elektrycy_warszawa
https://www.powertech.net.pl/candidate?lang=ru
https://www.powertech.net.pl/candidate?source=qr_wizytowka&campaign=hydraulicy&lang=uk
```

Персональні дані через URL **не передаються** — лише URL форми, `source` і
`campaign`.

---

## 4. QR-код

Готові файли — у `public/candidate-qr/`:

- `candidate-qr.svg` — вектор (для друку будь-якого розміру);
- `candidate-qr.png` — 1200×1200 px;
- `candidate-qr@2x.png` — 2400×2400 px (висока якість);
- `print.html` — готовий до друку аркуш із QR і двомовним підписом
  («Скануйте та заповніть анкету» / «Отсканируйте и заполните анкету»).

QR веде на фінальний URL, має максимальний контраст, без логотипа в центрі
(щоб не погіршувати зчитування). Використовуйте у Facebook-банерах, візитках,
друкованих оголошеннях.

### Як змінити URL і перегенерувати QR

1. Змініть `CANDIDATE_PRODUCTION_URL` у [`src/candidate/config.ts`](src/candidate/config.ts).
2. Виконайте:
   ```bash
   npm run qr
   # або з явним URL:
   node tools/generate-qr.mjs https://www.powertech.net.pl/candidate
   ```

Скрипт **відмовиться** генерувати QR для `localhost` — щоб не роздрукувати
неробоче посилання.

---

## 5. Локальний запуск і збірка

```bash
npm install
npm run dev        # http://localhost:3000/candidate
npm run typecheck
npm run lint
npm run build
```

Розгортання — як і раніше: `Vercel` з гілки `main`. Додано
[`vercel.json`](vercel.json) з SPA-переспрямуванням, щоб пряме відкриття
`/candidate` працювало (для Hostinger/Apache цю роль виконує наявний
`public/.htaccess`). Існуючі сторінки сайту не змінені.

---

## 6. Створені та змінені файли

**Створені:**

- `src/pages/CandidatePage.tsx` — сторінка форми (UI, стан, валідація, відправка);
- `src/candidate/config.ts` — конфігурація (endpoint, контролер даних, опції, коди, ліміти);
- `src/candidate/i18n.ts` — переклади UA/RU + англійські назви для таблиці;
- `src/candidate/validation.ts` — валідація/нормалізація (латиниця, телефон, email, вік);
- `apps-script/Code.gs` — backend Google Apps Script;
- `tools/generate-qr.mjs` — генератор QR;
- `public/candidate-qr/*` — QR (SVG, PNG 1200/2400, `print.html`);
- `vercel.json` — SPA-переспрямування;
- `README-candidate.md` — цей файл.

**Змінені:**

- `src/App.tsx` — доданий lazy-маршрут `/candidate` (існуючий маршрут `/` не чіпав);
- `package.json` — доданий скрипт `qr` і devDependency `qrcode`.

---

## 7. Ручні тести (чек-лист)

- [ ] **Обидві мови.** Відкрити `/candidate` — за замовчуванням UA. Перемкнути на
      RU — усі поля, підказки, помилки й повідомлення перекладаються.
- [ ] **Дані не зникають.** Ввести текст, перемкнути мову — введене лишається.
- [ ] **`localStorage`.** Обрати RU, перезавантажити — форма відкривається RU.
- [ ] **URL-параметр мови.** `/candidate?lang=ru` відкриває RU; `?lang=uk` — UA.
- [ ] **Валідація імені.** Кирилиця/цифри → помилка «…латинськими літерами…».
      Латиниця з `ą ć ł ń ó ś ż`, пробілом, апострофом, дефісом → приймається.
- [ ] **Нормалізація імені.** Зайві пробіли прибираються; перша літера кожної
      частини стає великою.
- [ ] **Телефон.** Без `+` або закороткий → помилка. `+48 123 456 789` → ок,
      нормалізується у `+48123456789`.
- [ ] **Вік.** 17 або 76 → помилка; порожньо → дозволено; 18–75 → ок.
- [ ] **Спеціальність «Інше».** З’являється текстове поле; порожнє → помилка.
- [ ] **Документи «Інші документи».** З’являється поле уточнення.
- [ ] **WhatsApp / Telegram.** Чекбокс «Такий самий» ховає поле й підставляє
      основний номер.
- [ ] **Згода.** Без згоди відправка блокується.
- [ ] **Відправлення в Google Sheets.** Заповнити валідно → рядок з’являється у
      вкладці `Candidates`; коди й англійські назви коректні; `Source`/`Campaign`
      із URL записані.
- [ ] **Дублікат.** Відправити ту саму анкету (той самий телефон) ще раз →
      новий рядок **не** створюється; оновлюються дані, `Last Application`,
      `Application Count = 2`.
- [ ] **Менеджерські поля.** Вписати вручну `Status`, `Assigned To`,
      `Next Contact Date`, `Manager Comment`, повторно відправити анкету → ці
      поля **не** перезаписані.
- [ ] **Подвійне натискання.** Швидко натиснути «Надіслати» двічі → лише одна
      відправка.
- [ ] **Honeypot.** (для тесту) заповнити приховане поле `website` → бекенд
      ігнорує запис.
- [ ] **Mobile.** Перевірити на Android і iPhone: великі поля/кнопки, зручно.
- [ ] **QR.** Відсканувати `candidate-qr.png` — відкривається форма.
- [ ] **Консоль.** Немає помилок; персональні дані не логуються.
- [ ] **Існуючі сторінки.** `/` відкривається як раніше, мова сайту (PL/DE/EN)
      не зіпсована.
