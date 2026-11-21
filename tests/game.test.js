import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Game, validateFrames } from "../src/sim.js";
import { NIGHT_CONFIG, TUNING } from "../src/config.js";

const quiet={random_motes:false,random_shades:false,random_drifters:false,motes:[],shades:[],drifters:[],charms:[],wind_enabled:false};

// Updated for Phase 3 (Ticket-03): contract bumped to v1.2 with fuel tuning.
test("contract v1.2 has matching three-night tuning and fuel keys",async()=>{
  const c=JSON.parse(await readFile(new URL("../game.contract.json",import.meta.url),"utf8"));
  assert.equal(c.contract_version,"1.2");for(const k of ["fuel_max","fuel_decay_per_s","fuel_per_mote","relight_cost","win_ratio","drain_per_s","low_fuel_threshold","capacity_max","night1_duration_s"])assert.equal(c.tuning[k],TUNING[k],k);assert.deepEqual([c.tuning.night1_duration_s,c.tuning.night2_duration_s,c.tuning.night3_duration_s],[240,270,300]);assert.equal(c.tuning.night2_duration_s,NIGHT_CONFIG[2].duration);assert.equal(c.tuning.night3_duration_s,NIGHT_CONFIG[3].duration);assert.equal(c.tuning.player_speed,TUNING.player_speed);
});

test("night 1 baseline has the PRD lantern layout and 24 mote points",()=>{
  assert.equal(NIGHT_CONFIG[1].lanterns.length,5);assert.equal(NIGHT_CONFIG[1].motePoints.length,24);assert.deepEqual(NIGHT_CONFIG[1].lanterns[0].pos,[0,0,25]);
});

test("night 1 shades spawn twice at five seconds, then follow the eight-second schedule",()=>{
  const g=new Game({night:1,seed:8,scenario:{...quiet,random_shades:true}});for(let i=0;i<300;i++)g.runTick({});assert.equal(g.shades.length,2);assert.deepEqual(g.shades.map(s=>s.id),["S1","S2"]);
  for(let i=0;i<480;i++)g.runTick({});assert.equal(g.shades.length,3);assert.equal(g.events.filter(e=>e.name==="shade_spawned").length,3);
});

test("dash triggers on rising edge and moves at the contract speed",()=>{
  const g=new Game({night:1,seed:1,scenario:quiet});g.runTick({move:[0,1],dash:true});
  assert.equal(g.events.find(e=>e.name==="dash").tick,1);assert.ok(g.player.pos[2]>0.22);assert.equal(g.player.dashCd,90); // Ticket-02 normalized cooldown 1.5 s
});

test("wind charm removes dash cooldown while active",()=>{
  const g=new Game({night:2,seed:1,scenario:{...quiet,player:{pos:[35,0,0],charm_ticks:2}}});g.runTick({move:[0,1],dash:true});assert.equal(g.player.dashCd,0);assert.ok(g.player.pos[2]>0.23);
});

test("wind charm pickup sets 600-tick timer and respawns after 2700 ticks",()=>{
  const g=new Game({night:2,seed:1,scenario:{...quiet,charms:[{id:"C1",pos:[0,0,0]}]}});g.runTick({});
  assert.equal(g.player.charm,600);assert.equal(g.charms[0].available,false);assert.ok(g.events.some(e=>e.name==="charm_picked"));
  g.player.pos=[0,0,10];for(let i=1;i<=2700;i++)g.runTick({});assert.equal(g.charms[0].available,true);
});

test("drifter steals at most three motes and records its state",()=>{
  const g=new Game({night:2,seed:1,scenario:{...quiet,player:{carried:7},drifters:[{id:"D1",pos:[0,0,0],state:"chase"}]}});g.runTick({});
  assert.equal(g.player.carried,4);assert.equal(g.drifters[0].stolen,3);assert.equal(g.drifters[0].state,"flee");
  assert.deepEqual(g.events.find(e=>e.name==="drifter_steal").data,{drifter_id:"D1",amount:3,carried:4});
});

test("pulse against a fleeing drifter returns stolen motes as dropped motes",()=>{
  const g=new Game({night:2,seed:1,scenario:{...quiet,player:{carried:5},drifters:[{id:"D1",pos:[1,0,0],state:"flee",stolen:2,state_ticks_left:80}]}});g.runTick({pulse:true});
  assert.equal(g.player.carried,2); // Ticket-02 pulse cost is 3 motesassert.equal(g.drifters[0].state,"removed");assert.ok(g.motes.some(m=>m.kind==="dropped"));assert.ok(g.events.some(e=>e.name==="drifter_drop"&&e.data.amount===2));
});

test("pause freezes simulation and a rising-edge resume continues it",()=>{
  const g=new Game({night:1,seed:1,scenario:quiet}),before=g.timeLeft;g.runTick({pause:true});assert.equal(g.state,"paused");assert.equal(g.simTick,0);assert.equal(g.tick,1);
  g.runTick({pause:false});g.runTick({pause:true});assert.equal(g.state,"playing");assert.equal(g.simTick,0);assert.equal(g.tick,3);assert.ok(g.events.some(e=>e.name==="paused"));assert.ok(g.events.some(e=>e.name==="resumed"));
  g.runTick({pause:false});assert.equal(g.simTick,1);assert.ok(g.timeLeft<before);
});

test("held pause does not resume until the input is released and pressed again",()=>{
  const g=new Game({night:1,seed:1,scenario:quiet});g.runTick({pause:true});g.runTick({});g.runTick({});assert.equal(g.state,"paused");assert.equal(g.simTick,0);g.runTick({pause:false});g.runTick({pause:true});assert.equal(g.state,"playing");assert.equal(g.simTick,0);
});

test("night 2 map has two islands, bridge, six lights and 24 mote spawn points",()=>{
  assert.deepEqual(NIGHT_CONFIG[2].islands,[[0,0],[70,0]]);assert.equal(NIGHT_CONFIG[2].lanterns.length,6);assert.equal(NIGHT_CONFIG[2].motePoints.length,24);assert.equal(NIGHT_CONFIG[2].shadeMax,8);
});

test("night 2 jump pad carries Mây to the destination island",()=>{
  const g=new Game({night:2,seed:1,scenario:{...quiet,player:{pos:[20,0,18]}}});for(let i=0;i<120;i++)g.runTick({});
  assert.equal(g.player.grounded,true);assert.ok(Math.hypot(g.player.pos[0]-70,g.player.pos[2])<=28);
});

test("night 2 drifters start at tick 1200 with deterministic IDs",()=>{
  const g=new Game({night:2,seed:9,scenario:{...quiet,random_drifters:true}});for(let i=0;i<1200;i++)g.runTick({});
  assert.equal(g.drifters.length,1);assert.equal(g.drifters[0].id,"D1");
});

test("night 3 wind is forecast two seconds before it becomes active",()=>{
  const g=new Game({night:3,seed:42,scenario:{...quiet,wind_enabled:true}});for(let i=0;i<1679;i++)g.runTick({});assert.equal(g.wind.active,false);g.runTick({});assert.equal(g.wind.active,false);const dir=g.wind.dir_deg;
  for(let i=1680;i<1800;i++)g.runTick({});assert.equal(g.wind.active,true);assert.equal(g.wind.dir_deg,dir);
});

test("night 3 contract map includes 3 tiers, seven lights and 30 mote positions",()=>{
  assert.equal(NIGHT_CONFIG[3].lanterns.length,7);assert.equal(NIGHT_CONFIG[3].motePoints.length,30);assert.equal(NIGHT_CONFIG[3].shadeMax,10);
});

test("night 3 launch pad lands Mây on the raised center tier",()=>{
  const g=new Game({night:3,seed:1,scenario:{...quiet,player:{pos:[0,3,13]}}});for(let i=0;i<100;i++)g.runTick({});
  assert.equal(g.player.grounded,true);assert.equal(g.player.pos[1],6);assert.ok(Math.hypot(g.player.pos[0],g.player.pos[2])<8);assert.ok(Math.hypot(g.player.pos[0],g.player.pos[2])>=2);
});

test("fall hit reports lost carried motes and respawns Mây safely",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,player:{pos:[39.99,0,0],carried:4}}});// Ticket-02: fall below Y=-10, wait 60 ticks, then respawn.
  for(let i=0;i<200&&!g.events.some(e=>e.name==="player_hit");i++)g.runTick({move:[1,0]});assert.ok(g.player.respawnWait>0);for(let i=0;i<60;i++)g.runTick({});assert.equal(g.player.invuln,90);
  const hit=g.events.find(e=>e.name==="player_hit"&&e.data.by==="fall");assert.ok(hit);assert.equal(hit.data.lost,4);assert.equal(g.player.flames,2);assert.ok(Math.hypot(g.player.pos[0],g.player.pos[2])<1);assert.equal(g.player.grounded,true);
});

test("input frame ticks must be strictly increasing and values valid",()=>{
  assert.throws(()=>validateFrames([{tick:1},{tick:1}]),{code:2});assert.throws(()=>validateFrames([{tick:0,move:[2,0]}]),{code:2});assert.throws(()=>validateFrames([{tick:0,pause:1}]),{code:2});
});

// Replaced in Phase 3: the all_lit early victory and time-bonus score were removed by Ticket-03 section 3/5.
test("lighting every lantern no longer ends the night early",()=>{
  const lanterns=[{id:"L1",pos:[0,0,0]},...NIGHT_CONFIG[1].lanterns.slice(1).map(l=>({id:l.id,lit:true}))];
  const g=new Game({night:1,seed:1,scenario:{...quiet,player:{carried:10},lanterns}});g.runTick({interact:true});
  assert.equal(g.state,"playing");assert.equal(g.score,150);assert.ok(g.events.some(e=>e.name==="lantern_lit"&&e.data.relight===false));assert.ok(!g.events.some(e=>e.name==="game_over"));
});

test("headless output is deterministic and ends with JSONL end record",async()=>{
  const dir=await mkdtemp(path.join(os.tmpdir(),"lantern-test-"));try{
    const out1=path.join(dir,"a.jsonl"),out2=path.join(dir,"b.jsonl");
    for(const out of [out1,out2]){const r=spawnSync(process.execPath,["src/cli.mjs","--seed","19","--night","1","--ticks","1200","--snapshot-every","60","--out",out],{cwd:path.resolve("."),encoding:"utf8"});assert.equal(r.status,0,r.stderr);}
    const a=await readFile(out1,"utf8"),b=await readFile(out2,"utf8");assert.equal(a,b);const rows=a.trim().split("\n").map(JSON.parse);assert.equal(rows[0].tick,0);assert.equal(rows.at(-1).type,"end");assert.equal(rows.at(-1).ticks,1200);
  }finally{await rm(dir,{recursive:true,force:true});}
});

test("malformed headless scenario exits with contract code 2",async()=>{
  const dir=await mkdtemp(path.join(os.tmpdir(),"lantern-invalid-"));try{const scenario=path.join(dir,"bad.json"),out=path.join(dir,"out.jsonl");await writeFile(scenario,'{"player":{"pos":[0,0]}}');const r=spawnSync(process.execPath,["src/cli.mjs","--seed","1","--night","1","--scenario",scenario,"--ticks","1","--out",out],{cwd:path.resolve("."),encoding:"utf8"});assert.equal(r.status,2);assert.match(r.stderr,/Invalid scenario/);}finally{await rm(dir,{recursive:true,force:true});}
});

// Updated in Phase 3: night 3 now lasts 300 s = 18,000 ticks; the run still uses the 21,600-tick contract budget.
test("full night 3 simulation (budget 21,600 ticks) completes below 30 seconds",()=>{
  const g=new Game({night:3,seed:7,scenario:{...quiet,wind_enabled:false}}),start=performance.now();for(let i=0;i<21600&&["playing","paused"].includes(g.state);i++)g.runTick({});
  assert.equal(g.tick,18000);assert.equal(g.state,"lost");assert.equal(g.events.at(-1).data.reason,"dawn");assert.ok(performance.now()-start<30000);
});
