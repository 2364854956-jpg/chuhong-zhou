# Chuhong Zhou Portfolio

Static, interaction-rich portfolio built with HTML, CSS, and vanilla JavaScript.

## Structure

- `index.html` — public entry point
- `mobile-preview.html` — fixed 390 × 844 mobile preview
- `css/` — page styles
- `js/` — interaction and motion scripts
- `assets/` — images, fonts, audio, icons, and runtime assets
- `src/macbook-island/` — source for the MacBook island component
- `source/` — original PDFs, reference images, PPT exports, and historical previews

## Local development

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`.

Validate all local asset references with:

```bash
node scripts/check-assets.mjs
```

## Deployment

Pushes to `main` deploy the static site through GitHub Actions and GitHub Pages.

Expected site URL:

`https://2364854956-jpg.github.io/chuhong-zhou/`
