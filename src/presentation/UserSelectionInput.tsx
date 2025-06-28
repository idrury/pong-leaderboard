import IonIcon from "@reacticons/ionicons";
import { useEffect, useState } from "react";
import ErrorLabel from "./ErrorLabel";
import { CreatableTypeInput } from "./TypeInput";
import {
  InputOption,
  OrganisationSummaryObject,
  playerOrgObject,
  ProfileObject,
} from "../Types";
import { fetchUsersByName } from "../DatabaseAccess/select";

export interface UserSelectionInputProps {
  name: string | undefined;
  selectedPeople?: playerOrgObject[];
  organisation: OrganisationSummaryObject;
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
  selectedPeople,
  organisation,
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
      const names = await fetchUsersByName(name, organisation.org_id);
      setInputOptions(namesToInputOptions(names));
    } catch (error) {
      console.error("Error fetching users by name:", error);
    }
  }

  /************************************
   * Convert an array of ProfileObjects to InputOptions
   */
  function namesToInputOptions(
    names: playerOrgObject[]
  ): InputOption[] {
    if (!names || names.length == 0) return [];
    return names.map((p) => ({
      value: p.player_id,
      label: p.profile_id || p.anon_name,
    }));
  }

  /********************************************
   * Triggered when user selects an existing user
   * or submits the form
   * @param nm The name of the user to add
   */
  function onAddClick(nm?: string) {
    const localName = nm || name;
    console.log("ON SELECT", localName);
    if (!localName) {
      setError({
        text: "Please enter a name",
        selector: "people",
        active: true,
      });
      return;
    }
    if (isPersonSelected()) return;
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
    if (isPersonSelected()) return;
    console.log("ON CREATE", name);
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
    setName(name);
  }

  function isPersonSelected(): boolean {
    // Return if person is already in rally
    if (
      !!selectedPeople?.find(
        (p) => (p.profile_id || p.anon_name)?.toLowerCase() == name
      )
    ) {
      setError({
        active: true,
        selector: "people",
        text: "This person is already in your rally",
      });
      return true;
    }
    setError({ active: false });
    return false;
  }

  return (
    <div className="col">
      <div className="row">
        <div className="w100">
          <CreatableTypeInput
            value={name || ""}
            placeholder="Enter a username"
            onChange={(val) => {
              {
                onAddClick(val.label);
                console.log(val);
              }
            }}
            options={inputOptions}
            onCreate={(val) => {
              onCreateClick(val);
            }}
            onInputChange={(val, meta) => {
              meta.action == "input-change" && onChangeName(val);
            }}
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
