# Frontend

This directory contains the new React + Vite frontend.

Dependencies are intentionally installed in the parent `root` package. The frontend package keeps only its local scripts and calls the shared Vite binary from `../node_modules`.

## Commands

Run from `root`:

```bash
npm run dev
npm run build
```

Run from `root/frontend`:

```bash
npm run dev
npm run build
```

The Vite development server runs on `http://localhost:5173`. API requests under `/api` are proxied to the backend on `http://localhost:3000` when the backend is running.

## Structure

- `index.html` is the Vite document shell.
- `src/main.jsx` is the React entry point.
- `src/App.jsx` contains the initial route-aware application shell.
- `src/styles.css` contains the foundation styles and imports the shared root Tailwind entry.
- `vite.config.mjs` configures React, Tailwind, development proxying, and the production output directory.
