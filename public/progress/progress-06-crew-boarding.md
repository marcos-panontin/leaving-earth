# Progress 06 — Crew Recruitment + Boarding

## Screenshot

- Browser URL: `http://127.0.0.1:5173/progress/progress-06-crew-boarding.png`
- Workspace file: `/workspace/public/progress/progress-06-crew-boarding.png`

## What changed

- Added astronaut recruitment (`$2` each) in the Hangar panel.
- Added boarding/unboarding actions with seat-capacity validation from capsule seats.
- Added astronaut travel history tracking during maneuvers (for manned mission progress).
- Added mission completion support for manned return missions:
  - Man in Space
  - Man in Orbit
  - Man on the Moon / Mars / Venus (groundwork)
- Added automatic astronaut loss handling when spacecraft are destroyed.
- Added tests for:
  - astronaut recruitment + boarding flow
  - Space Station mission completion at start of year with crew in space

## Where to click

1. Open **Hangar** panel.
2. In **Crew**, click **Recruit <Astronaut Name> ($2)**.
3. Build a capsule craft (for example with Vostok) and click **Assemble Craft**.
4. Under **Spacecraft on Earth**, click **Board <Astronaut Name>**.
5. Go to **Maneuvers** and perform launch/orbit maneuvers.
6. Click **End Year** to trigger start-of-year mission checks (e.g., Space Station).
