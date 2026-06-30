# Progress 05 — Sample collection + sample-return mission path

Screenshot:
- `/progress/progress-05-sample-return.png`

What changed:
- Added **Collect Sample** action for selected spacecraft.
- Sample collection checks now enforce:
  - spacecraft must be on a solid body (Moon/Mars/Venus/Ceres/Phobos),
  - no time tokens (must have arrived),
  - location explored (if explorable),
  - collector onboard (undamaged probe/capsule or healthy astronaut).
- Samples now store `sampleSourceLocationId` (where they were collected).
- Mission auto-check now supports:
  - **Sample Return** missions (sample of matching location reaches Earth),
  - **Extraterrestrial Life** mission (life sample reaches Earth).
- Mission checks and scoring are triggered after maneuvers and sample collection.
- Added impossible-mission removal + completion logging in Mission Log.

Where to click (quick demo):
1. **Research & Procurement**
   - Research `Juno Rockets`.
   - Buy `Probe` x1 and `Juno` x4.
2. **Hangar**
   - Assemble craft.
3. **Maneuvers**
   - Move craft to a sampleable location (e.g., Moon path).
4. **Maneuvers panel**
   - Click `Collect Sample` once at destination.
5. Return to Earth via maneuvers.
6. Check:
   - **Mission Log** for sample collection and mission completion entries.
   - **Score** in agency panel updates automatically.

Verification:
- `npm test` (13 passing)
- `npm run build` (pass)
