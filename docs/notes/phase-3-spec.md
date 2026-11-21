# Phase 3 spec — Ticket-03 "Đèn cạn dầu" (Contract v1.2)

Source: `context.md` Ticket-03. Design decisions: [ADR-003](../decisions/ADR-003-phase-3-fuel-and-dawn.md).

## Acceptance criteria and evidence

| # | Requirement | Acceptance criterion | Evidence |
|---|---|---|---|
| 1 | Fuel | Lit lantern starts at 100, loses 1/60 per tick (integer `fuelTicks`), goes out at ≤ 0 with `lantern_out`, `deposited = 0`, `ever_lit` kept | `tests/phase3.test.js` "decays…", `docs/scenarios/night1-fuel-drain.json` |
| 1 | Refuel | `used = min(carried, ceil((100−fuel)/10))`; full lantern not selectable, no event | tests "refuel…", "full lantern…" |
| 1 | Relight | Ever-lit lantern costs 5, never-lit costs 10; `lantern_lit.relight` | test "relight…" |
| 2 | Drain | Only `wander` shades target nearest lit lantern with fuel < 30; at ≤ 2 m → `drain`, 5/s stacked; `fuel_drain` every 60 ticks; exits to chase (≤ 6 m), stunned (pulse), wander (out/≥ 30/> 2 m) | test "wandering shade drains…", fuel-drain scenario |
| 2 | Safe zone | Fuel < 30 removes safe zone; refuel to ≥ 30 repels shades within 6 m to the edge for ≤ 30 ticks | test "refuel back to >=30…" |
| 3 | Win rule | No early win; at dawn alive and lit ≥ ceil(0.6 × N) → `dawn_survived`, else `dawn`; `no_flames` first | tests "dawn…", "no_flames on the dawn tick…", `night1-dawn-survived.json` |
| 4 | Capacity | `min(20, 10 + 2 × successful_lights)`; scenario lit lanterns don't count | test "capacity…" |
| 5 | Score | +5/mote, +100 first light, +40 relight, +5 pulse hit (+15 if draining), dawn win +50 + floor(fuel) per lit lantern, +50 per flame | tests above (score assertions) |
| 6 | Colour-blind palette | Saved setting; shade rim/eyes #00B3FF; UI warning #FFFFFF + ⚠; unlit lanterns 20% smaller with torn paper; low fuel blinks 1 Hz | Manual check in browser (Settings → "Bảng màu dễ phân biệt") |
| 7 | Contract v1.2 | Tuning keys, snapshot `fuel`/`ever_lit`/`relit_count`/`capacity`, scenario fields, events | test "contract v1.2…", "scenario accepts v1.2 fields…" |

## Assumptions
- Snapshot `fuel` = `round(fuelTicks / 6) / 10`; `deposited` for a lit lantern mirrors `floor(fuel / 10)`.
- A shade with no weak lantern and no player within 12 m walks toward the nearest unlit lantern.
- Tests that encoded the removed `all_lit` win, old score, or v1.1 durations were rewritten (comments in `tests/game.test.js` give the reason); none are skipped.
