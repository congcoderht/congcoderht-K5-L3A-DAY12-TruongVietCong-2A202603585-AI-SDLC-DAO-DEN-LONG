import test from "node:test";
import assert from "node:assert/strict";
import { Game, validateScenario } from "../src/sim.js";

const quiet={random_motes:false,random_shades:false,random_drifters:false,motes:[],shades:[],drifters:[],charms:[],wind_enabled:false};
const run=(g,n,frame={})=>{for(let i=0;i<n&&g.state==="playing";i++)g.runTick(frame);};

test("lit lantern decays 1 fuel/s and goes out with lantern_out",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,lanterns:[{id:"L1",lit:true,fuel:2}]}});
  run(g,60);assert.equal(g.snapshot().lanterns[0].fuel,1);
  run(g,60);const l=g.snapshot().lanterns[0];
  assert.deepEqual([l.lit,l.fuel,l.deposited,l.ever_lit],[false,0,0,true]);
  assert.deepEqual(g.events.find(e=>e.name==="lantern_out"),{type:"event",tick:120,name:"lantern_out",data:{lantern_id:"L1"}});
});

test("refuel uses ceil((100-fuel)/10) motes, caps at 100 and scores +5 each",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,player:{pos:[0,0,25],carried:10},lanterns:[{id:"L1",lit:true,fuel:55}]}});
  g.runTick({interact:true});
  const e=g.events.find(x=>x.name==="refuel");
  assert.equal(e.data.amount,5);assert.equal(e.data.fuel,100);assert.equal(g.player.carried,5);assert.equal(g.score,25);
});

test("full lantern is not selectable for interaction",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,player:{pos:[0,0,25],carried:10},lanterns:[{id:"L1",lit:true}]}});
  g.lanterns[0].fuelTicks=6000;g.interact();
  assert.equal(g.player.carried,10);assert.ok(!g.events.some(e=>e.name==="refuel"));
});

test("relight costs 5 motes, scores +40 and increments relit_count and capacity",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,player:{pos:[0,0,25],carried:5,successful_lights:1},lanterns:[{id:"L1",lit:false,ever_lit:true}]}});
  g.runTick({interact:true});const l=g.snapshot().lanterns[0];
  assert.equal(l.lit,true);assert.equal(l.relit_count,1);assert.equal(g.score,5*5+40);
  assert.equal(g.snapshot().player.capacity,14);
  assert.equal(g.events.find(e=>e.name==="lantern_lit").data.relight,true);
});

test("capacity is 10 + 2 per successful light, capped at 20",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,player:{successful_lights:7}}});assert.equal(g.snapshot().player.capacity,20);
  const h=new Game({night:1,seed:1,scenario:{...quiet,player:{carried:12,successful_lights:1},motes:[[0,0,0]]}});h.runTick({});assert.equal(h.player.carried,12);
});

test("wandering shade drains a weak lantern, emits fuel_drain every 60 ticks",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,player:{pos:[0,0,-30]},lanterns:[{id:"L1",lit:true,fuel:20}],shades:[{id:"S1",pos:[0,0,23.5],state:"wander"}]}});
  run(g,1);assert.equal(g.shades[0].state,"drain");assert.equal(g.shades[0].targetLanternId,"L1");
  run(g,60);const e=g.events.find(x=>x.name==="fuel_drain");
  assert.equal(e.data.shade_id,"S1");assert.equal(e.data.lantern_id,"L1");
  // 1 tick decay before drain started + 60 ticks of (1 + 5)/60
  assert.ok(Math.abs(g.snapshot().lanterns[0].fuel-(20-61/60-5))<0.11);
});

test("pulse on a draining shade scores +15 and stuns it",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,player:{pos:[0,0,20],carried:5},lanterns:[{id:"L1",lit:true,fuel:20}],shades:[{id:"S1",pos:[0,0,23.5],state:"drain",target_lantern_id:"L1"}]}});
  g.runTick({pulse:true});assert.equal(g.score,15);assert.equal(g.shades[0].state,"stunned");
});

test("refuel back to >=30 repels shades within 6 m and ends drain",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,player:{pos:[0,0,26.5],carried:2},lanterns:[{id:"L1",lit:true,fuel:20}],shades:[{id:"S1",pos:[1,0,25],state:"drain",target_lantern_id:"L1"}]}});
  g.runTick({interact:true});assert.notEqual(g.shades[0].state,"drain");
  for(let i=0;i<30;i++)g.runTick({});assert.ok(Math.hypot(g.shades[0].pos[0],g.shades[0].pos[2]-25)>=5.9);
});

test("dawn with enough lit lanterns wins with dawn_survived and dawn score",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,time_left_s:1,lanterns:[{id:"L1",lit:true},{id:"L2",lit:true},{id:"L3",lit:true}]}});
  run(g,60);assert.equal(g.state,"won");
  assert.deepEqual(g.events.at(-1).data,{result:"won",reason:"dawn_survived"});
  assert.equal(g.score,3*(50+99)+3*50);
});

test("dawn below ceil(0.6 x lanterns) loses with dawn",()=>{
  const g=new Game({night:2,seed:1,scenario:{...quiet,time_left_s:1,lanterns:[{id:"L1",lit:true},{id:"L2",lit:true},{id:"L3",lit:true}]}});
  run(g,60);assert.equal(g.state,"lost");assert.deepEqual(g.events.at(-1).data,{result:"lost",reason:"dawn"});assert.equal(g.score,0);
});

test("no_flames on the dawn tick beats dawn_survived",()=>{
  const g=new Game({night:1,seed:1,scenario:{...quiet,time_left_s:1/60,player:{flames:1},lanterns:[{id:"L1",lit:true},{id:"L2",lit:true},{id:"L3",lit:true}],shades:[{id:"S1",pos:[0,0,0],state:"chase"}]}});
  g.runTick({});assert.equal(g.state,"lost");assert.equal(g.events.filter(e=>e.name==="game_over").length,1);assert.equal(g.events.at(-1).data.reason,"no_flames");
});

test("scenario accepts v1.2 fields and drain state",()=>{
  assert.doesNotThrow(()=>validateScenario({player:{successful_lights:2},lanterns:[{id:"L1",lit:true,fuel:50,ever_lit:true}],shades:[{pos:[0,0,0],state:"drain",target_lantern_id:"L1"}]}));
  assert.throws(()=>validateScenario({lanterns:[{id:"L1",fuel:-1}]}),{code:2});
});
