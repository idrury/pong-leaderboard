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