# Progress 02 — Hazard pass in maneuver flow

Screenshot:
- `/progress/progress-02-hazard-pass.png`

What changed:
- Maneuver execution now resolves a first hazard pass.
- Added **radiation checks** (d8 roll logic; astronaut effects logged).
- Added **re-entry checks**:
  - without Re-entry advancement and capsule present -> spacecraft destroyed.
  - with Re-entry advancement -> roll-based success/minor/major outcomes.
- Added **landing checks**:
  - without Landing advancement (required landing) -> spacecraft destroyed.
  - with Landing advancement -> roll-based success/minor/major outcomes.
- Added **auto-reveal** for unexplored destination locations on first arrival.
- Mission log now records hazard outcomes with clear text.

Where to click (quick demo):
1. **Research & Procurement**
   - Research `Juno Rockets`.
   - Buy `Probe` x1 and `Juno` x4.
2. **Hangar**
   - Select those parts and click `Assemble Craft`.
3. **Maneuvers**
   - Choose the craft and execute `Earth -> Suborbital Flight`, then `Suborbital Flight -> Earth Orbit`.
4. Re-entry failure demo:
   - Buy `Vostok`, assemble a craft, move to `Earth Orbit`, then execute `Earth Orbit -> Earth`.
   - Without `Re-entry` researched, the log should show destruction on re-entry.

Notes:
- This is still a simplified interim hazard resolver (full outcome deck integration comes next).
