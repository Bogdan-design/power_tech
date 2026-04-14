# POWER TECH Website

Firmowa strona POWER TECH zbudowana na `Vite + React + TypeScript`.

## Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- GitHub Actions
- Hostinger FTP deploy

## Lokalny start

```bash
npm install
npm run dev
```

## Produkcyjna weryfikacja

```bash
npm run typecheck
npm run lint
npm run build
```

## Autodeploy na Hostinger

Workflow znajduje się w:

- `.github/workflows/deploy.yml`

Instrukcja konfiguracji sekretów GitHub:

- `docs/hostinger-deploy.md`

Wymagane GitHub Secrets:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_SERVER_DIR`

Najczęściej `FTP_SERVER_DIR` to:

```text
/public_html/
```

## Co wrzucać do GitHub

Do repozytorium wrzucaj:

- `src/`
- `public/`
- `.github/`
- `docs/`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.mjs`
- `index.html`
- `.gitignore`

Nie wrzucaj:

- `node_modules/`
- `dist/`
- `.idea/`
- lokalnych plików `.env`

## Pierwszy push do GitHub

```bash
git init
git add .
git commit -m "Initial website setup"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```
