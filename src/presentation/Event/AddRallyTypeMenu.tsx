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
import { useEffect, useState } from "react";
import { ChecknewRallyTypeForm } from "./EventBL";
import { insertNewRallyType } from "../../DatabaseAccess/insert";
import { isMobileBrowser } from "../../common/CommonFunctions";
import RallyTypeInformation from "./RallyTypeInformation";

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

  useEffect(() => {
    setActiveEvent(undefined);
  }, [active]);

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
      console.info(newRally);
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
        <div
          className="col w100 m0 p0"
          style={{ height: "80vh", overflow: "scroll" }}
        >
          <h2 className="p0 m0 pb2">Add new rally types</h2>
          <div className="row middle center boxedLight">
            <IonIcon
              name="information-circle"
              className="h2Icon mr2"
            />
            <p className="boxedLight bold">
              Pick an existing one from the list or create your own!
            </p>
          </div>
          <div className="row w100 shrinkWrap">
            {(!isMobileBrowser() || !createActive) && (
              <div
                className="col w50 mt2 between h100"
                style={{ maxHeight: "65vh" }}
              >
                <div
                  className="col between"
                  style={{
                    height: "100%",
                    overflow: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  {allTypes
                    ?.filter(
                      (at) =>
                        !eventTypes?.find((et) => et.id == at.id)
                    )
                    ?.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setActiveEvent(t)}
                        className="textLeft mb1 boxed p2 col between start clickable"
                      >
                        <div className="row middle between w100">
                          <div className="row middle">
                            <IonIcon
                              name="trophy-sharp"
                              className="mr2"
                            />
                            <h3
                              style={{
                                textTransform: "capitalize",
                              }}
                            >
                              {t.name}
                            </h3>
                          </div>
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
                        <RallyTypeInformation
                          active={activeEvent?.id == t.id}
                          onClose={() => setActiveEvent(undefined)}
                          type={t}
                        />
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => setCreateActive(true)}
                  className="p2 accentButton"
                  disabled={createActive}
                >
                  + Create one
                </button>
              </div>
            )}

            <div style={{ width: 20 }} />

            <div className="boxed w50 mt2 outline">
              {createActive == true ? (
                <div
                  className="w100  h100"
                  style={{ minHeight: "70vh" }}
                >
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
              ) : (
                !isMobileBrowser() && (
                  <div className={`col middle w100 h100 center`}>
                    <RallyTypeInformation
                      active={true}
                      onClose={() => setActiveEvent(undefined)}
                      type={activeEvent}
                    />
                    <p className="p2">
                      Click the plus button to add a rally to your
                      event!
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </BasicMenu>
    </div>
  );
}
