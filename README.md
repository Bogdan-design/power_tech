# POWER TECH Website

Firmowa strona POWER TECH zbudowana na `Vite + React + TypeScript`.

## Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- Vercel

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

## Deploy

Projekt jest wdrażany na `Vercel` bezpośrednio z repozytorium GitHub po pushu do `main`.

## Co wrzucać do GitHub

Do repozytorium wrzucaj:

- `src/`
- `public/`
- `.github/`
- `docs/`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `postcss.config.ts`
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
