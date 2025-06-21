import {
  ProfileObject,
  RallyObject,
  UserRalliesObject,
} from "../Types";

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

  idxs.forEach((idx) => {
    if (number >= idx) returnIdxs.push(idx);
  });

  return returnIdxs.length > 0 ? returnIdxs : [1];
}

/***********************************
 * Group rallies with people by the rally id
 * @param rallies The rallies to group
 */
export function groupRalliesById(
  rallies: UserRalliesObject[]
): RallyObject[] {
  const returnArray = new Array<RallyObject>();

  rallies.forEach((pr) => {
    let current = returnArray.find((r) => r.id == pr.rally_id);

    //If it's been added, add the user to this rally
    if (current) {
      (current.profiles as ProfileObject[]).push({
        id: pr.profile_id,
        created_at: new Date(),
        name: pr.user_name,
        blocked_event_ids: [],
      });
      // Else add the new rally
    } else {
      returnArray.push({
        num_hits: pr.num_hits,
        is_high_score: pr.is_high_score,
        hidden: false,
        profiles: [
          {
            id: pr.profile_id,
            created_at: new Date(),
            name: pr.user_name,
            blocked_event_ids: [],
          },
        ],
        rally_types: {
          id: 0,
          created_at: new Date(),
          name: pr.type_name,
          tags: [],
          min_people: 0,
          max_people: 1,
          threshold: 0,
          description: "",
        },
        id: pr.rally_id,
        created_at: new Date(pr.created_at),
      });
    }

    current = undefined;
  });

  return returnArray;
}
