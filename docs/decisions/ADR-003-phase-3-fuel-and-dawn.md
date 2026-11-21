# ADR-003: Fuel-based lanterns and dawn survival

- Status: Accepted
- Date: 2026-11-21
- Scope: Phase 3, Test Contract v1.2

## Context

Playtests showed that lighting every lantern ended a night too early. The new objective is to keep Mây alive and preserve enough lit lanterns until dawn. Lit lanterns can now run out of fuel, and Ink Shades can drain weak lanterns.

## Decisions

1. Model fuel as integer `fuelTicks`, where 60 ticks equal one displayed fuel unit. A lit lantern begins at 100 units, loses one unit per second, and becomes unlit at zero. Snapshots round fuel to one decimal place.
2. Preserve `ever_lit` and `relit_count` across extinguishing. Relighting an extinguished lantern costs five motes; a first lighting costs ten. Refuelling a lit lantern consumes the minimum whole number of motes needed, up to the carried amount.
3. Capacity is derived from successful lighting actions in the current night: `min(20, 10 + 2 * successful_lights)`. Scenario-provided lit lanterns do not increment that count.
4. Only a wandering shade selects a weak lit lantern. At two metres it enters `drain`, siphoning five fuel units per second. A shade already chasing Mây keeps its target. Lanterns below 30 fuel no longer provide a safe area.
5. Remove the early all-lit victory. Resolve the night only after all updates on the dawn tick: zero flames loses immediately with `no_flames`; otherwise survival requires at least `ceil(0.6 * lantern_count)` lit lanterns. A qualifying dawn wins with `dawn_survived`; a failed threshold loses with `dawn`.
6. Replace the old score formula with the v1.2 event, relight, dawn-lantern, dawn-fuel, and remaining-flame awards. There is no time bonus.

## Consequences

- Contract snapshots and scenario inputs are incompatible with v1.1: fuel, history, capacity, successful-light count, and shade target fields are added.
- `all_lit` is no longer a terminal reason/event. Consumers must handle fuel, `refuel`, `lantern_out`, `fuel_drain`, `drain`, and `dawn_survived`.
- Tests that asserted immediate victory or old score totals must be rewritten against dawn resolution and v1.2 scoring.
- Fixed integer fuel ticks avoid floating-point drift while preserving the required one-decimal snapshot format.

## Validation

Implementation evidence should be captured from the v1.2 code and scenarios. The Phase 0 `hello:headless` smoke check alone does not verify these game rules.
