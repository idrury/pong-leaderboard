import { ErrorLabelType } from "../../Types";

export function ChecknewRallyTypeForm(
  name: string | undefined,
  description: string | undefined,
  parsedMin: number,
  parsedMax: number
): ErrorLabelType | null {
    console.log(name, description, parsedMax, parsedMin)
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
