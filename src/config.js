export const TICK_HZ = 60;

// Normalized values from Ticket-02 Part 1 (context.md) plus Ticket-03 fuel values.
// Mirrored by game.contract.json.
export const TUNING = Object.freeze({
  player_speed: 6.0,
  carry_capacity: 10,
  lantern_cost: 10,
  pickup_radius: 1.0,
  interact_radius: 2.0,
  pulse_cost: 3,
  pulse_radius: 5.0,
  night1_duration_s: 240,
  flames: 3,
  invuln_s: 1.5,
  hit_drop_ratio: 0.5,
  pulse_stun_s: 2,
  pulse_push_m: 4,
  pulse_cooldown_s: 3,
  safe_radius: 6,
  shade_speed: 4.0,
  shade_hit_radius: 1,
  fall_enabled: true,
  dash_speed: 14,
  dash_duration_s: 0.2,
  dash_cooldown_s: 1.5,
  night2_duration_s: 270,
  night3_duration_s: 300,
  fuel_max: 100,
  fuel_decay_per_s: 1.0,
  fuel_per_mote: 10,
  relight_cost: 5,
  win_ratio: 0.6,
  drain_per_s: 5,
  low_fuel_threshold: 30,
  capacity_max: 20,
  score: { per_mote: 5, per_first_light: 100, per_relight: 40, per_stun: 5, per_drain_stun: 15, per_lantern_at_dawn: 50, per_fuel_at_dawn: 1, per_flame_at_dawn: 50 },
});

const polar = (r, deg, cx = 0, cz = 0, y = 0) => {
  const a = deg * Math.PI / 180;
  return [+(cx + r * Math.cos(a)).toFixed(3), y, +(cz + r * Math.sin(a)).toFixed(3)];
};
const points = (r, degrees, cx = 0, cz = 0, y = 0) => degrees.map(d => polar(r, d, cx, cz, y));

export const NIGHT_CONFIG = {
  1: {
    name: "Đêm 1 — Đảo Bến", duration: TUNING.night1_duration_s, islandRadius: 40,
    lanterns: [[0,0,25],[23.8,0,7.7],[14.7,0,-20.2],[-14.7,0,-20.2],[-23.8,0,7.7]].map((pos,i)=>({id:`L${i+1}`,pos})),
    motePoints: [...points(12,[0,45,90,135,180,225,270,315]),...points(33,Array.from({length:16},(_,i)=>i*22.5))],
    shadePoints: points(37,Array.from({length:12},(_,i)=>15+i*30)), shadeInterval: 480, shadeFirst: 300, shadeMax: 6,
  },
  2: {
    name: "Đêm 2 — Hai Hòn Đảo", duration: TUNING.night2_duration_s, islandRadius: 28,
    islands: [[0,0],[70,0]],
    lanterns: [[0,0,20],[17,0,-10],[-17,0,-10],[70,0,20],[87,0,-10],[53,0,-10]].map((pos,i)=>({id:`L${i+1}`,pos})),
    motePoints: [[0,0],[70,0]].flatMap(([x,z])=>[...points(10,[0,90,180,270],x,z),...points(22,[0,45,90,135,180,225,270,315],x,z)]),
    shadePoints: [[0,0],[70,0]].flatMap(([x,z])=>points(26,Array.from({length:8},(_,i)=>22.5+i*45),x,z)), shadeInterval: 420, shadeFirst: 420, shadeMax: 8,
    charms: [{id:"C1",pos:[35,0,0]}],
    drifterSpawnPoints: [[0,0],[70,0]].flatMap(([x,z])=>points(24,[0,90,180,270],x,z)),
  },
  3: {
    name: "Đêm 3 — Tháp Chuông", duration: TUNING.night3_duration_s, islandRadius: 45, startPosition: [0,0,-10],
    lanterns: [[0,6,6],[18,3,10],[-18,3,10],[35,0,-10],[-35,0,-10],[20,0,-35],[-20,0,-35]].map((pos,i)=>({id:`L${i+1}`,pos})),
    motePoints: [...points(34,Array.from({length:18},(_,i)=>i*20)),...points(18,[20,40,60,80,100,120,140,160],0,0,3),...points(5,[45,135,225,315],0,0,6)],
    shadePoints: points(43,Array.from({length:16},(_,i)=>i*22.5)), shadeInterval: 360, shadeFirst: 360, shadeMax: 10,
    charms: [{id:"C1",pos:[30,0,25]},{id:"C2",pos:[-30,0,25]}],
    windInterval: 1800, windDuration: 300, windForecast: 120, windSpeed: 2,
  },
};

export const DEFAULT_CHARM_DURATION = 600;
export const CHARM_RESPAWN_TICKS = 2700;
export const DRIFTER_SPEED = 7;
export const DRIFTER_IDLE_SPEED = 2;
export const DRIFTER_MAX = 2;
export const DRIFTER_SPAWN_INTERVAL = 1200;
export const DRIFTER_CHASE_RANGE = 15;
export const DRIFTER_CONTACT = 1.2;
export const DRIFTER_FLEE_TICKS = 240;
export const DRIFTER_DROP_TICKS = 120;
export const CHARM_SPEED = 7.2;
export const DRIFT_TTL_TICKS = 480;
