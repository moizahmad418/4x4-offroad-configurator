# Deploying this project to GitHub Pages

## What this project actually is

This is **not** a plain website made of `.html`, `.css` and `.js` files. It is a
**React + Vite + Three.js source project** — a 3D off-road vehicle configurator.

The files in this folder are *ingredients*, not the finished meal:

- `main.jsx`, `components/*.jsx` — JSX, which browsers cannot read
- `shaders/*.glsl` — GPU shader code that has to be bundled in
- `assets/styles/global.css` — Tailwind directives, not real CSS yet
- `package.json` — the list of libraries this project needs
- `index.html` — a nearly empty shell containing only `<div id="root"></div>`

Opening `index.html` by double-clicking does nothing useful, because:

1. It has no content of its own — the page is built by JavaScript at runtime.
2. It points at `/main.jsx`, and a browser has no idea what JSX is.
3. `import` statements need a real server; over `file://` they are blocked.

A tool called **Vite** is what turns the ingredients into a real website. That is
what `npm run dev` was doing on your machine, and `npm run build` does the same
thing permanently, writing a `dist/` folder full of ordinary HTML, CSS and JS
that any web server can serve.

> **On `npm` vs `npm.cmd`:** on Windows, `npm` is a `.cmd` file. PowerShell
> sometimes refuses to run it under the bare name because of its script
> execution policy. Using `npm.cmd` sidesteps that. Nothing was wrong with your
> project — it is purely a Windows shell quirk.

## Why other people's zips look like this too, yet their Pages sites work

Their repository holds the same kind of *source* code. The live site is built
from it separately. Usually one of two ways:

- **GitHub Actions** builds the project on GitHub's servers on every push and
  publishes the resulting `dist/` folder. The built files never live in the
  repo — which is why you never see them in the zip.
- Or the author runs `npm run build` locally and pushes only `dist/` to a
  `gh-pages` branch.

So the zip you download is the recipe; the live page is the cooked dish. This
repo is now set up to do the first option, automatically.

## What you need to do

1. **Create a new repository on GitHub** and push this folder to it on the
   `main` branch.

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. **Turn on Pages.** In the repo, go to **Settings → Pages → Build and
   deployment**, and set **Source** to **GitHub Actions**. (Not "Deploy from a
   branch".)

3. **Wait for the build.** Open the **Actions** tab. The "Deploy to GitHub
   Pages" workflow runs automatically, takes a couple of minutes, and prints
   your live URL when it finishes:

   `https://<your-username>.github.io/<your-repo>/`

That is it. Every future `git push` to `main` rebuilds and redeploys the site.

## Things worth knowing

- **Don't commit `node_modules/` or `dist/`.** They're already in `.gitignore`.
  `node_modules` is huge and is reinstalled by the workflow; `dist` is rebuilt.
- **Repo size.** The 3D models and textures in `public/assets` are about 45 MB.
  That is fine for GitHub Pages (the limit is 1 GB), but the first page load
  will be heavy for visitors, and a slow connection will feel it.
- **Multiplayer will not work on GitHub Pages.** The `server/` folder is a
  Node WebSocket server, and Pages can only serve static files. Single-player
  works completely. To enable multiplayer you would host `server/` somewhere
  that runs Node (Render, Railway, Fly.io, a VPS) and set the
  `VITE_MULTIPLAYER_SERVER_URL` environment variable at build time to its
  `wss://` address.
- **The feedback form won't submit.** It relies on Netlify Forms. Everything
  else in the UI works.
- **The `netlify/` folder and `netlify.toml`** are for the original Netlify
  host. They are harmless on GitHub Pages — you can delete them if you like.

## Running it locally

```bash
npm install     # or npm.cmd install on Windows PowerShell
npm run dev     # then open the URL it prints
```

The dev server uses a self-signed HTTPS certificate (needed for WebXR on
phones), so your browser will show a "not private" warning the first time.
Click through it — that is expected.

To check the production build locally:

```bash
npm run build
npm run preview
```
