# Soufiane Haoudi — Portfolio

Editable React + TypeScript portfolio built with Vite.

## Install and run

Requires Node.js 22.13 or newer. From the repository root:

```sh
cd portfolio
npm ci
npm run dev
```

Open the local URL printed by Vite, normally http://localhost:5173.

## Assets to add later

This commit includes source and configuration only. The six WebP images and four
PDF samples are intentionally not included yet. Their existing references are
preserved, so images and PDF links will become available after these files are added:

```text
portfolio/public/assets/
  hero.webp
  veleray-cover.webp
  veleray-angles.webp
  health-email.webp
  health-landing.webp
  health-sales.webp

portfolio/public/work/
  veleray-case-study.pdf
  health-welcome-email.pdf
  health-landing-page.pdf
  health-sales-page.pdf
```

## Build

From `portfolio/`:

```sh
npm run build
npm run preview
```

The build is generated in the sibling `docs/` folder, which is not committed in
this source-only version. Add the media files before preparing the final website
for hosting.

## Edit

- `portfolio/src/App.tsx`: copy, projects, services, contact details, and interactions.
- `portfolio/src/styles.css`: typography, colors, layout, and animations.
- `portfolio/index.html`: page title and metadata.

## Contact

- Email: Soufiane.copywriting@gmail.com
- Phone: +212 615-481049

The inquiry form opens an email draft in the visitor's email app. It does not
send email automatically or require a backend.
