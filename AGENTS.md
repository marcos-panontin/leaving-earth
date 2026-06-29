# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
This is a solo digital implementation of the board game **Leaving Earth**, built with **React 18 + Vite 5**. It is a single frontend app (no backend, database, or external services). Game logic lives in `src/utils/` (`index.js`, `manuevers.js`, `components.js`, `calculatorFunctions.js`) and is dynamically imported by `src/App.jsx` on mount. Static assets (location/ship images) are served from `public/images/`. Styling relies on Bootstrap 5 loaded via CDN in `index.html`, so the UI needs internet access to look correct.

### Running / building (standard scripts in `package.json`)
- Dev server: `npm run dev` (Vite, serves on http://localhost:5173). Use `npm run dev -- --host` to expose it.
- Production build: `npm run build` (outputs to `dist/`, which is NOT gitignored — delete it after building to keep the tree clean).
- Preview built output: `npm run preview`.

### Testing & linting
- There is **no test suite and no lint/formatter config** in this repo. `npm test` and `npm run lint` do not exist. Validate changes by running the dev server and exercising the UI in a browser.

### Notes / gotchas
- `npm run build` emits a harmless warning about `//` comments in CSS; this is not an error.
