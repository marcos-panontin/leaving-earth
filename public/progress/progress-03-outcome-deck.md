# Progress 03 — Outcome deck integration

Screenshot:
- `/progress/progress-03-outcome-deck.png`

What changed:
- Added a **global outcome deck** (60 success, 15 minor failure, 15 major failure).
- Research now draws hidden outcome cards from the global deck onto each advancement.
- Maneuver firing now uses advancement outcome cards for rocket behavior:
  - major failure can destroy the spacecraft,
  - minor failure damages the rocket and yields no thrust,
  - success generates thrust.
- Re-entry and Landing now resolve from their advancement outcome cards instead of temporary fixed roll bands.
- If a rocket advancement is missing when a rocket is fired, it is auto-gained (with outcomes), then resolved.
- Shop panel now shows researched advancements with remaining outcome card counts.

Where to click (quick demo):
1. **Research & Procurement**
   - Click `Juno Rockets`.
   - Observe researched advancement line appears with card counts.
2. Buy `Probe` x1 and `Juno` x4.
3. **Hangar**
   - Assemble the craft.
4. **Maneuvers**
   - Execute `Earth -> Suborbital Flight`.
   - Check Mission Log for rocket outcome messages.
5. Re-entry outcome demo:
   - Research `Re-entry`, build a capsule craft in Earth Orbit, run `Earth Orbit -> Earth`, then inspect log.

Notes:
- Paying to remove outcomes ($5/$10) is not wired to UI yet; this is the next refinement.
