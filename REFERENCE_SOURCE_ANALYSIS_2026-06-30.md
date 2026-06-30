# Leaving Earth Source Analysis (Saved Reference)

Date saved: 2026-06-30  
Purpose: persistent, implementation-ready reference from newly uploaded files.

## Source files analyzed

1. `/home/ubuntu/.cursor/projects/workspace/uploads/book_of_missions_c75e.pdf`
2. `/home/ubuntu/.cursor/projects/workspace/uploads/LEAVING_EARTH_-_Component_Summary_8e22.pdf`
3. `/home/ubuntu/.cursor/projects/workspace/uploads/Remote_Planning_Tool_e58e.csv`

---

## 1) Component Summary PDF (canonical stats extracted)

### Components

| Category | Component | Required advancement | Cost | Mass | Thrust | Seats | Notes |
|---|---|---:|---:|---:|---:|---:|---|
| Rocket | Juno | Juno | 1 | 1 | 4 | 0 | Disposable |
| Rocket | Atlas | Atlas | 5 | 4 | 27 | 0 | Disposable |
| Rocket | Soyuz | Soyuz | 8 | 9 | 80 | 0 | Disposable |
| Rocket | Saturn | Saturn | 15 | 20 | 200 | 0 | Disposable |
| Rocket | Ion Thruster | Ion Thruster | 10 | 1 | 5* | 0 | `*` thrust per time token |
| Probe | Probe | none | 2 | 1 | 0 | 0 | Standard probe |
| Supply | Supply | Life Support | 1 | 1 | 0 | 0 | Supports 5 astronauts or repairs; may not be damaged |
| Capsule | Aldrin | Life Support | 4 | 3 | 0 | 8 | Burn up; -1 radiation |
| Capsule | Eagle | Landing | 4 | 1 | 0 | 2 | Burn up |
| Capsule | Apollo | Reentry | 4 | 3 | 0 | 3 | Burn up unless reentry successful or if damaged |
| Capsule | Vostok | Reentry | 2 | 2 | 0 | 1 | Burn up unless reentry successful or if damaged |
| Astronaut | Pilot | none | 5 | 0 | 0 | 0 | Reduces failures during Rendezvous and Landing |
| Astronaut | Doctor | none | 5 | 0 | 0 | 0 | Heals all other astronauts in same spacecraft |
| Astronaut | Mechanic | none | 5 | 0 | 0 | 0 | Repairs non-astronaut components in same spacecraft; reduces Life Support failure effect |

### Max payload chart by maneuver difficulty (from component sheet)

| Rocket | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Juno | 3 | 1 | 0.333 | - | - | - | - | - | - |
| Atlas | 23 | 9 | 5 | 2.75 | 1.4 | 0.5 | - | - | - |
| Soyuz | 71 | 31 | 17.667 | 11 | 7 | 4.333 | 2.429 | - | - |
| Saturn | 180 | 80 | 46.667 | 30 | 20 | 13.333 | 8.571 | 5 | 2.222 |

Implementation note: these values align with `(thrust / difficulty) - rocket_mass` payload logic.

---

## 2) Remote Planning Tool CSV (maneuver/hazard matrix extracted)

Columns in source: `from, to, difficulty, hazards, years, explorable`.

### Normalized entries (base rows in file)

| From | To | Difficulty | Hazards | Years | Explorable |
|---|---|---:|---|---|---|
| Earth | Suborbital Flight | 3 | -- | -- | by manned flight |
| Earth | Earth Orbit | 8 | -- | -- | no |
| Suborbital Flight | Earth Orbit | 5 | -- | -- | no |
| Suborbital Flight | Earth | ! automatic | (landing) | -- | no |
| Earth Orbit | Earth | 0 | reentry, (landing) | -- | no |
| Earth Orbit | Lunar Fly-By | 1 | -- | (1) | no |
| Earth Orbit | Lunar Orbit | 3 | -- | (1) | no |
| Earth Orbit | Inner * | 3 | -- | 1 | no |
| Earth Orbit | Outer | 6 | solar radiation | 1 | no |
| Earth Orbit | Mars Orbit | 5 | solar radiation | 3 | no |
| Earth Orbit | Mars Fly-By * | 3 | solar radiation | 3 | no |
| Lunar Fly-By | Earth Orbit | 1 | -- | (1) | no |
| Lunar Fly-By | Lunar Orbit | 2 | -- | (1) | no |
| Lunar Fly-By | Moon | 4 | landing | -- | yes |
| Lunar Orbit | Earth Orbit | 3 | -- | (1) | no |
| Lunar Orbit | Moon | 2 | landing | -- | yes |
| Moon | Lunar Orbit | 2 | -- | -- | no |
| Inner Transfer | Earth Orbit | 3 | -- | 1 | no |
| Inner Transfer | Venus Fly-By * | 2 | solar radiation | 1 | no |
| Inner Transfer | Venus Orbit | 3 | solar radiation | 1 | no |
| Inner Transfer | Ceres | 5 | solar radiation, landing | 1 | yes |
| Inner Transfer | Mars Orbit | 4 | solar radiation | 2 | no |
| Venus Fly-By | Venus Orbit | 1 | -- | (1) | no |
| Venus Fly-By | Venus | 1 | reentry, (landing) | -- | yes |
| Venus Orbit | Venus | 0 | re-entry, (landing) | -- | yes |
| Venus Orbit | Inner * | 3 | solar radiation | 1 | no |
| Venus Orbit | Outer | 9 | solar radiation | 1 | no |
| Venus | Venus Orbit | 6 | -- | -- | no |
| Ceres | Inner * | 5 | solar radiation | 2 | no |
| Ceres | Outer | 3 | solar radiation | 1 | no |
| Mars Orbit | Earth Orbit | 5 | solar radiation | 3 | no |
| Mars Orbit | Mars | 0 | reentry, landing | -- | yes |
| Mars Orbit | Phobos | 1 | landing | (1) | yes |
| Mars Orbit | Outer | 5 | solar radiation | 1 | no |
| Mars Orbit | Inner * | 4 | solar radiation | 2 | no |
| Mars | Mars Orbit | 3 | -- | -- | no |
| Phobos | Mars Orbit | 1 | -- | (1) | no |
| Mars Fly-By | Mars | 3 | reentry, landing | -- | yes |
| Mars Fly-By | Mars Orbit | 3 | -- | (1) | no |

Source footnotes present:
- `* ! lost hazzard present at this destination` (typo in source retained)
- `** destination is explorable`

Implementation note: this CSV is a planning aid and mostly overlaps current maneuver dataset; naming conventions differ (`Inner Transfer` vs `Inner Planets Transfer`, etc.) and should be normalized before direct import.

---

## 3) Book of Missions PDF (community mission plans)

Important context from source:
- Community guide (firedrake @ BGG), not an official rulebook replacement.
- Assumes required materials are already in Earth Orbit unless noted.
- Includes mission plans and suggested rocket stacks.
- Version noted: 0.44 (2017-08-22).

### Around Earth missions

| Mission | Also satisfies | Requires | Payload to Earth Orbit | Plan (compressed) |
|---|---|---|---:|---|
| Sounding Rocket | — | — | 1 | Probe + rockets; maneuver to Suborbital Flight. |
| Artificial Satellite | Sounding Rocket | — | 1 | Probe to Earth Orbit (possibly via Suborbital Flight). |
| Man in Space | Sounding Rocket | Re-Entry (for Vostok) or Landing (for Eagle) | 2 (capsule variants) | Capsule + rockets to Suborbital Flight; reveal; return to Earth(0). |
| Man in Orbit | Sounding Rocket, Man in Space | Re-Entry | 2 | Vostok to Earth Orbit (possibly via Suborbital); reveal suborbital; return Earth(0). |
| Space Station | Sounding Rocket, Man in Space, Man in Orbit | Re-Entry + Life Support | 3 | Vostok + astronaut to Earth Orbit; scrub if incapacitated; survive year-end life support + consume supplies. |

### Moon missions

| Mission | Also satisfies | Requires | Payload to Earth Orbit | Plan (compressed) |
|---|---|---|---:|---|
| Lunar Survey | — | Surveying | 2 | Juno+Probe to Earth Orbit, then Lunar Fly-By; survey Moon from fly-by. |
| Lunar Lander | Lunar Survey | Landing | 6 | Atlas+Juno+Probe to Lunar Orbit then Moon landing. |
| Lunar Sample Return | Lunar Survey, Lunar Lander | Rendezvous + Landing | 15 | Two Atlas + six Juno + probe; split return stage; land, collect sample, ascend, rendezvous, return Earth. |
| Man on the Moon and Back | Lunar Survey, Lunar Lander | Rendezvous + Landing + Re-Entry | 17 (19 with Lunar Station variant) | Two Atlas + six Juno + Vostok + Eagle; staged rendezvous chain; lunar landing and return to Earth. |
| Lunar Station | Lunar Survey, Lunar Lander | Life Support + Landing | 13 | Atlas + three Juno + Eagle + supplies to Moon; survive year-end life support. |

### Mars and Phobos missions

| Mission | Also satisfies | Requires | Payload to Earth Orbit | Plan (compressed) |
|---|---|---|---:|---|
| Mars Survey | — | Surveying | 4 | 3 Juno + Probe to Mars Fly-By (3,3 time); survey Mars. |
| Mars Lander | Mars Survey | Landing | 5 | Atlas + Probe to Mars Orbit (5,3 time), then Mars(0). |
| Phobos Sample Return | (Can also satisfy Mars Survey with Surveying) | Rendezvous + Landing | 16 | Soyuz + Atlas + 2 Juno + Probe; split return stage; Phobos sample; return via Mars Orbit to Earth. |
| Mars Sample Return | Mars Survey, Mars Lander | Rendezvous + Landing | 21 | Soyuz + 2 Atlas + 3 Juno + Probe; staged sample-return architecture from Mars. |
| Mars Station | Mars Survey, Mars Lander | Life Support + Re-Entry + Landing | 15 | Soyuz + 4 Supplies + Vostok; Mars Orbit transfer consumes supplies; land and survive year end. |
| Man on Mars and Back | Mars Survey, Mars Lander | Rendezvous + Life Support + Landing + Re-Entry | 47 (52 station variant) | Saturn+Soyuz+2 Atlas+Vostok+6 Supplies; split return stage; Mars landing and Earth return with long-duration support. |

### Venus missions

| Mission | Also satisfies | Requires | Payload to Earth Orbit | Plan (compressed) |
|---|---|---|---:|---|
| Venus Survey | Also can satisfy Ceres Survey with Surveying timing | Surveying | 6 | Atlas + Juno + Probe via Inner Planets Transfer to Venus Fly-By; survey Venus. |
| Venus Lander | Venus Survey | Landing | 8 | Atlas + 3 Juno + Probe to Venus Orbit then Venus(0). |
| Venus Sample Return | Venus Survey, Venus Lander (also Ceres Survey timing synergy) | Rendezvous | 34 + later launch 7 | Multi-stack rendezvous architecture: reach Venus, sample, climb to Venus Orbit, meet final stage, return Earth. |
| Venus Station | Venus Survey, Venus Lander (also Ceres Survey timing synergy) | Life Support + Re-Entry | 17 | 3 Atlas + 3 Supplies + Vostok; consume supplies in transfer; survive year-end Life Support on Venus. |
| Man on Venus and Back | Venus Survey, Venus Lander (also Ceres Survey timing synergy) | Rendezvous + Life Support + Re-Entry | 47 + later launch 9 | 2-phase rendezvous architecture with supplies and return-stage rendezvous from Inner Transfer back to Earth. |

### Mercury missions

| Mission | Also satisfies | Requires | Payload to Earth Orbit | Plan (compressed) |
|---|---|---|---:|---|
| Mercury Survey | — | Surveying | 9 | 2 Atlas + Probe to Mercury Fly-By; survey Mercury. |
| Mercury Lander | Mercury Survey | Landing | 23 | Atlas + 2 Soyuz + Probe via Inner Transfer/Fly-By to Mercury landing. |
| Mercury Sample Return | Mercury Survey, Mercury Lander | Rendezvous + Landing | 65 + later launch 7 | Very heavy staged architecture (2 Saturn + Soyuz + 3 Atlas + 3 Juno + Probe), rendezvous return and separate final stage from Earth Orbit. |

### Ceres missions

| Mission | Also satisfies | Requires | Payload to Earth Orbit | Plan (compressed) |
|---|---|---|---:|---|
| Ceres Lander | — | Landing | 9 | 2 Atlas + Probe via Inner Transfer to Ceres landing; reveal Ceres tile. |
| Ceres Sample Return | Ceres Lander | Rendezvous + Landing | 23 + later launch 7 | 2 Soyuz + Atlas + Probe sample-return plus separately launched final stage rendezvous. |

### Anywhere mission

| Mission | Rule extracted |
|---|---|
| Extraterrestrial Life on Earth | Life can be on Moon (1/4), Mars (1/3), Venus (1/4); sample-return missions can bring it back. |

---

## 4) Cross-source conclusions for implementation

1. **These sources add high-value planning and stat detail**, but do **not** fully define every advancement card's exact outcome-deck removal rules.
2. Component summary confirms current project values for core rockets/capsules and gives explicit payload chart for validation tests.
3. Mission book provides practical stack recipes and rendezvous sequences that can be encoded as:
   - optional mission planner hints,
   - scripted "recommended plans,"
   - validation scenarios for tests.
4. Remote planning CSV is suitable as a secondary maneuver consistency check (after location-name normalization).
5. Mission book includes bodies not currently in the base-only implementation scope (e.g., Mercury); keep those gated by content scope flags.

---

## 5) Future coding checklist from this analysis

- [ ] Add a **Mission Planner Hint** data layer using this mission-book structure.
- [ ] Add payload regression tests using component summary chart values.
- [ ] Normalize and import Remote_Planning_Tool maneuver aliases into a verification test (not primary data source).
- [ ] Request/ingest official advancement-card text for advancement-specific research/removal mechanics.

