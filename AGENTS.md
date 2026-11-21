# Agent instructions — Đảo Đèn Lồng

## Current scope
- The repository now contains the Phase 1 baseline and Phase 2 extension; keep `docs/notes/phase-1-spec.md` and `phase-2-spec.md` aligned with behavior.
- Read the supplied phase requirement and acceptance criteria before changing scope.
- `game.contract.json` is the source of exposed tuning values. They must match Ticket-02 Part 1 (normalized table, see `context.md`) and Ticket-03 (contract v1.2). Never invent provisional values when a ticket gives a number.

## Project decisions
- Use JavaScript ES modules and Node.js for the deterministic, headless simulation so it runs on macOS and Linux without a GPU.
- Keep simulation logic independent from rendering. Add a browser 3D renderer only when implementing Phase 1; rendering must not change headless output.
- Use fixed 60 Hz integer ticks for contract simulation. Seed every random source and keep generated IDs deterministic.

## Phase 0 command
- Environment smoke check: `npm run hello:headless`
- It should print one JSON object and exit with code 0. This is only a runtime check, not a game test.

## Build and verification
- `npm run build` checks required browser and contract files.
- `npm test` runs deterministic headless scenarios and contract regressions.
- `node src/cli.mjs --seed 1 --night 1 --ticks 600 --out out.jsonl` runs a headless simulation; select night 1–3 and add `--scenario` / `--inputs` as needed.
- `npm run start` serves the browser game at `http://127.0.0.1:5173`.

## Working rules
- Derive acceptance criteria from the current phase document. Record assumptions where the PRD is ambiguous.
- Keep contract JSON output on stdout; send errors to stderr and use the specified non-zero exit codes.
- Do not hand-edit generated evidence. Capture evidence by running the matching code at the matching commit/tag.
- Avoid adding dependencies until needed; never commit credentials, `.env`, or API keys.
