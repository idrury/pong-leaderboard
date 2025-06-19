import IonIcon from "@reacticons/ionicons";
import {
  ActivatableElement,
  CampaignRallyTypeObject,
  ErrorLabelType,
  PopSavedModalFn,
  RallyTypeObject,
} from "../../Types";
import BasicMenu from "../BasicMenu";
import ErrorLabel from "../ErrorLabel";
import { useState } from "react";
import { ChecknewRallyTypeForm } from "./EventBL";
import { insertNewRallyType } from "../../DatabaseAccess/insert";
import { isMobileBrowser } from "../../common/CommonFunctions";

interface AddRallyTypeMenuProps extends ActivatableElement {
  allTypes: RallyTypeObject[] | undefined;
  eventTypes: CampaignRallyTypeObject[] | undefined;
  popModal?: PopSavedModalFn;
  onTypeAdded?: () => void;
  onAddClick: (e: React.MouseEvent, rallyId: number) => void;
}

export default function AddRallyTypeMenu({
  active,
  allTypes,
  eventTypes,
  onAddClick,
  popModal,
  onTypeAdded,
  onClose,
}: AddRallyTypeMenuProps) {
  const [error, setError] = useState<ErrorLabelType>({
    active: false,
  });
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [min, setMin] = useState<string>("1");
  const [max, setMax] = useState<string>("1");

  const [createActive, setCreateActive] = useState(false);
  const [activeEvent, setActiveEvent] = useState<RallyTypeObject>();

  async function createNewRally(f: React.FormEvent) {
    f.preventDefault();
    const parsedMin = parseInt(min);
    const parsedMax = parseInt(max);

    // Check the result is valid
    const check = ChecknewRallyTypeForm(
      name,
      description,
      parsedMin,
      parsedMax
    );
    if (check) {
      setError(check);
      return;
    }

    try {
      const newRally = await insertNewRallyType(
        name as string,
        description as string,
        parsedMin,
        parsedMax
      );
      console.log(newRally);
      setError({ active: false });
      popModal && popModal("Rally type added!");
      onTypeAdded && onTypeAdded();
      setName(undefined);
      setDescription(undefined);
      setMax("1");
      setMin("1");
    } catch (error) {
      console.error(error);
      popModal &&
        popModal(
          "There was an error adding that rally type",
          "Refresh the page and try again!",
          true
        );
    }
  }
  return (
    <div>
      <BasicMenu
        zIndex={30}
        width={"95%"}
        active={active}
        onClose={onClose}
        disableClickOff
      >
        <div className="col w100 m0 p0" style={{ minHeight: "80vh" }}>
          <h2 className="p0 m0 pb2">Add rally type</h2>
          <div className="row w100 shrinkWrap">
            {(!isMobileBrowser() ||
              (isMobileBrowser() && !createActive)) && (
              <div className="col w50 mt2">
                <div style={{ maxHeight: `${isMobileBrowser() ? "50hv" : "75vh"}`, overflow: "auto" }}>
                  {allTypes
                    ?.filter(
                      (at) =>
                        !eventTypes?.find(
                          (et) => et.rally_types.id == at.id
                        )
                    )
                    ?.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setActiveEvent(t)}
                        className="textLeft mb1 boxed p1 row between middle clickable"
                      >
                        <p style={{textTransform: "capitalize"}}>{t.name}</p>
                        <IonIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddClick(e, t.id);
                          }}
                          name="add-circle"
                          className="clickable"
                          style={{
                            color: "var(--primaryColor)",
                            height: 20,
                            width: 20,
                          }}
                        />
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => setCreateActive(true)}
                  className="p1 accentButton"
                  disabled={createActive}
                >
                  + Create one
                </button>
              </div>
            )}

            <div style={{ width: 20 }} />

            <div className="boxed w50 mt2 outline">
              {createActive == true ? (
                <div className="w100  h100">
                  <form
                    className="p2"
                    action="submit"
                    onSubmit={(f) => createNewRally(f)}
                  >
                    <div className="col h100">
                      <div className="row middle between">
                        <button
                          onClick={() => setCreateActive(false)}
                          className="row middle center p1 mb2 accentButton"
                        >
                          <IonIcon
                            name="arrow-back"
                            className="pr1"
                          />
                          <p>Cancel</p>
                        </button>
                      </div>
                      <label className="mb2">Name</label>
                      <input
                        className="mb2"
                        autoFocus
                        autoComplete="rally-name"
                        value={name || ""}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <ErrorLabel
                        active={error.selector == "name"}
                        text={error.text}
                      />
                      <label className="mb2">Description</label>
                      <input
                        className="mb2"
                        autoComplete="rally-description"
                        value={description || ""}
                        onChange={(e) =>
                          setDescription(e.target.value)
                        }
                      />
                      <ErrorLabel
                        active={error.selector == "description"}
                        text={error.text}
                      />
                      <label className="mb2">
                        Min number of people
                      </label>
                      <input
                        className="mb2"
                        autoComplete="min-people"
                        value={min || ""}
                        type="number"
                        min={1}
                        max={10}
                        onChange={(e) => setMin(e.target.value)}
                      />
                      <ErrorLabel
                        active={error.selector == "min"}
                        text={error.text}
                      />
                      <label className="mb2">
                        Max number of people
                      </label>
                      <input
                        className="mb2"
                        autoComplete="max-people"
                        type="number"
                        min={0}
                        max={10}
                        value={max || ""}
                        onChange={(e) => setMax(e.target.value)}
                      />
                      <ErrorLabel
                        active={error.selector == "max"}
                        text={error.text}
                      />
                    </div>
                    <button
                      type="submit"
                      className="accentButton w100 mt1"
                    >
                      + Create
                    </button>
                  </form>
                </div>
              ) : activeEvent ? (
                <div className="p2 textLeft">
                  <h3 style={{textTransform: "capitalize"}}>{activeEvent.name}</h3>
                  <p>{activeEvent.description}</p>
                  <p className="boxedDark mt2">
                    <strong>
                        {activeEvent.min_people == activeEvent.max_people
                          ? `Must have ${activeEvent.min_people} player(s)`
                          : `Must have ${activeEvent.min_people} - ${activeEvent.max_people} players`}
                    </strong>
                  </p>
                </div>
              ) : (
                <div className={`col middle w100 h100 center`}>
                  <p className="p2">
                    Click the plus button to add a rally to your
                    event!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </BasicMenu>
    </div>
  );
}
