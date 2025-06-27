import IonIcon from "@reacticons/ionicons";
import { useEffect, useState } from "react";
import ErrorLabel from "./ErrorLabel";
import { CreatableTypeInput } from "./TypeInput";
import { InputOption, ProfileObject } from "../Types";
import { fetchUsersByName } from "../DatabaseAccess/select";

export interface UserSelectionInputProps {
  name: string | undefined;
  setName: (name: string | undefined) => void;
  onSelect: (name: string) => void;
  onCreate?: (name: string) => void;
}

/******************************
 * UserSelectionInput component
 * @todo Create description
 */
export function UserSelectionInput({
  name,
  setName,
  onSelect,
  onCreate,
}: UserSelectionInputProps) {
  const [error, setError] = useState<{
    active: boolean;
    text?: string;
    selector?: string;
  }>({
    active: false,
  });
  const [inputOptions, setInputOptions] = useState<InputOption[]>([]);

  useEffect(() => {
    // Fetch users on timer
    const timer = setTimeout(() => {
      getProfileMatches();
    }, 1000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [name]);

  /***************************************
   * Search the database for users by name
   */
  async function getProfileMatches() {
    if (!name || name.trim().length <= 3) return;

    try {
      const names = await fetchUsersByName(name);
      setInputOptions(namesToInputOptions(names));
    } catch (error) {
      console.error("Error fetching users by name:", error);
    }
  }

  /************************************
   * Convert an array of ProfileObjects to InputOptions
   */
  function namesToInputOptions(
    names: ProfileObject[]
  ): InputOption[] {
    if (!names || names.length == 0) return [];
    return names.map((p) => ({
      value: p.id,
      label: p.lower_name,
    }));
  }

  /********************************************
   * Triggered when user selects an existing user
   * or submits the form
   * @param nm The name of the user to add
   */
  function onAddClick(nm?: string) {
    const localName = nm || name;
    if (!localName) {
      setError({
        text: "Please enter a name",
        selector: "people",
        active: true,
      });
      return;
    }
    setName(localName);
    onSelect(localName);
  }

  /***********************************************
   * Triggered when user tries to create a new user
   * @param name The name of the user to create
   */

  function onCreateClick(name: string) {
    if (!name) {
      setError({
        text: "No create function provided",
        selector: "people",
        active: true,
      });
      return;
    }

    setName(name);
    inputOptions.find((opt) => opt.label == name.toLowerCase())
      ? onSelect(name)
      : onCreate && onCreate(name);
  }

  /*******************************************
   * Triggered when user types into input field
   * @param name
   */
  function onChangeName(name: string | undefined) {
    if (!name || name.trim().length <= 0) return;
    setName(name);
  }

  return (
    <div className="col">
      <div className="row">
        <div className="w100">
          <CreatableTypeInput
            placeholder="Enter a username"
            onChange={(val) => {
              onAddClick(val.label);
            }}
            options={inputOptions}
            onCreate={(val) => {
              onCreateClick(val);
            }}
            onInputChange={(val) => onChangeName(val)}
          />
        </div>

        <button
          type="button"
          className="m0 p0"
          onClick={() => onAddClick()}
        >
          <IonIcon
            name="add-circle"
            className="h2Icon m0"
            style={{
              color: "var(--danger)",
            }}
          />
        </button>
      </div>
      <div className="mt2">
        <ErrorLabel
          active={error.selector == "people"}
          text={error.text || ""}
          color="var(--dangerColor)"
        />
      </div>
    </div>
  );
}
