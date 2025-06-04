import { RallyObject, RallyTypeObject } from "../../Types";

/*******************************
   * Loop through all rally types and 
   * find the highest rally for each type
   * @param rallies The rallies to get
   * @param rallyTypes The types of rallies
   * @returns An array of objects containing the highest rally for each type
   */
  export function findHighestRallyByType(
    rallies: RallyObject[],
    rallyTypes: RallyTypeObject[]
  ) {
    if (
      !rallies ||
      !rallyTypes ||
      rallies.length === 0 ||
      rallyTypes.length === 0
    ) {
      return [];
    }

    const allHighestRallies = rallyTypes.map((rallyType) => {
      // Filter rallies that match this rally type
      const matchingRallies = rallies.filter((rally) => {
        return (
          rally.rally_type === rallyType.name ||
          rally.rally_type === rallyType.id.toString()
        );
      });

      // Find the highest rally among matching rallies
      const highestRally =
        matchingRallies.length > 0
          ? matchingRallies.reduce((highest, current) => {
              return current.num_hits > highest.num_hits
                ? current
                : highest;
            }, matchingRallies[0])
          : null;

      return {
        rallyType: rallyType.name,
        highestHits: highestRally ? highestRally.num_hits : 0,
        person: highestRally
          ? highestRally.people?.name || null
          : null,
      };
    });

    return allHighestRallies;
  }