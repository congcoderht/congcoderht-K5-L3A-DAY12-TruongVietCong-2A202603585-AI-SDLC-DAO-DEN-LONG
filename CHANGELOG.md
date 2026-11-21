# Changelog

## Phase 3 — Contract v1.2

### Breaking changes

- Contract version changes from `1.1` to `1.2`; night durations are now 240/270/300 seconds.
- Lanterns have fuel and persistent `ever_lit`/`relit_count` history. Lit lanterns decay by 1 fuel per second, can be refuelled, and extinguish at zero.
- Relighting a previously lit lantern costs 5 motes; first lighting still costs 10. Successful lighting actions increase carrying capacity from 10 by 2, capped at 20.
- Ink Shades can enter `drain`, target weak lit lanterns while wandering, and siphon 5 fuel per second. Fuel below 30 removes the lantern's safe area.
- The all-lit early victory is removed. Victory now resolves at dawn if Mây is alive and at least 60% of lanterns remain lit. End reasons are `dawn_survived`, `dawn`, and `no_flames`; `all_lit` is removed.
- Scoring is replaced: mote deposits/refuels, first lights, relights, shade stuns, dawn lanterns/fuel, and remaining flames use the v1.2 values. Time bonus is removed.
- Snapshot and scenario schemas add fuel, lantern history, capacity, successful-light count, and shade target fields. New events include `refuel`, `lantern_out`, and periodic `fuel_drain`; `lantern_lit` adds `relight`.
- Saved accessibility settings add the color-distinguishable palette. Off/low-fuel lanterns gain non-colour visual cues.

See [ADR-003](docs/decisions/ADR-003-phase-3-fuel-and-dawn.md) for the state and victory design decisions.

### Fixes in Phase 3

- Tuning normalized to Ticket-02 Part 1 (player 6 m/s, shade 4 m/s / 4.5 on night 3, pickup 1 m, pulse 3 motes / 5 m 3D / 4 m push over 15 ticks, safe radius 6 m, hit drop 50%, dropped-mote TTL 480, dash cooldown 1.5 s, gravity 20, fall below Y = -10 with 60-tick respawn wait).
- HUD shows carried/capacity, refuel/relight prompts, low-fuel warnings; lantern fuel bar and colour-blind palette added.
