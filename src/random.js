export function makeRng(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export const round3 = n => Math.round(n * 1000) / 1000;
export const distanceXZ = (a,b) => Math.hypot(a[0]-b[0], a[2]-b[2]);
export const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
