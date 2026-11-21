#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { Game, validateFrames, validateScenario } from "./sim.js";

function args(argv){const out={};for(let i=0;i<argv.length;i++){const a=argv[i];if(!a.startsWith("--"))throw new Error(`Unexpected argument: ${a}`);if(a==="--help"){out.help=true;continue;}const v=argv[++i];if(v===undefined||v.startsWith("--"))throw new Error(`Missing value for ${a}`);out[a.slice(2)]=v;}return out;}
async function json(path,label){try{return JSON.parse(await readFile(path,"utf8"));}catch(e){throw Object.assign(new Error(`Invalid ${label}: ${e.message}`),{code:2});}}
async function main(){let a;try{a=args(process.argv.slice(2));}catch(e){console.error(e.message);process.exitCode=1;return;}if(a.help){console.log("node src/cli.mjs --seed N --night 1|2|3 [--scenario file.json] [--inputs file.json] --ticks N --out file.jsonl [--snapshot-every N]");return;}
  for(const k of ["seed","night","ticks","out"])if(a[k]===undefined){console.error(`Missing --${k}`);process.exitCode=1;return;}
  const ints={seed:Number(a.seed),night:Number(a.night),ticks:Number(a.ticks),interval:Number(a["snapshot-every"]??10)};
  if(!Number.isSafeInteger(ints.seed)||!Number.isInteger(ints.night)||!Number.isInteger(ints.ticks)||ints.ticks<0||ints.ticks>21600||!Number.isInteger(ints.interval)||ints.interval<1){console.error("Invalid numeric argument");process.exitCode=1;return;}
  try{
    const scenario=a.scenario?await json(a.scenario,"scenario"):{};validateScenario(scenario);let frames=[];if(a.inputs){const input=await json(a.inputs,"inputs");frames=input?.frames;validateFrames(frames);}else frames=[];
    const game=new Game({night:ints.night,seed:ints.seed,scenario});const output=[JSON.stringify(game.snapshot()),...game.events.map(e=>JSON.stringify(e))];game.events=[];let fi=0;
    for(let i=0;i<ints.ticks&&["playing","paused"].includes(game.state);i++){
      const frame=frames[fi]?.tick===game.tick?frames[fi++]:{};
      game.runTick(frame);
      for(const e of game.events)output.push(JSON.stringify(e));game.events=[];
      if(game.tick%ints.interval===0)output.push(JSON.stringify(game.snapshot()));
    }
    output.push(JSON.stringify({type:"end",ticks:game.tick,state:game.state,score:game.score}));
    await writeFile(a.out,output.join("\n")+"\n","utf8");
  }catch(e){console.error(e.message);process.exitCode=e.code||1;}
}
main();
