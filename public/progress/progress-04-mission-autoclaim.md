# Progress 04 — Mission auto-claim + scoring

Screenshot:
- `/progress/progress-04-mission-autoclaim.png`

What changed:
- Added automatic mission completion checks tied to gameplay state updates.
- Implemented score awards on mission completion (`+points` and mission log message).
- Implemented impossible mission removal when a required target location is revealed as `destroyed`.
- Mission checks now run:
  - after maneuver resolution (`onTurn` missions),
  - at new-year transition (`startOfYear` missions and impossible checks).
- Added tests for:
  - auto-completing Sounding Rocket after reaching space,
  - removing Venus Lander when Venus is revealed as impossible.

Where to click (quick demo):
1. **Research & Procurement**
   - Research `Juno Rockets`.
   - Buy `Probe` x1 and `Juno` x4.
2. **Hangar**
   - Assemble craft.
3. **Maneuvers**
   - Execute `Earth -> Suborbital Flight`.
4. **Check left panel**
   - `Score` should increase if `Sounding Rocket` was active.
5. **Check Mission Log**
   - Look for `Mission completed: ... (+points)`.

Notes:
- This currently supports the missions reachable with existing implemented actions.
- Next: mission checks for sample return / manned chains as those systems are added.
