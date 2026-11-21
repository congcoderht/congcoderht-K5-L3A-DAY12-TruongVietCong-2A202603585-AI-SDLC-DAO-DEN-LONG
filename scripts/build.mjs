import { access } from "node:fs/promises";
for (const path of ["game.contract.json","index.html","src/sim.js","src/app.js","styles.css"]) await access(new URL(`../${path}`,import.meta.url));
console.log("Build check passed: browser assets and game.contract.json are present.");
