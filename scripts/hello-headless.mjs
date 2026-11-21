#!/usr/bin/env node

// Phase 0 environment smoke check. This is not a game or a Phase 1 contract run.
const result = {
  type: "hello",
  phase: 0,
  runtime: "node",
  headless: true,
};

process.stdout.write(`${JSON.stringify(result)}\n`);
