---
name: headless-game-verification
description: Verify a phase change against the deterministic JSONL game contract with reproducible scenario inputs.
---

# Headless game verification

Use this when changing simulation rules, contract fields, maps, or spawn schedules.

1. Read `game.contract.json` and the current phase acceptance table.
2. Run `npm test` before collecting a release result.
3. For each change, choose or add a scenario under `docs/scenarios/` and an input file under `docs/inputs/` when button frames are needed.
4. Run the exact `headless_cmd` with a fixed seed and `--snapshot-every` value. Keep the original output file; do not edit it by hand.
5. Run the same command a second time to a different output path and compare the complete JSONL files byte for byte.
6. Check tick 0, event tick ordering, rounded coordinates, pause `sim_tick`, and the final `end` record.
7. Record the command, runtime, exit code, and measured duration in `docs/proof/`. State clearly which acceptance criteria the result does and does not cover.

Do not claim the browser FPS threshold from headless timing; profile the browser build at 1280×720 separately.
