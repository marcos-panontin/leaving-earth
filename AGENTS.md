# Leaving Earth

A solo digital implementation of the board game *Leaving Earth*, built with React + Vite. The game logic lives in plain ES modules under `src/utils/` (notably `index.js`, `manuevers.js`, `components.js`, `calculatorFunctions.js`) and is dynamically imported by `src/App.jsx` after mount. The board UI is rendered with Bootstrap (loaded via CDN in `index.html`).

## Cursor Cloud specific instructions

- Single frontend service only; there is no backend, database, or test suite.
- Standard commands are in `package.json`: `npm run dev` (Vite dev server, http://localhost:5173), `npm run build`, `npm run preview`.
- There is no lint config and no automated tests in this repo, so there is nothing to run for those.
- The game logic in `src/utils/index.js` reads DOM elements at module load and is dynamically imported from `App.jsx` inside a `useEffect`; it depends on the static markup in `App.jsx` existing, so changes to element IDs/classes there can break the maneuver/ship logic.
- Bootstrap CSS/Icons load from a CDN, so the board's styling/icons require outbound network access in the dev environment.
- Core flow to smoke-test: click `DOCK NEW SHIP` (spawns a ship at Earth), then right-click the ship icon to open the maneuver context menu and pick a destination to move it.
