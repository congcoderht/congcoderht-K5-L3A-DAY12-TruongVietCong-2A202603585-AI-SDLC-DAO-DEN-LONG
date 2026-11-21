import { TICK_HZ, TUNING, NIGHT_CONFIG, DEFAULT_CHARM_DURATION, CHARM_RESPAWN_TICKS, DRIFTER_SPEED, DRIFTER_IDLE_SPEED, DRIFTER_MAX, DRIFTER_SPAWN_INTERVAL, DRIFTER_CHASE_RANGE, DRIFTER_CONTACT, DRIFTER_FLEE_TICKS, DRIFTER_DROP_TICKS, CHARM_SPEED, DRIFT_TTL_TICKS } from "./config.js";
import { makeRng, round3, distanceXZ, clamp } from "./random.js";

const pos3 = (p, fallback=[0,0,0]) => Array.isArray(p) && p.length === 3 && p.every(Number.isFinite) ? p.map(Number) : [...fallback];
const idNum = s => Number(String(s).replace(/\D/g,"")) || 0;
const clone = x => structuredClone(x);

export class Game {
  capacityFor(successfulLights){return Math.min(TUNING.capacity_max,10+2*successfulLights);}
  constructor({night=1,seed=1,scenario={}}={}) {
    if (![1,2,3].includes(Number(night))) throw new Error("--night must be 1, 2, or 3");
    this.night=Number(night); this.map=NIGHT_CONFIG[this.night]; this.seed=Number(seed)>>>0; this.rng=makeRng(this.seed);
    this.tick=0; this.simTick=0; this.timeLeft=this.map.duration; this.state="playing"; this.score=Number(scenario.score_total)||0; this.events=[];
    this.serial={shade:0,drifter:0,mote:0}; this.randomMotes=scenario.random_motes ?? true; this.randomShades=scenario.random_shades ?? true; this.randomDrifters=scenario.random_drifters ?? true;
    this.windEnabled=scenario.wind_enabled ?? true; this.wind={active:false,dir_deg:0}; this.windForecastDir=0;
    const p=scenario.player||{};
    this.player={pos:pos3(p.pos,this.map.startPosition||[0,0,0]),vel:[0,0,0],grounded:true,carried:p.carried??0,flames:p.flames??TUNING.flames,
      invuln:p.invuln_ticks??0,dashCd:p.dash_cd_ticks??0,pulseCd:p.pulse_cd_ticks??0,charm:p.charm_ticks??0,dashLeft:0,jumpV:0,groundY:0,launchLocked:false,launchVel:[0,0],successfulLights:p.successful_lights??0};
    this.player.capacity=this.capacityFor(this.player.successfulLights);
    this.player.groundY=Array.isArray(p.pos)&&Number.isFinite(p.pos[1])?p.pos[1]:this.surfaceY(this.player.pos);this.player.pos[1]=this.player.groundY;
    this.lanterns=this.map.lanterns.map(l=>({...clone(l),deposited:0,lit:false,fuelTicks:0,ever_lit:false,relit_count:0}));
    for (const patch of scenario.lanterns||[]) { const l=this.lanterns.find(x=>x.id===patch.id); if(l){if(patch.pos)l.pos=pos3(patch.pos);if(patch.lit!==undefined)l.lit=patch.lit;if(patch.fuel!==undefined)l.fuelTicks=Math.round(clamp(patch.fuel,0,TUNING.fuel_max)*TICK_HZ);else if(patch.lit===true)l.fuelTicks=TUNING.fuel_max*TICK_HZ;if(patch.ever_lit!==undefined)l.ever_lit=patch.ever_lit;else l.ever_lit=l.lit;if(patch.relit_count!==undefined)l.relit_count=patch.relit_count;if(!l.lit||l.fuelTicks<=0){l.lit=false;l.fuelTicks=0;}l.deposited=Number.isFinite(patch.deposited)?patch.deposited:Math.floor(l.fuelTicks/(TICK_HZ*TUNING.fuel_per_mote));} }
    this.motes=this.map.motePoints.map(pos=>this.newMote(pos,"random"));
    if (Array.isArray(scenario.motes)) this.motes=scenario.motes.map(m=>this.newMote(Array.isArray(m)?m:m.pos,m.kind||"random",m.id));
    this.shades=[]; if(Array.isArray(scenario.shades)) this.shades=scenario.shades.map(s=>({...this.newShade(s.pos,s.id,s.state||"wander",s.state_ticks_left||0),targetLanternId:s.target_lantern_id||null,drainTicks:s.drain_ticks||0}));
    this.drifters=[]; if(Array.isArray(scenario.drifters)) this.drifters=scenario.drifters.map(d=>({...this.newDrifter(d.pos,d.id),state:d.state||"idle",stolen:d.stolen||0,stateTicks:d.state_ticks_left||0}));
    this.charms=this.map.charms?.map(c=>({...clone(c),available:true,respawn:0}))||[];
    if(Array.isArray(scenario.charms)) this.charms=scenario.charms.map(c=>({id:c.id,pos:pos3(c.pos),available:c.available!==false,respawn:c.respawn_ticks||0}));
    if(scenario.time_left_s!==undefined)this.timeLeft=Number(scenario.time_left_s);
    this.timeStart=this.timeLeft;
    for(const m of this.motes)this.serial.mote=Math.max(this.serial.mote,idNum(m.id));
    for(const s of this.shades)this.serial.shade=Math.max(this.serial.shade,idNum(s.id));
    for(const d of this.drifters)this.serial.drifter=Math.max(this.serial.drifter,idNum(d.id));
    this.inputs={move:[0,0],cam_yaw_deg:0,jump:false,interact:false,pulse:false,dash:false,pause:false};
    this.was={jump:false,interact:false,pulse:false,dash:false,pause:false};
    this.rampLaunch=null; this.pulseSerial=0; this.countdownSounded=false;
    this.emit("night_start",{night:this.night},0);
  }
  newMote(pos,kind="random",id){return {id:id||`M${++this.serial.mote}`,pos:pos3(pos),kind,ttl:kind==="dropped"?DRIFT_TTL_TICKS:null};}
  newShade(pos,id,state="spawning",stateTicks=30){return {id:id||`S${++this.serial.shade}`,pos:pos3(pos),state,stateTicks,stunned:0,recoil:0,hitIds:[],targetLanternId:null,drainTicks:0,repelTicks:0,repelLanternId:null};}
  newDrifter(pos,id){return {id:id||`D${++this.serial.drifter}`,pos:pos3(pos),state:"idle",stolen:0,stateTicks:0,hasStolen:false};}
  emit(name,data={},at=this.tick){this.events.push({type:"event",tick:at,name,data});}
  fuelOf(l){return l.fuelTicks/TICK_HZ;}
  tickFuel(){
    for(const l of this.lanterns){if(!l.lit)continue;const draining=this.shades.filter(s=>s.state==="drain"&&s.targetLanternId===l.id);l.fuelTicks=Math.max(0,l.fuelTicks-Math.round(TUNING.fuel_decay_per_s)-draining.length*Math.round(TUNING.drain_per_s));l.deposited=Math.floor(l.fuelTicks/(TICK_HZ*TUNING.fuel_per_mote));
      for(const s of draining){s.drainTicks++;if(s.drainTicks%TICK_HZ===0)this.emit("fuel_drain",{lantern_id:l.id,shade_id:s.id,fuel:Math.round(this.fuelOf(l)*10)/10},this.tick);}
      if(l.fuelTicks<=0){l.lit=false;l.deposited=0;this.emit("lantern_out",{lantern_id:l.id},this.tick);}
    }
  }
  applyInput(frame={}){for(const k of ["move","cam_yaw_deg","jump","interact","pulse","dash","pause"])if(frame[k]!==undefined)this.inputs[k]=frame[k];}
  runTick(frame={}){
    const old=this.tick;this.tick++;
    const wasPaused=this.state==="paused";
    this.applyInput(frame);
    const justPressed={};for(const k of ["jump","interact","pulse","dash","pause"])justPressed[k]=!!this.inputs[k]&&!this.was[k];
    if(justPressed.pause){if(this.state==="paused"){this.state="playing";this.emit("resumed",{},this.tick);}else if(this.state==="playing"){this.state="paused";this.emit("paused",{},this.tick);}}
    for(const k of Object.keys(this.was))this.was[k]=!!this.inputs[k];
    if(this.state==="paused"||wasPaused&&justPressed.pause)return;
    if(this.state!=="playing")return;
    this.simTick++;
    const step=1/TICK_HZ;this.timeLeft=Math.max(0,this.timeStart-this.simTick/TICK_HZ);
    for(const k of ["invuln","dashCd","pulseCd","charm"])this.player[k]=Math.max(0,this.player[k]-1);
    for(const s of this.shades){s.stunned=Math.max(0,s.stunned-1);s.stateTicks=Math.max(0,s.stateTicks-1);s.recoil=Math.max(0,s.recoil-1);if(s.state==="recoil"&&s.recoil===0)s.state="stunned";}
    for(const d of this.drifters)d.stateTicks=Math.max(0,d.stateTicks-1);
    for(const c of this.charms)if(!c.available){c.respawn=Math.max(0,c.respawn-1);if(c.respawn===0)c.available=true;}
    for(const m of this.motes)if(m.ttl!==null)m.ttl--;
    this.motes=this.motes.filter(m=>m.ttl===null||m.ttl>0);
    this.tickFuel();
    this.stepWind(); this.movePlayer(justPressed,step); this.pickups();
    if(justPressed.interact)this.interact(); this.updateSafety();
    if(justPressed.pulse)this.pulse(); this.moveShades(); this.moveDrifters(); this.collisions();
    this.spawnEntities();this.finishCheck();
    this.player.pos=this.player.pos.map(round3);this.player.vel=this.player.vel.map(round3);
  }
  stepWind(){const w=this.map.windInterval;if(!w||!this.windEnabled)return;const t=this.simTick%w;if(t===w-this.map.windForecast){this.windForecastDir=Math.floor(this.rng()*360);}this.wind.active=this.simTick>0&&t<this.map.windDuration;this.wind.dir_deg=this.windForecastDir;if(this.wind.active){const a=this.wind.dir_deg*Math.PI/180;this.player.pos[0]+=Math.cos(a)*this.map.windSpeed/TICK_HZ;this.player.pos[2]+=Math.sin(a)*this.map.windSpeed/TICK_HZ;}}
  movePlayer(edge,dt){const p=this.player;const [mx,mz]=this.inputs.move;const len=Math.hypot(mx,mz);let x=len>1?mx/len:mx,z=len>1?mz/len:mz;const a=this.inputs.cam_yaw_deg*Math.PI/180;const wx=x*Math.cos(a)+z*Math.sin(a),wz=-x*Math.sin(a)+z*Math.cos(a);
    if(p.charm>0)p.dashCd=0;
    if(edge.dash&&p.dashCd===0&&p.dashLeft===0){p.dashLeft=Math.round(TUNING.dash_duration_s*TICK_HZ);p.dashCd=p.charm>0?0:Math.round(TUNING.dash_cooldown_s*TICK_HZ);this.emit("dash",{},this.tick);}
    const speed=p.charm>0?CHARM_SPEED:TUNING.player_speed;
    if(p.dashLeft>0){if(len>0){p.vel[0]=wx*TUNING.dash_speed;p.vel[2]=wz*TUNING.dash_speed;}p.dashLeft--;}
    else if(p.launchLocked){p.vel[0]=p.launchVel[0];p.vel[2]=p.launchVel[1];}
    else {p.vel[0]=wx*speed;p.vel[2]=wz*speed;}
    if(edge.jump&&p.grounded){p.jumpV=7;p.grounded=false;}
    if(p.grounded&&this.night===2&&Math.hypot(p.pos[0]-20,p.pos[2]-18)<=1){const d=Math.hypot(50,-18);p.vel[0]=24*50/d;p.vel[2]=24*(-18)/d;p.launchVel=[p.vel[0],p.vel[2]];p.launchLocked=true;p.groundY=0;p.jumpV=14;p.grounded=false;}
    if(p.grounded&&this.night===2&&Math.hypot(p.pos[0]-50,p.pos[2]+18)<=1){const d=Math.hypot(-50,18);p.vel[0]=24*(-50)/d;p.vel[2]=24*18/d;p.launchVel=[p.vel[0],p.vel[2]];p.launchLocked=true;p.groundY=0;p.jumpV=14;p.grounded=false;}
    if(p.grounded&&this.night===3&&Math.hypot(p.pos[0],p.pos[2]-13)<=1){p.vel[0]=0;p.vel[2]=-8;p.launchVel=[0,-8];p.launchLocked=true;p.groundY=6;p.jumpV=12;p.grounded=false;}
    const oldX=p.pos[0],oldZ=p.pos[2];p.pos[0]+=p.vel[0]*dt;p.pos[2]+=p.vel[2]*dt;
    if(this.night===3&&Math.hypot(p.pos[0],p.pos[2])<2.4&&p.pos[1]<8&&p.pos[1]+1.8>0){p.pos[0]=oldX;p.pos[2]=oldZ;}
    const walkable=this.isWalkable(p.pos),surface=walkable?this.surfaceY(p.pos):-10;
    if(p.grounded){
      if(!walkable){p.groundY=-10;p.grounded=false;p.jumpV=0;}
      else if(this.night===3&&this.onRamp(p.pos)){p.groundY=surface;p.pos[1]=surface;}
      else if(surface>p.groundY+.01){p.pos[0]=oldX;p.pos[2]=oldZ;}
      else if(surface<p.groundY-.01){p.groundY=surface;p.grounded=false;p.jumpV=0;}
    }else if(walkable&&surface>p.groundY&&p.pos[1]>surface){p.groundY=surface;}
    else if(!walkable)p.groundY=-10;
    if(!p.grounded){p.jumpV-=18*dt;p.pos[1]+=p.jumpV*dt;if(p.jumpV<=0&&p.pos[1]<=p.groundY){p.pos[1]=p.groundY;p.jumpV=0;p.grounded=true;p.launchLocked=false;}}
    else p.pos[1]=p.groundY;
    p.vel[1]=p.grounded?0:p.jumpV;
    if(p.pos[1]<-8&&TUNING.fall_enabled&&p.invuln===0){this.hit("fall");if(this.state!=="lost"){p.pos=pos3(this.map.startPosition||[0,0,0]);p.groundY=this.surfaceY(p.pos);p.pos[1]=p.groundY;p.grounded=true;p.jumpV=0;p.launchLocked=false;p.vel=[0,0,0];}}
  }
  onRamp(p){const r=Math.hypot(p[0],p[2]),ang=(Math.atan2(p[2],p[0])*180/Math.PI+360)%360;return r>=24&&r<=30&&Math.min(Math.abs(ang-30),Math.abs(ang-150))<=(1.5/r*180/Math.PI);}
  surfaceY(p){if(this.night!==3)return 0;const r=Math.hypot(p[0],p[2]);if(this.onRamp(p))return 3*(30-r)/6;if(r<=8)return 6;if(p[2]>0&&r>=12&&r<=24)return 3;return 0;}
  isWalkable(p){if(this.night===1)return Math.hypot(p[0],p[2])<=40;if(this.night===2){const onIsland=(cx)=>Math.hypot(p[0]-cx,p[2])<=28;return onIsland(0)||onIsland(70)||(p[0]>=26&&p[0]<=44&&Math.abs(p[2])<=2);}return Math.hypot(p[0],p[2])<=45;}
  pickups(){const p=this.player;for(const m of [...this.motes].sort((a,b)=>idNum(a.id)-idNum(b.id))){if(p.carried>=p.capacity)break;if(distanceXZ(p.pos,m.pos)<=TUNING.pickup_radius){this.motes=this.motes.filter(x=>x!==m);p.carried++;this.emit("mote_picked",{carried:p.carried},this.tick);}}
    for(const c of this.charms){if(c.available&&distanceXZ(p.pos,c.pos)<=TUNING.pickup_radius){c.available=false;c.respawn=CHARM_RESPAWN_TICKS;p.charm=DEFAULT_CHARM_DURATION;this.emit("charm_picked",{charm_id:c.id,charm_ticks:p.charm},this.tick);}}
  }
  interact(){
    const p=this.player,maxFuel=TUNING.fuel_max*TICK_HZ;
    const l=this.lanterns.filter(x=>(!x.lit||x.fuelTicks<maxFuel)&&distanceXZ(p.pos,x.pos)<=TUNING.interact_radius).sort((a,b)=>distanceXZ(p.pos,a.pos)-distanceXZ(p.pos,b.pos)||idNum(a.id)-idNum(b.id))[0];
    if(!l)return;
    if(l.lit){const used=Math.min(p.carried,Math.ceil((maxFuel-l.fuelTicks)/(TUNING.fuel_per_mote*TICK_HZ)));if(used<=0)return;const before=this.fuelOf(l);p.carried-=used;l.fuelTicks=Math.min(maxFuel,l.fuelTicks+used*TUNING.fuel_per_mote*TICK_HZ);l.deposited=Math.floor(l.fuelTicks/(TUNING.fuel_per_mote*TICK_HZ));this.score+=used*TUNING.score.per_mote;this.emit("refuel",{lantern_id:l.id,amount:used,fuel:Math.round(this.fuelOf(l)*10)/10},this.tick);if(before<TUNING.low_fuel_threshold&&this.fuelOf(l)>=TUNING.low_fuel_threshold)this.repelShades(l);return;}
    const relight=l.ever_lit,cost=relight?TUNING.relight_cost:TUNING.lantern_cost;if(p.carried<cost)return;p.carried-=cost;l.lit=true;l.fuelTicks=maxFuel;l.ever_lit=true;l.deposited=TUNING.fuel_max;if(relight)l.relit_count++;p.successfulLights++;p.capacity=this.capacityFor(p.successfulLights);this.score+=cost*TUNING.score.per_mote+(relight?TUNING.score.per_relight:TUNING.score.per_first_light);this.emit("deposit",{lantern_id:l.id,amount:cost,deposited:l.deposited},this.tick);this.emit("lantern_lit",{lantern_id:l.id,relight},this.tick);this.repelShades(l);
  }
  repelShades(l){for(const s of this.shades)if(distanceXZ(s.pos,l.pos)<=6){s.repelTicks=30;s.repelLanternId=l.id;if(s.state==="drain"){s.state="wander";s.drainTicks=0;}}}
  updateSafety(){for(const s of this.shades){if(s.state==="stunned"&&s.stunned===0)s.state="wander";const safe=this.lanterns.some(l=>l.lit&&this.fuelOf(l)>=TUNING.low_fuel_threshold&&distanceXZ(s.pos,l.pos)<=TUNING.safe_radius);s.safe=safe;}}
  pulse(){const p=this.player;if(p.pulseCd>0||p.carried<TUNING.pulse_cost)return;p.carried-=TUNING.pulse_cost;p.pulseCd=Math.round(TUNING.pulse_cooldown_s*TICK_HZ);this.pulseSerial++;const stunned=[];for(const s of this.shades){if(distanceXZ(p.pos,s.pos)<=TUNING.pulse_radius){s.hitIds.push(this.pulseSerial);this.score+=TUNING.score.per_stun;if(s.state!=="spawning"){s.state="recoil";s.recoil=12;s.stunned=Math.round(TUNING.pulse_stun_s*TICK_HZ);stunned.push(s.id);}const dx=s.pos[0]-p.pos[0],dz=s.pos[2]-p.pos[2],d=Math.hypot(dx,dz)||1;s.pos[0]+=dx/d*TUNING.pulse_push_m;s.pos[2]+=dz/d*TUNING.pulse_push_m;}}
    for(const d of this.drifters){if(distanceXZ(p.pos,d.pos)<=TUNING.pulse_radius){if(d.state==="chase"){d.state="flee";d.stateTicks=DRIFTER_DROP_TICKS;}else if(d.state==="flee"&&d.stolen>0){const amount=d.stolen;d.stolen=0;this.dropMotes(d.pos,amount);d.state="removed";this.emit("drifter_drop",{drifter_id:d.id,amount},this.tick);}}}
    this.emit("pulse",{stunned_ids:stunned.sort((a,b)=>idNum(a)-idNum(b))},this.tick);
  }
  dropMotes(pos,n){for(let i=0;i<n;i++)this.motes.push(this.newMote([pos[0]+(i%2)*.3,pos[1],pos[2]+Math.floor(i/2)*.3],"dropped"));}
  moveShades(){const p=this.player;for(const s of [...this.shades].sort((a,b)=>idNum(a.id)-idNum(b.id))){
    if(s.state==="spawning"){if(s.stateTicks===0)s.state="wander";continue;}
    if(s.state==="recoil"||s.stunned>0)continue;
    if(s.repelTicks>0){const l=this.lanterns.find(x=>x.id===s.repelLanternId);if(l){let dx=s.pos[0]-l.pos[0],dz=s.pos[2]-l.pos[2],d=Math.hypot(dx,dz)||1,step=Math.max(0,TUNING.safe_radius-d)/s.repelTicks;s.pos[0]+=dx/d*step;s.pos[2]+=dz/d*step;}s.repelTicks--;if(s.repelTicks===0)s.repelLanternId=null;continue;}
    if(s.state==="drain"){const l=this.lanterns.find(x=>x.id===s.targetLanternId),pd=distanceXZ(p.pos,s.pos);if(pd<=6){s.state="chase";s.drainTicks=0;}else if(!l||!l.lit||this.fuelOf(l)>=TUNING.low_fuel_threshold||distanceXZ(s.pos,l.pos)>2){s.state="wander";s.drainTicks=0;}else continue;}
    if(s.safe)continue;
    const pd=distanceXZ(p.pos,s.pos);if(s.state==="chase"){if(pd<22){const dx=p.pos[0]-s.pos[0],dz=p.pos[2]-s.pos[2],d=Math.hypot(dx,dz)||1;s.pos[0]+=dx/d*TUNING.shade_speed/TICK_HZ;s.pos[2]+=dz/d*TUNING.shade_speed/TICK_HZ;continue;}s.state="wander";}
    if(s.state==="wander"){
      const weak=this.lanterns.filter(l=>l.lit&&this.fuelOf(l)<TUNING.low_fuel_threshold).sort((a,b)=>distanceXZ(s.pos,a.pos)-distanceXZ(s.pos,b.pos)||idNum(a.id)-idNum(b.id))[0];
      const off=this.lanterns.filter(l=>!l.lit).sort((a,b)=>distanceXZ(s.pos,a.pos)-distanceXZ(s.pos,b.pos)||idNum(a.id)-idNum(b.id))[0];
      const target=weak||off;s.targetLanternId=target?.id||null;
      if(weak){const d=distanceXZ(s.pos,weak.pos);if(d<=2){s.state="drain";s.drainTicks=0;continue;}const dx=weak.pos[0]-s.pos[0],dz=weak.pos[2]-s.pos[2];s.pos[0]+=dx/d*TUNING.shade_speed*.5/TICK_HZ;s.pos[2]+=dz/d*TUNING.shade_speed*.5/TICK_HZ;continue;}
    }
    const dx=p.pos[0]-s.pos[0],dz=p.pos[2]-s.pos[2],d=Math.hypot(dx,dz)||1;if(d<22){s.state="chase";s.pos[0]+=dx/d*TUNING.shade_speed/TICK_HZ;s.pos[2]+=dz/d*TUNING.shade_speed/TICK_HZ;}else{s.pos[0]+=dx/d*TUNING.shade_speed*.5/TICK_HZ;s.pos[2]+=dz/d*TUNING.shade_speed*.5/TICK_HZ;}
  }}
  moveDrifters(){for(const d of this.drifters){if(d.state==="removed")continue;const p=this.player,dist=distanceXZ(p.pos,d.pos);if(d.state==="idle"&&p.carried>=5&&dist<=DRIFTER_CHASE_RANGE)d.state="chase";if(d.state==="chase"&&(p.carried<5||dist>DRIFTER_CHASE_RANGE))d.state="idle";let tx=p.pos[0]-d.pos[0],tz=p.pos[2]-d.pos[2],speed=d.state==="chase"?DRIFTER_SPEED:DRIFTER_IDLE_SPEED;if(d.state==="flee"){tx=-tx;tz=-tz;speed=DRIFTER_SPEED;if(d.stateTicks===0)d.state="removed";}const len=Math.hypot(tx,tz)||1;d.pos[0]+=tx/len*speed/TICK_HZ;d.pos[2]+=tz/len*speed/TICK_HZ;}}
  collisions(){const p=this.player;for(const d of [...this.drifters].sort((a,b)=>idNum(a.id)-idNum(b.id))){if(d.state==="chase"&&!d.hasStolen&&distanceXZ(p.pos,d.pos)<=DRIFTER_CONTACT){const amount=Math.min(3,p.carried);if(amount){p.carried-=amount;d.stolen=amount;d.hasStolen=true;d.state="flee";d.stateTicks=DRIFTER_FLEE_TICKS;this.emit("drifter_steal",{drifter_id:d.id,amount,carried:p.carried},this.tick);}}}
    for(const s of [...this.shades].sort((a,b)=>idNum(a.id)-idNum(b.id))){if(s.state==="spawning"||s.state==="recoil"||s.state==="stunned"||s.safe||p.invuln>0)continue;if(distanceXZ(p.pos,s.pos)<=TUNING.shade_hit_radius)this.hit("shade");}}
  hit(by){const p=this.player;if(p.invuln>0)return;const lost=by==="fall"?p.carried:Math.floor(p.carried*TUNING.hit_drop_ratio);p.carried-=lost;if(by==="shade")this.dropMotes(p.pos,lost);p.flames=Math.max(0,p.flames-1);p.invuln=Math.round(TUNING.invuln_s*TICK_HZ);const data={by,flames:p.flames,dropped:lost};if(by==="fall")data.lost=lost;this.emit("player_hit",data,this.tick);if(p.flames===0){this.state="lost";this.emit("game_over",{result:"lost",reason:"no_flames"},this.tick);}}
  spawnEntities(){const firstShade=this.simTick===this.map.shadeFirst;const shadeDue=firstShade||(this.simTick>this.map.shadeFirst&&(this.simTick-this.map.shadeFirst)%this.map.shadeInterval===0);if(this.randomShades&&shadeDue&&this.shades.length<this.map.shadeMax){const count=firstShade&&this.night===1?2:1;for(let i=0;i<count&&this.shades.length<this.map.shadeMax;i++){const candidates=this.map.shadePoints.filter(q=>distanceXZ(q,this.player.pos)>=15);const pos=candidates[Math.floor(this.rng()*candidates.length)]||this.map.shadePoints[0];const s=this.newShade(pos);this.shades.push(s);this.emit("shade_spawned",{id:s.id},this.tick);}}
    if(this.night>1&&this.randomDrifters&&this.simTick>0&&this.simTick%DRIFTER_SPAWN_INTERVAL===0&&this.drifters.filter(d=>d.state!=="removed").length<DRIFTER_MAX){const candidates=this.map.drifterSpawnPoints||this.map.shadePoints;const p=candidates[Math.floor(this.rng()*candidates.length)];const d=this.newDrifter(p);this.drifters.push(d);}
    if(this.randomMotes&&this.simTick%240===0&&this.motes.length<30){const p=this.map.motePoints[Math.floor(this.rng()*this.map.motePoints.length)];this.motes.push(this.newMote(p,"random"));}
  }
  finishCheck(){if(this.state!=="playing")return;if(this.lanterns.every(l=>l.lit)){this.state="won";this.score+=Math.floor(this.timeLeft)*TUNING.score.per_second_left+this.player.flames*TUNING.score.per_flame_left;this.emit("game_over",{result:"won",reason:"all_lit"},this.tick);return;}if(this.timeLeft<=0){this.state="lost";this.emit("game_over",{result:"lost",reason:"dawn"},this.tick);}else if(this.night===3&&this.timeLeft<=10&&!this.countdownSounded){this.countdownSounded=true;}}
  snapshot(){const p=this.player;return {type:"snapshot",tick:this.tick,sim_tick:this.simTick,state:this.state,night:this.night,time_left_s:round3(this.timeLeft),score:this.score,wind:{active:this.wind.active,dir_deg:this.wind.dir_deg},player:{pos:p.pos.map(round3),vel:p.vel.map(round3),flames:p.flames,carried:p.carried,grounded:p.grounded,invuln:round3(p.invuln/TICK_HZ),dash_cd_s:round3(p.dashCd/TICK_HZ),pulse_cd_s:round3(p.pulseCd/TICK_HZ),charm_s:round3(p.charm/TICK_HZ)},lanterns:this.lanterns.map(l=>({id:l.id,pos:l.pos.map(round3),lit:l.lit,deposited:l.deposited})),shades:this.shades.map(s=>({id:s.id,pos:s.pos.map(round3),state:s.state})),motes:this.motes.map(m=>({id:m.id,pos:m.pos.map(round3),kind:m.kind,ttl_s:m.ttl===null?null:round3(m.ttl/TICK_HZ)})),drifters:this.drifters.filter(d=>d.state!=="removed").map(d=>({id:d.id,pos:d.pos.map(round3),state:d.state,stolen:d.stolen})),charms:this.charms.map(c=>({id:c.id,available:c.available,respawn_s:round3(c.respawn/TICK_HZ)})),motes_active:this.motes.length};}
}

export function validateFrames(frames){if(!Array.isArray(frames))throw Object.assign(new Error("inputs.frames must be an array"),{code:2});let last=-1;for(const f of frames){if(!f||!Number.isInteger(f.tick)||f.tick<0||f.tick<=last)throw Object.assign(new Error("input frame ticks must be strictly increasing non-negative integers"),{code:2});last=f.tick;if(f.move&&(!Array.isArray(f.move)||f.move.length!==2||f.move.some(v=>!Number.isFinite(v)||v< -1||v>1)))throw Object.assign(new Error("move components must be in [-1,1]"),{code:2});if(f.cam_yaw_deg!==undefined&&!Number.isFinite(f.cam_yaw_deg))throw Object.assign(new Error("cam_yaw_deg must be finite"),{code:2});for(const k of ["jump","interact","pulse","dash","pause"])if(f[k]!==undefined&&typeof f[k]!=="boolean")throw Object.assign(new Error(`${k} must be boolean`),{code:2});}}

export function validateScenario(s){
  const bad=m=>{throw Object.assign(new Error(`Invalid scenario: ${m}`),{code:2})};
  const object=(v)=>v&&typeof v==="object"&&!Array.isArray(v);
  const vec=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
  if(!object(s))bad("root must be an object");
  for(const k of ["random_motes","random_shades","random_drifters","wind_enabled"])if(s[k]!==undefined&&typeof s[k]!=="boolean")bad(`${k} must be boolean`);
  if(s.player!==undefined){if(!object(s.player))bad("player must be an object");if(s.player.pos!==undefined&&!vec(s.player.pos))bad("player.pos must contain three finite numbers");for(const k of ["carried","flames","invuln_ticks","dash_cd_ticks","pulse_cd_ticks","charm_ticks"])if(s.player[k]!==undefined&&(!Number.isInteger(s.player[k])||s.player[k]<0))bad(`player.${k} must be a non-negative integer`);}
  for(const key of ["motes","shades","lanterns","drifters","charms"])if(s[key]!==undefined&&!Array.isArray(s[key]))bad(`${key} must be an array`);
  for(const m of s.motes||[])if(!(vec(m)||(object(m)&&vec(m.pos))))bad("each mote must be a position or an object with pos");
  for(const x of s.shades||[])if(!object(x)||!vec(x.pos)||(x.id!==undefined&&typeof x.id!=="string")||(x.state!==undefined&&!['spawning','wander','chase','recoil','stunned'].includes(x.state)))bad("invalid shade");
  for(const x of s.lanterns||[])if(!object(x)||typeof x.id!=="string"||(x.pos!==undefined&&!vec(x.pos))||(x.deposited!==undefined&&(!Number.isFinite(x.deposited)||x.deposited<0))||(x.lit!==undefined&&typeof x.lit!=="boolean"))bad("invalid lantern patch");
  for(const x of s.drifters||[])if(!object(x)||!vec(x.pos)||(x.id!==undefined&&typeof x.id!=="string")||(x.stolen!==undefined&&(!Number.isInteger(x.stolen)||x.stolen<0))||(x.state!==undefined&&!['idle','chase','flee','removed'].includes(x.state)))bad("invalid drifter");
  for(const x of s.charms||[])if(!object(x)||typeof x.id!=="string"||!vec(x.pos)||(x.available!==undefined&&typeof x.available!=="boolean")||(x.respawn_ticks!==undefined&&(!Number.isInteger(x.respawn_ticks)||x.respawn_ticks<0)))bad("invalid charm");
  if(s.time_left_s!==undefined&&(!Number.isFinite(s.time_left_s)||s.time_left_s<0))bad("time_left_s must be non-negative");
}
