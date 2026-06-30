# Leaving Earth Advancements & Components Reference (Addendum)

Date saved: 2026-06-30  
Purpose: persist data from the two latest uploaded PDFs, with focus on advancement outcomes.

## Source files analyzed

1. `/home/ubuntu/.cursor/projects/workspace/uploads/leaving_earth_components_guide_-_with_stations_-_monochrome_fd6e.pdf`
2. `/home/ubuntu/.cursor/projects/workspace/uploads/Leaving_Earth_Card_and_Advancement_Reference_Core_Game_d8f9.pdf`

---

## A) Key rule extracted (from source table)

The `Advancements` table explicitly includes an `Outcomes` column.  
Interpretation: **this is the number of outcome cards to buy/draw for that advancement**.

---

## B) Advancement outcomes table (as extracted)

### Core/base advancements

| Advancement | Cost | Outcomes | Requirements | Component unlocks |
|---|---:|---:|---|---|
| Surveying | 10 | 1 | None | Galileo, Science Module |
| Juno | 10 | 3 | None | Juno |
| Atlas | 10 | 3 | None | Atlas |
| Soyuz | 10 | 3 | None | Soyuz |
| Saturn | 10 | 3 | None | Saturn |
| Thrusters (Ion) | 10 | 3 | None | Ion Thrusters |
| Rendezvous | 10 | 3 | None | Explorer |
| Re-Entry | 10 | 3 | None | Vostok, Apollo |
| Landing | 10 | 3 | None | Eagle |
| Life Support | 10 | 3 | None | Aldrin, Medical Module |

### Non-core / station-related entries also present in the same source

| Advancement | Cost | Outcomes | Requirements | Component unlocks |
|---|---:|---:|---|---|
| Proton | 10 | 3 | Soyuz | Proton |
| Shuttle | 10 | 3 | Re-Entry, Atlas | Shuttle, Daedalus, Fuel |
| Aerobraking | 10 | 3 | Re-Entry | None |
| Rover | 3 | 5 | Surveying | Rover |
| Synthesis | 10 | 5 | Life Support | Hydroponics, Fuel Synthesis, Space and Ground Habitats |

Note: this source mixes core and non-core content in one table.

---

## C) Components table extracted (same source, page 2)

Contains cost/weight/thrust/seats/required advancement for:

- Core-like items: Juno, Atlas, Soyuz, Saturn, Thrusters, Vostok, Apollo, Eagle, Aldrin, Probe
- Additional items: Proton, Shuttle, Daedalus, Large Fuel, Small Fuel, Galileo, Explorer, Rover, Space Habitat, Ground Habitat, Science Module, Medical Module, Fuel Synthesizer, Hydroponics, Experiment, Medical Supplies, Food, Spare Parts, Astronaut

This is useful as a cross-check sheet, but expansion entries should stay feature-gated in implementation.

---

## D) Card reference PDF (image-based page)

`Leaving_Earth_Card_and_Advancement_Reference_Core_Game_d8f9.pdf` is image-based (no embedded text extraction via PDF text parser).  
It was visually inspected after rendering to PNG and appears to be a monochrome card-layout reference.

Observed at a glance:

- Core rocket cards with discard/thrust values (Juno/Atlas/Soyuz/Saturn)
- Core capsule/support cards (Vostok/Apollo/Eagle/Aldrin/Supplies)
- Ion Thruster card

Reliability note:

- Since this page is a visual card montage and not machine-readable text, use it as a **visual confirmation source**, not the primary numeric source when table data is available.

---

## E) Implementation-impact notes

1. The advancement `Outcomes` column provides concrete counts to drive advancement setup.
2. Highest-impact core value from this source: `Surveying` shows `Outcomes = 1` while many other advancements are `3`.
3. Current code should be reconciled against this table before finalizing advancement logic.
4. Keep non-core advancements/components behind scope flags until explicitly enabled.

