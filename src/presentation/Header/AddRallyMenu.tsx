import IonIcon from "@reacticons/ionicons";
import ErrorLabel from "../ErrorLabel";
import TypeInput from "../TypeInput";
import { useEffect, useState } from "react";
import {
  ActivatableElement,
  CampaignRallyTypeObject,
  ErrorLabelType,
  InputOption,
  PasswordType,
  PopSavedModalFn,
  ProfileObject,
} from "../../Types";
import {
  insertPeopleForRally,
  insertRally,
  insertRallyType,
  searchUser,
} from "../../DatabaseAccess/select";
import PasswordMenu from "./PasswordMenu";
import { QueryError } from "@supabase/supabase-js";
import BasicMenu from "../BasicMenu";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";

interface AddRallyMenuProps extends ActivatableElement {
  currentRallyTypes?: CampaignRallyTypeObject[];
  activateSaved: PopSavedModalFn;
  profile: ProfileObject;
  eventId: string;
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

  const [passwordActive, setPasswordActive] = useState(false);
  const [passwordType, setPasswordType] = useState<
    PasswordType | undefined
  >();
  const [pendingValue, setPendingValue] = useState<any>();

  useEffect(() => {
    getData();
  }, [currentRallyTypes?.length]);

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
    console.log("FETCHING RALLY TYPES AGAIN");
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
        value: type.rally_types.id,
        label: type.rally_types.name,
      });
    });

    return returnArray;
  }

  /********************************************
   * Handle inserting a new rally type to the database
   * @param rallyType The rally type to add
   * @param secured
   * @returns
   */
  async function addRallyType(rallyType: string, secured = false) {
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
    let isHighScore = false;
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


    const prevHighRally = currentRallyTypes?.find((t) => {
      return t.rally_types.id == rallyType;
    })?.rallys;


    //Prompt for password if high score
    if (hits < 30000 && hits > (prevHighRally?.num_hits || 100)) {
      if (!secured) {
        setPasswordType("add_high_rally");
        setPendingValue(hits);
        setPasswordActive(true);
        return;
      } else isHighScore = true;
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
        pendingValue || hits,
        rallyType,
        isHighScore,
        eventId
      );

      if (id) await insertPeopleForRally(id, people, profile);
      activateSaved("New rally added!");
      onClose();
      setHits(undefined);
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

  async function addPerson(form: React.FormEvent) {
    form.preventDefault();

    try {
      const person = await searchUser(personSearch);
      if (person) {
        setPeople([...people, person]);
      }
    } catch (error) {
      activateSaved("That person doesn't exist", undefined, true);
    }

    setPersonSearch(undefined);
  }

  function removePerson(id: string) {
    setPeople(people.filter((p) => p.id != id));
  }

  if (!profile) return;
  return (
    <div>
      <PasswordMenu
        active={passwordActive}
        type={passwordType}
        onClose={() => setPasswordActive(false)}
        onSuccess={(type) => onPasswordSuccess(type)}
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
          <div className="row mb1 middle">
            <IonIcon name="person-circle" className="mr1" />
            <label>Add your group</label>
          </div>
          {people?.length > 0 &&
            people
              .filter((p) => p?.id != profile?.id)
              .map((person) => (
                <div key={person.id} className="row middle">
                  <div
                    key={person.id}
                    className="boxed p2 w100 mb1 row middle"
                  >
                    <p>{person.name}</p>
                  </div>
                  <IonIcon
                    onClick={() => removePerson(person.id)}
                    name="close-circle"
                    className="ml1 m0 h2Icon clickable"
                    style={{ color: "var(--danger)" }}
                  />
                </div>
              ))}
          <form action="submit" onSubmit={(f) => addPerson(f)}>
            <div className="mb2 pr3">
              <input
                value={personSearch || ""}
                onChange={(e) => setPersonSearch(e.target.value)}
                disabled={false}
                placeholder="Enter username"
              />
            </div>
          </form>
          <ErrorLabel
            active={error.selector == "people"}
            text={error.text || ""}
            color="var(--dangerColor)"
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
