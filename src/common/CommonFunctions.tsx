export default function toString(item: any): string {
  if (item === null || item === undefined) {
    return "";
  }
  if (typeof item === "string") {
    return item;
  }
  if (typeof item === "number") {
    return item.toString();
  }
  if (typeof item === "object") {
    return JSON.stringify(item);
  }
  return String(item);
}

export function isMobileBrowser() {
  const userAgent =
    typeof window.navigator === "undefined"
      ? ""
      : navigator.userAgent;
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
}

export function getPlaces(number: number): number[] {
  const idxs = [10000, 1000, 100, 10, 1];
  const returnIdxs = new Array<number>();

  idxs.forEach(idx => {
    if(number >= idx) returnIdxs.push(idx);
  })

  return (returnIdxs.length > 0 ? returnIdxs : [1]);
}