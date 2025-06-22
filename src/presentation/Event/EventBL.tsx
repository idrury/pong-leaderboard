import {
  ErrorLabelType,
  ProfileObject,
} from "../../Types";

export function ChecknewRallyTypeForm(
  name: string | undefined,
  description: string | undefined,
  parsedMin: number,
  parsedMax: number
): ErrorLabelType | null {
  if (!name || name.length < 3) {
    return {
      active: true,
      selector: "name",
      text: "Enter a more descriptive name",
    };
  }
  if (!description || description.length < 10) {
    return {
      active: true,
      selector: "description",
      text: "Give your description some more detail",
    };
  }
  if (!parsedMin) {
    return {
      active: true,
      selector: "min",
      text: "Please enter a minimum value",
    };
  }
  if (parsedMin < 1) {
    return {
      active: true,
      selector: "min",
      text: "Min must be more than 1",
    };
  }
  if (parsedMin > 10) {
    return {
      active: true,
      selector: "min",
      text: "Min must be less than 10",
    };
  }
  if (!parsedMax) {
    return {
      active: true,
      selector: "max",
      text: "Please enter a minimum value",
    };
  }
  if (parsedMax < 1) {
    return {
      active: true,
      selector: "max",
      text: "Max must be more than 1",
    };
  }
  if (parsedMax > 10) {
    return {
      active: true,
      selector: "max",
      text: "Max must be less than 10",
    };
  }
  if (parsedMax < parsedMin) {
    return {
      active: true,
      selector: "max",
      text: "Max must be less than the min",
    };
  }

  return null;
}

export function validateNewRallyForm(
  rallyType: number | undefined,
  hits: number | undefined,
  people: ProfileObject[] | undefined
) {
  if (!rallyType) {
    return {
      active: true,
      text: "Please enter a rally type",
      selector: "rally_type",
    };
  }
  if (!hits || hits <= 0) {
    return {
      active: true,
      text: "Please enter a valid number of hits",
      selector: "hits",
    };
  }
  if (!people || people.length == 0) {
    return {
      active: true,
      text: "Please enter at least one player!",
      selector: "people",
    };
  }
}
