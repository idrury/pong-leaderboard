import IonIcon from "@reacticons/ionicons";
import EditMenu from "../EditMenu";
import ErrorLabel from "../ErrorLabel";
import { CreatableTypeInput } from "../TypeInput";
import { useEffect, useState } from "react";
import {
  ActivatableElement,
  ErrorLabelType,
  InputOption,
  PasswordType,
  PeopleObject,
  PopSavedModalFn,
  RallyTypeObject,
} from "../../Types";
import {
  fetchPeople,
  fetchRallyTypes,
  insertPerson,
  insertRally,
  insertRallyType,
} from "../../DatabaseAccess/select";
import PasswordMenu from "./PasswordMenu";
import { QueryError } from "@supabase/supabase-js";

interface AddRallyMenuProps extends ActivatableElement {
  activateSaved: PopSavedModalFn;
}

export default function AddRallyMenu({
  active,
  onClose,
  activateSaved,
}: AddRallyMenuProps) {
  const [rallyOptions, setRallyOptions] = useState<InputOption[]>();
  const [hits, setHits] = useState<number>();
  const [rallyType, setRallyType] = useState<string>();
  const [peopleId, setPeopleId] = useState<string | number>();

  const [peopleOptions, setPeopleOptions] = useState<InputOption[]>();

  const [error, setError] = useState<ErrorLabelType>({
    active: false,
  });

  const [passwordActive, setPasswordActive] = useState(false);
  const [passwordType, setPasswordType] = useState<
    PasswordType | undefined
  >();
  const [pendingValue, setPendingValue] = useState<any>();

  useEffect(() => {
    getData();
  }, []);

  /*****************************
   * Refresh the required data
   */
  async function getData() {
    try {
      // console.log('p', await checkPin(1, '00000'));
      setRallyOptions(createRallyTypes(await fetchRallyTypes()));
      const people = await fetchPeople();
      setPeopleOptions(createInputOptions(people));
    } catch (error) {}
  }

  /************************************
   * Turn the list of people into a format
   * accepted by the input box
   * @param people The list of people
   * @returns The new InputOption array
   */
  function createInputOptions(people: PeopleObject[]) {
    const returnArray = new Array<InputOption>();
    people.forEach((person) => {
      returnArray.push({
        value: person.id,
        label: person.name,
      });
    });

    return returnArray;
  }

  /************************************
   * Turn the list of rally types into acceptable
   * format for the input box
   * @param types The raw list of types
   * @returns A new InputOption array
   */
  function createRallyTypes(types: RallyTypeObject[]) {
    const returnArray = new Array<InputOption>();
    types.forEach((type) => {
      returnArray.push({
        value: type.name,
        label: type.name,
      });
    });

    return returnArray;
  }

  /***************************
   * Add a new person entry
   * @param name The name of the person or group
   */
  async function addPeople(name: string) {
    try {
      await insertPerson(name);
      // console.log("added", name);
      await getData();
    } catch (error) {
      /*@ts-ignore*/
      console.error(error?.message);
    }
  }

  /********************************************
   * Handle inserting a new rally type to the database
   * @param rallyType The rally type to add
   * @param secured
   * @returns
   */
  async function addRallyType(rallyType: string, secured = false) {
    console.log(rallyType);
    if (!rallyType) {
      activateSaved("Please enter a rally type", undefined, true);
      return;
    }

    if (!secured) {
      setPasswordType("add_rally_type");
      setPendingValue(rallyType);
      setPasswordActive(true);
      return;
    }

    try {
      await insertRallyType(rallyType);
      activateSaved("New rally type added!");
      await getData();
    } catch (error) {
      console.error(error);
      activateSaved(
        "An issue occured adding the rally.",
        "Refresh the page and try again!",
        true
      );
    }
  }

  /**************************
   * Add a new rally
   */
  async function addRally(secured = false) {
    if (!rallyType) {
      setError({
        active: true,
        text: "Please enter a rally type",
        selector: "rally_type",
      });
      return;
    }
    if (!hits || hits <= 0) {
      setError({
        active: true,
        text: "Please enter a valid number of hits",
        selector: "hits",
      });
      return;
    }
    if (!peopleId) {
      setError({
        active: true,
        text: "Please enter a valid name",
        selector: "people",
      });
      return;
    }
    if (hits > 1000 && hits < 30000 && !secured) {
      setPasswordType("add_high_rally");
      setPendingValue(hits);
      setPasswordActive(true);
      return;
    }
    if (hits >= 30000) {
      setError({
        active: true,
        text: "Hey! Don't you be cheating! Greg Lawrie would be disappointed in you.",
        selector: "hits",
      });
      return;
    }
    try {
      setError({ active: false });
      await insertRally(
        pendingValue || hits,
        peopleId as number,
        rallyType
      );
      activateSaved("New rally added!");
      onClose();
    } catch (error) {
      console.error((error as QueryError).message);
    }
  }

  /**********************************
   * What to do when the password is successfully entered
   * @param type The type of request
   */
  function onPasswordSuccess(type: PasswordType) {
    setPasswordActive(false);
    if (type === "add_rally_type")
      addRallyType(pendingValue || "", true);
    else if (type === "add_high_rally") addRally(true);

    setPendingValue(undefined);
  }

  return (
    <div>
      <PasswordMenu
        active={passwordActive}
        type={passwordType}
        onClose={() => setPasswordActive(false)}
        onSuccess={(type) => onPasswordSuccess(type)}
      />
      <EditMenu
        width={300}
        height={500}
        isActive={active}
        setIsActive={() => onClose()}
      >
        <div className="row middle">
          <IonIcon name="add-circle" className="h2Icon" />
          <h2>Add Rally</h2>
        </div>
        <div
          className="boxedSecondary mb2 row middle"
          style={{
            maxWidth: 300,
            background: "var(--secondaryColor)",
          }}
        >
          <IonIcon name="information-circle" className="mr1" />
          <p
            className="textLeft bold"
            style={{ color: "var(--background)" }}
          >
            Add your rallies here to track them!
          </p>
        </div>
        <br/>
        <form
          action="submit"
          onSubmit={(f) => {
            f.preventDefault();
            addRally();
          }}
        >
          <div className="mb2">
            <div className="row mb1 middle">
              <IonIcon name="bowling-ball" className="mr1" />
              <label>Rally type</label>
            </div>
            <CreatableTypeInput
              onCreate={(val) => {
                addRallyType(val);
                setRallyType(val);
              }}
              onChange={(val) => setRallyType(val.value)}
              /*@ts-ignore*/
              options={rallyOptions}
              disabled={false}
              defaultValue={""}
              placeholder="select a rally type"
            />
          </div>
          <ErrorLabel
            active={error.selector == "rally_type"}
            text={error.text || ""}
            color="var(--dangerColor)"
          />

          <div className="mb2">
            <div className="row mb1 middle">
              <IonIcon name="stats-chart" className="mr1" />
              <label className="">Number of hits</label>
            </div>
            <div className="pr2 mr2">
              <input
                placeholder="0"
                value={hits || ""}
                onChange={(e) =>
                  /*@ts-ignore*/
                  setHits(e.target.value)
                }
                type="number"
              />
            </div>
          </div>
          <ErrorLabel
            active={error.selector == "hits"}
            text={error.text || ""}
            color="var(--dangerColor)"
          />

          <div className="mb2">
            <div className="row mb1 middle">
              <IonIcon name="person-circle" className="mr1" />
              <label>Name (or group)</label>
            </div>
            <CreatableTypeInput
              onChange={(val) => setPeopleId(val?.value || null)}
              onCreate={(val) => addPeople(val)}
              /*@ts-ignore*/
              options={peopleOptions}
              disabled={false}
              defaultValue={""}
              placeholder="no name selected"
            />
          </div>
          <ErrorLabel
            active={error.selector == "people"}
            text={error.text || ""}
            color="var(--dangerColor)"
          />

          <button
            type="submit"
            className="row center middle w100 accentButton p0 mt2"
          >
            <IonIcon name="add-circle" className="mr1 pt2 pb2" />
            Rally
          </button>
        </form>
      </EditMenu>
    </div>
  );
}
