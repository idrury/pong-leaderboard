export function timeToHex(minsHeldFor: number, max: number): string {
  const clampedMins  = Math.max(0, max - minsHeldFor);

  const r = clampedMins <= 5 ? 2 : Math.round((clampedMins / max) * 20);
  const g = clampedMins <= 5 ? 15 : Math.round((clampedMins / max) * 150);
  const b = clampedMins <= 5 ? 18 : Math.round((clampedMins / max) * 180);

  return `rgb(${r},${g},${b})`;
}
