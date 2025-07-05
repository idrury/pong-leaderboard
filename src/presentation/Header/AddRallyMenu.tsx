import IonIcon from "@reacticons/ionicons";
import ErrorLabel from "../ErrorLabel";
import TypeInput from "../TypeInput";
import { useEffect, useState } from "react";
import {
  ActivatableElement,
  CampaignRallyTypeObject,
  ErrorLabelType,
  InputOption,
  OrganisationSummaryObject,
  playerOrgObject,
  PopSavedModalFn,
  ProfileObject,
} from "../../Types";
import {
  fetchPlayerByName,
  fetchProfileByName,
  insertPeopleForRally,
  insertRally,
} from "../../DatabaseAccess/select";
import { QueryError } from "@supabase/supabase-js";
import BasicMenu from "../BasicMenu";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { validateNewRallyForm } from "../Event/EventBL";
import ConfirmMenu from "./ConfirmMenu";
import { UserSelectionInput } from "../UserSelectionInput";
import { createAnonProfile } from "../../DatabaseAccess/insert";
import { UUID } from "crypto";

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
  organisation,
  profile,
  eventId,
}: AddRallyMenuProps) {
  const [rallyOptions, setRallyOptions] = useState<InputOption[]>();
  const [hits, setHits] = useState<number>();
  const [rallyType, setRallyType] = useState<number>();
  const [people, setPeople] = useState<playerOrgObject[]>([]);
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

    if (profile)
      addPersonToRally([{
        player_id: profile.id,
        created_at: profile.created_at,
        org_id: organisation.org_id,
        profile_id: profile.name,
        anon_name: null,
      }]);
  }, [active]);

  useGSAP(() => {
    gsap.registerPlugin(SplitText);

    // const titleSplit = SplitText.create(".titleTransition", {
    //   type: "words",
    // });

    // gsap.from(titleSplit.words, {
    //   opacity: 0,
    //   y: -30,
    //   stagger: 0.05,
    //   delay: 0.5,
    // });

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

      if (id) await insertPeopleForRally(id, people, organisation.org_id);
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
    let person: playerOrgObject[] | null = null;
    try {
      person =
        (await fetchPlayerByName(
          formattedSearch,
          organisation.org_id
        )) || null;
        console.log("PER",person)
      // Add them to the rally if they exist
      if (person && person.length >0) {
        /*@ts-ignore*/
        addPersonToRally(person);
        setError({ active: false });
        setPersonSearch(undefined);
        return;
      }
      setCreateConfirmActive(true);
    } catch (error: any) {
      // Promt user to create a new profile
      // If no user has been found
      if (error.code != "PGRST116") {
        console.error(error);
        return;
      }
    }
  }

  /******************************************
   * Create a new user profile
   * @param name The name of the profile
   */
  async function createNewProfile(name: string) {
    if (!name || name.length <= 1) return;

    try {
      let person = await createAnonProfile(name.toLowerCase(), organisation.org_id);
      console.log("CREATED PERSON", person)
      if (person) {
        addPersonToRally([person]);
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
  function addPersonToRally(playerArray: playerOrgObject[]): boolean {
    console.log("ARR",playerArray)
    const player = playerArray[0]
    console.log(player)
    if (people.find((p) => p.player_id == player.player_id) || !player?.player_id) return false;
    setPeople(people.concat({player_id: player.player_id, created_at: player.created_at, org_id: player.org_id, profile_id: player.profile_id, anon_name: player.anon_name}));
    console.log("PEOPLE", people)

    return true;
  }

  /****************************
   * Remove a person from the local rally list
   * @param id The id of the person to remove
   */
  function removePerson(id: UUID) {
    setPeople(people.filter((p) => p.player_id != id));
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
            people.map((person, id) => (
              <div key={id} className="row middle boxed p0 pr2 mt1">
                <div
                  key={person.player_id}
                  style={{height:50}}
                  className="boxed pl2 w100 row middle"
                >
                  <p>
                    {person.profile_id || person.anon_name}{" "}
                    {person.player_id == profile?.id && "(you)"}
                  </p>
                </div>
                {person.player_id != profile?.id && (
                  <IonIcon
                    onClick={() => removePerson(person.player_id)}
                    name="person-remove"
                    className="ml1 mt1 m0 clickable"
                    style={{
                      color: "var(--danger)",
                    }}
                  />
                )}
              </div>
            ))}
<div className="mt1">
          <UserSelectionInput
            name={personSearch}
            setName={setPersonSearch}
            onSelect={(name) => getPerson(name)}
            onCreate={(name) => onCreateClick(name)}
            organisation={organisation}
            selectedPeople={people}
          />
          </div>
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
