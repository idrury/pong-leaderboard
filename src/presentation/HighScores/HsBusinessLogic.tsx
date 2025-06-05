export function timeToHex(minsHeldFor: number, max: number): string {
  const r = minsHeldFor  <=5 ? 20 : Math.round((minsHeldFor / max) * 20);
  const g = minsHeldFor <=5 ? 150 :  Math.round((minsHeldFor / max) * 150);
  const b = minsHeldFor <=5 ? 180 :  Math.round((minsHeldFor / max) * 180);

  return `rgb(${r},${g},${b})`;
}