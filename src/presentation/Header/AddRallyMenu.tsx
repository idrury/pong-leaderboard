import IonIcon from "@reacticons/ionicons";
import ErrorLabel from "../ErrorLabel";
import TypeInput from "../TypeInput";
import { act, useEffect, useState } from "react";
import {
  ActivatableElement,
  CampaignRallyTypeObject,
  ErrorLabelType,
  InputOption,
  OrganisationSummaryObject,
  PopSavedModalFn,
  ProfileObject,
} from "../../Types";
import {
  fetchProfileByName,
  insertPeopleForRally,
  insertRally,
} from "../../DatabaseAccess/select";
import { QueryError } from "@supabase/supabase-js";
import BasicMenu from "../BasicMenu";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { createAnonProfile } from "../../DatabaseAccess/authentication";
import { validateNewRallyForm } from "../Event/EventBL";
import ConfirmMenu from "./ConfirmMenu";
import { UserSelectionInput } from "../UserSelectionInput";

interface AddRallyMenuProps extends ActivatableElement {
  currentRallyTypes?: CampaignRallyTypeObject[];
  activateSaved: PopSavedModalFn;
  profile: ProfileObject;
  eventId: string;
  organisation: OrganisationSummaryObject;
}

export default function AddRallyMenu({
  active,
  currentRallyTypes,
  onClose,
  activateSaved,
  profile,
  eventId,
}: AddRallyMenuProps) {
  const [rallyOptions, setRallyOptions] = useState<InputOption[]>();
  const [hits, setHits] = useState<number>();
  const [rallyType, setRallyType] = useState<number>();
  const [people, setPeople] = useState<ProfileObject[]>([]);
  const [personSearch, setPersonSearch] = useState<string>();

  const [error, setError] = useState<ErrorLabelType>({
    active: false,
  });
  const [createConfirmActive, setCreateConfirmActive] =
    useState(false);

  useEffect(() => {
    getData();
  }, [currentRallyTypes?.length]);

  // Reset the component
  useEffect(() => {
    if (active == false) {
      setError({ active: false });
      setPeople([]);
      setHits(undefined);
      setRallyType(undefined);
      return;
    }

    if (profile) addPersonToRally(profile);
  }, [active]);

  useGSAP(() => {
    gsap.registerPlugin(SplitText);

    const titleSplit = SplitText.create(".titleTransition", {
      type: "words",
    });

    gsap.from(titleSplit.words, {
      opacity: 0,
      y: -30,
      stagger: 0.05,
      delay: 0.5,
    });

    // gsap.from('.spinTransition', {
    //   opacity: 0,
    //   rotate: 360,
    //   duration: .5,
    //   delay: .5,
    //   ease: 'back'
    // })
  }, [active]);

  /*****************************
   * Refresh the required data
   */
  async function getData() {
    console.info("Fetching rally types");
    try {
      setRallyOptions(createRallyTypes(currentRallyTypes || []));
    } catch (error) {}
  }

  /************************************
   * Turn the list of rally types into acceptable
   * format for the input box
   * @param types The raw list of types
   * @returns A new InputOption array
   */
  function createRallyTypes(types: CampaignRallyTypeObject[]) {
    const returnArray = new Array<InputOption>();
    types.forEach((type) => {
      returnArray.push({
        value: type.id,
        label: type.name,
      });
    });

    return returnArray;
  }

  /**************************
   * Insert a new rally
   */
  async function addRally() {
    let isHighScore = false;
    let error = validateNewRallyForm(rallyType, hits, people);
    if (error) {
      setError(error);
      return;
    }
    if (!hits || !rallyType) return;
    //Get the previous highest score
    const prevHighRally = currentRallyTypes?.find((t) => {
      return t.id == rallyType;
    });

    //Check if high score
    if (hits < 30000 && hits > (prevHighRally?.num_hits || 100)) {
      isHighScore = true;
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
      const id = await insertRally(
        hits,
        rallyType,
        isHighScore,
        eventId
      );

      if (id) await insertPeopleForRally(id, people);
      activateSaved("New rally added!");
      onClose();
      setHits(undefined);
    } catch (error: any) {
      if (error.code == "P0002") {
        activateSaved("Could not add your rally", error.hint, true);
      }
      console.error(error as QueryError);
    }
  }

  /*****************************************************
   * Fetch a person from the database and add them to the rally
   */
  async function getPerson(name?: string) {
    // Search for person in the database
    const formattedSearch = (name || personSearch)?.toLowerCase();
    if (!formattedSearch) return;
    let person: ProfileObject | null = null;
    try {
      person = (await fetchProfileByName(formattedSearch)) || null;

      // Add them to the rally if they exist
      if (person) {
        addPersonToRally(person);
        setError({ active: false });
        setPersonSearch(undefined);
      }
    } catch (error: any) {
      // Promt user to create a new profile
      // If no user has been found
      if (error.code != "PGRST116") {
        console.error(error);
        return;
      }
    }

    if (!person) {
      setCreateConfirmActive(true);
    }
  }

  /******************************************
   * Create a new user profile
   * @param name The name of the profile
   */
  async function createNewProfile(name: string) {
    if (!name || name.length <= 1) return;

    try {
      let person = await createAnonProfile(name);
      if (person) {
        addPersonToRally(person);
        setError({ active: false });
        setPersonSearch(undefined);
      }
    } catch (error) {
      activateSaved(
        "Could not create a new person",
        "Referesh the page and try again",
        true
      );
    }
    setPersonSearch(undefined);
  }

  /***************************************
   * Add a new person to the list of people
   * if they aren't already on there
   * @param profile The profile to add
   * @returns True if success, else false
   */
  function addPersonToRally(profile: ProfileObject): boolean {
    if (people.find((p) => p.id == profile.id)) return false;
    setPeople(people.concat(profile));

    return true;
  }

  /****************************
   * Remove a person from the local rally list
   * @param id The id of the person to remove
   */
  function removePerson(id: string) {
    setPeople(people.filter((p) => p.id != id));
  }

  async function onCreateClick(name: string) {
    await getPerson(name);
  }

  return (
    <div>
      <ConfirmMenu
        active={createConfirmActive}
        onClose={() => setCreateConfirmActive(false)}
        onConfirm={() => {
          setCreateConfirmActive(false);
          createNewProfile(personSearch || "");
        }}
        header={`We can't find a player called ${
          personSearch || "that name"
        }`}
        body="Create a new player?"
        icon="alert-circle"
        width={400}
        zIndex={25}
      />
      <BasicMenu
        disableClickOff
        width={300}
        active={active}
        onClose={() => onClose()}
      >
        <div className="row middle center ">
          <IonIcon
            name="add-circle"
            className="h2Icon spinTransition"
          />
          <h2 className="textCenter titleTransition">Add a rally</h2>
        </div>
        <br />
        <div>
          <div className="mb2">
            <div className="row mb1 middle">
              <IonIcon name="bowling-ball" className="mr1" />
              <label>Rally type</label>
            </div>
            <TypeInput
              onChange={(val: any) => {
                setRallyType(val);
              }}
              /*@ts-ignore*/
              options={rallyOptions}
              disabled={false}
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
            <div className="">
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
          <div className="row mb1 middle">
            <IonIcon name="person-circle" className="mr1" />
            <label>
              Your group (
              {people.length == 1
                ? `1 person`
                : `${people.length} people`}
              )
            </label>
          </div>
          {people &&
            people.map((person) => (
              <div key={person.id} className="row middle">
                <div
                  key={person.id}
                  className="boxed p2 w100 mb1 row middle"
                >
                  <p>
                    {person.name}{" "}
                    {person.id == profile?.id && "(you)"}{" "}
                  </p>
                </div>
                {person.id != profile?.id && (
                  <IonIcon
                    onClick={() => removePerson(person.id)}
                    name="close-circle"
                    className="ml1 m0 h2Icon clickable"
                    style={{
                      color: "var(--danger)",
                    }}
                  />
                )}
              </div>
            ))}

          <UserSelectionInput
            name={personSearch}
            setName={setPersonSearch}
            onSelect={() => getPerson()}
            onCreate={(name) => onCreateClick(name)}
            selectedPeople={people}
          />
          <button
            onClick={() => addRally()}
            className="row center middle w100 accentButton p0 mt2"
          >
            <IonIcon name="add-circle" className="mr1 pt2 pb2" />
            Rally
          </button>
        </div>
      </BasicMenu>
    </div>
  );
}
