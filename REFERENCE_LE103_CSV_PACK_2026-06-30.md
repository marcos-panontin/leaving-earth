# LE 1.03 CSV Pack Ingestion (Base-first, expansions separated)

Date saved: 2026-06-30  
Scope objective: keep **base game as active implementation**, preserve expansion data separately for later enablement.

## Files ingested

- `LE_1.03-README_e27a.csv`
- `LE_1.03-Components_03f3.csv`
- `LE_1.03-Technology_5749.csv`
- `LE_1.03-Missions_31d6.csv`
- `LE_1.03-Missions_data_c0bc.csv`
- `LE_1.03-Locations_data_1b63.csv`
- `LE_1.03-Legacy_Missions_c072.csv`
- `LE_1.03-Legacy_Locations_0bfd.csv`
- `LE_1.03-Map_data_380d.csv`
- `LE_1.03-Payload_3947.csv`
- `LE_1.03-OP_Missions_cb90.csv`
- `LE_1.03-new_content_6e45.csv`
- `LE_1.03-new_mechanics_9611.csv`
- `LE_1.03-Features_data_aa87.csv`
- `LE_1.03-Windows_f375.csv`
- `LE_1.03-dump_30be.csv`
- `LE_1.03-backup_Components_68c0.csv`
- `LE_1.03-backup_Missions_c76e.csv`

---

## High-confidence extracted rules/data

## 1) Advancements/outcome cards

From the advancement table: outcome count is per-technology.

Core set (active now):
- Surveying: 1 outcome card
- Juno/Atlas/Soyuz/Saturn/Thrusters(Ion)/Rendezvous/Re-Entry/Landing/Life Support: 3 outcome cards each

Expansion set (stored separately for later):
- Proton (3), Shuttle (3), Aerobraking (3), Rover (5), Synthesis (5)

## 2) Mission tiers observed in CSV

- `E`, `M`, `H`: base progression tiers
- `N`: outer planets / advanced content tier
- `O`: occupation mission tier

Implication: base-first filtering should primarily use E/M/H rows unless user enables extended content.

## 3) Maneuver/window/location data coverage

- `Map_data` includes base + cyclers + outer-planet transfer graph + lost-path markers.
- `Locations_data` includes base and outer locations with hazard shorthand (e.g. `R20`, `destr`, `1F`, `L`).
- `Windows` contains year-by-year launch window pattern data.
- `Payload` includes rocket max payload table and ion time-token payload table.

## 4) Operational workbook sheets (not primary rules source)

- `dump`, `backup_Components`, `backup_Missions`, and large parts of `Technology` contain internal workbook state and temporary values; these are useful for reverse engineering but not authoritative card text.

---

## Base-vs-expansion handling decision

For implementation stability:

1. Keep **core gameplay active**.
2. Keep expansion materials in code as separate catalogs.
3. Do not mix expansion missions/components into current draws unless explicitly enabled by a future content-switch.

This is now reflected by:
- core advancements retained in active datasets
- expansion CSV catalog saved in `src/data/expansion/le103Catalog.ts`

---

## Notes on reliability

- CSV pack appears to originate from an Excel automation model; some lines include helper text, shorthand, placeholders, and workbook artifacts.
- For final rules-critical behaviors (especially failure branches), official card text remains the highest-priority source.

