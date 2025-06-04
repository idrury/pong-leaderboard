import IonIcon from "@reacticons/ionicons";
import EditMenu from "../EditMenu";
import ErrorLabel from "../ErrorLabel";
import TypeInput, { CreatableTypeInput } from "../TypeInput";
import { useEffect, useState } from "react";
import { ActivatableElement, ErrorLabelType, InputOption, PeopleObject, RallyTypeObject } from "../../Types";
import { fetchPeople, fetchRallyTypes, insertPerson, insertRally } from "../../DatabaseAccess/select";

interface AddRallyMenuProps extends ActivatableElement{};

export default function AddRallyMenu({active, onClose}:AddRallyMenuProps) {
  const [rallyOptions, setRallyOptions] = useState<InputOption[]>();
  const [hits, setHits] = useState<number>();
  const [rallyType, setRallyType] = useState<string>();
  const [peopleId, setPeopleId] = useState<string | number>();

  const [peopleOptions, setPeopleOptions] = useState<InputOption[]>();

  const [error, setError] = useState<ErrorLabelType>({
    active: false,
  });

  useEffect(() => {
    getData();
  }, []);

  /*****************************
   * Refresh the required data
   */
  async function getData() {
    console.log("getting data");
    try {
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
      alert(error?.message);
    }
  }

  /**************************
   * Add a new rally
   */
  async function addRally() {
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
    if (hits >= 100000) {
      setError({
        active: true,
        text: "Hey! Don't you be cheating! Greg Lawrie would be disappointed in you.",
        selector: "hits",
      });
      return;
    }
    try {
      setError({ active: false });
      await insertRally(hits, peopleId as number, rallyType);
      onClose();
    } catch (error) {
      /*@ts-ignore*/
      alert(error.message);
    }
  }

  return (
    <EditMenu
      width={300}
      height={500}
      isActive={active}
      setIsActive={() => onClose()}
    >
      <div className="row middle">
        <IonIcon name="add-circle" className="mr2" />
        <h3>Add Rally</h3>
      </div>
      <form
        action="submit"
        onSubmit={(f) => {
          f.preventDefault();
          addRally();
        }}
      >
        <div className="mb2">
          <div className="row mb1">
            <label>Rally type</label>
          </div>
          <TypeInput
            /*@ts-ignore*/
            onChange={(val) => setRallyType(val)}
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
          <div className="row mb1">
            <label>Number of hits</label>
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
          <div className="row mb1">
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
          <IonIcon name="add" className="mr2" />
          <p>Rally</p>
        </button>
      </form>
    </EditMenu>
  );
}
