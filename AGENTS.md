# Agent instructions — Đảo Đèn Lồng

## Current scope
- The current milestone is Phase 0 setup. Do not claim Phase 1 gameplay or Test Contract v1.0 is implemented until it is actually built and verified.
- Read `docs/notes/phase-0.md` and the released phase requirements before changing scope.
- Phase 1 must satisfy the supplied PRD-0 and its exact `game.contract.json` / headless contract. Do not invent contract tuning values or report unverified requirements as passing.

## Project decisions
- Use JavaScript ES modules and Node.js for the deterministic, headless simulation so it runs on macOS and Linux without a GPU.
- Keep simulation logic independent from rendering. Add a browser 3D renderer only when implementing Phase 1; rendering must not change headless output.
- Use fixed 60 Hz integer ticks for contract simulation. Seed every random source and keep generated IDs deterministic.

## Phase 0 command
- Environment smoke check: `npm run hello:headless`
- It should print one JSON object and exit with code 0. This is only a runtime check, not a game test.

## Working rules
- Derive acceptance criteria from the current phase document. Record assumptions where the PRD is ambiguous.
- Keep contract JSON output on stdout; send errors to stderr and use the specified non-zero exit codes.
- Do not hand-edit generated evidence. Capture evidence by running the matching code at the matching commit/tag.
- Avoid adding dependencies until needed; never commit credentials, `.env`, or API keys.
