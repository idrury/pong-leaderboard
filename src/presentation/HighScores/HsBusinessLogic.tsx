export function timeToHex(minsHeldFor: number, max: number, isGradient: boolean): string {
  const clampedMins  = Math.max(0, max - minsHeldFor);

  const r = clampedMins <= 5 ? 2 : Math.round((clampedMins / max) * 20);
  const g = clampedMins <= 5 ? 15 : Math.round((clampedMins / max) * 150);
  const b = clampedMins <= 5 ? 18 : Math.round((clampedMins / max) * 180);

  if(isGradient)
    return  `conic-gradient(rgb(${r},${g},${b}), rgb(${r-50},${g-10},${b-10}), rgb(${r+15},${g+10},${b+15}), rgb(${r-35},${g-30},${b-35}), rgb(${r},${g},${b}))`
  
  return `rgb(${r},${g},${b})`;
}
