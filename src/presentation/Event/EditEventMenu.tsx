import { useEffect, useState } from "react";
import {
  ActivatableElement,
  CampaignRallyTypeObject,
  EventObject,
  PopSavedModalFn,
  RallyTypeObject,
} from "../../Types";
import BasicMenu from "../BasicMenu";
import {
  fetchAllRallyTypes,
  fetchRallyTypes,
} from "../../DatabaseAccess/select";
import AddRallyTypeMenu from "./AddRallyTypeMenu";
import { insertRallyTypeForEvent } from "../../DatabaseAccess/insert";
import IonIcon from "@reacticons/ionicons";
import { deleteEventRallyType } from "../../DatabaseAccess/delete";

interface EditEventMenuProps extends ActivatableElement {
  event: EventObject | undefined;
  popModal: PopSavedModalFn;
}

export default function EditEventMenu({
  active,
  event,
  onClose,
  popModal,
}: EditEventMenuProps) {
  const [eventRallyTypes, setEventRallyTypes] =
    useState<CampaignRallyTypeObject[]>();
  const [allRallyTypes, setAllRallyTypes] =
    useState<RallyTypeObject[]>();
  const [addRallyTypeActive, setAddRallyTypeActive] = useState(false);

  useEffect(() => {
    getData();
  }, [active]);

  /**
   * Fetch on initial page load
   * @returns
   */
  async function getData() {
    try {
      await getEventRallyTypes();
      await getAllRallyTypes();
    } catch (error) {
      popModal("An error occured getting the event", undefined, true);
    }
  }

  /*************************
   * Get every rally type available
   */
  async function getAllRallyTypes() {
    try {
      setAllRallyTypes(await fetchAllRallyTypes());
    } catch (error) {
      popModal("An error occured getting the event", undefined, true);
    }
  }

  /*************************************
   * Get the rally types for this event
   */
  async function getEventRallyTypes() {
    if (!event) return;
    try {
      setEventRallyTypes(await fetchRallyTypes(event.id));
    } catch (error) {
      popModal("An error occured getting the event", undefined, true);
    }
  }

  /**********************************************************
   * Handle the process of removing a rally type from the event
   * @param typeId 
   */
  async function onRemoveClick(typeId: number) {
    if (!event?.id) return;
    try {
      await deleteEventRallyType(event.id, typeId);
      popModal("Rally type removed!");
      setEventRallyTypes(
        eventRallyTypes?.filter((t) => t.rally_types.id != typeId)
      );

      await getAllRallyTypes();
    } catch (error) {
      popModal("An error removing this rally type", undefined, true);
    }
  }

  async function onAddClick(e: React.MouseEvent, typeId: number) {
    if (!event || !allRallyTypes || !eventRallyTypes) return;
    e.stopPropagation();

    try {
      await insertRallyTypeForEvent(typeId, event?.id);
      popModal("New rally type added to your event!");
      setAllRallyTypes(allRallyTypes?.filter((t) => t.id != typeId));

      await getEventRallyTypes();
    } catch (error) {
      console.error(error);
      popModal(
        "An error occurred adding this rally type",
        "Refresh the page and try again",
        true
      );
    }
  }

  if (!event) return;

  return (
    <div>
      <AddRallyTypeMenu
        active={addRallyTypeActive}
        onClose={() => setAddRallyTypeActive(false)}
        allTypes={allRallyTypes}
        eventTypes={eventRallyTypes}
        onTypeAdded={() => getAllRallyTypes()}
        onAddClick={onAddClick}
        popModal={popModal}
      />

      <BasicMenu
        zIndex={20}
        width={"95%"}
        active={active}
        onClose={onClose}
        disableClickOff
      >
        <div className="col w100 m0 p0">
          <h2 className="p0 m0">{event.name}</h2>
          <div className="row w100">
            <div className="col w50">
              <h3>Your rally types are</h3>
              <div style={{ maxHeight: "100%", overflow: "auto" }}>
                {eventRallyTypes?.map((e, i) => (
                  <div
                    key={i}
                    className="textLeft mb1 boxed p1 row between middle"
                  >
                    <p style={{textTransform: "capitalize"}}>{e.rally_types.name}</p>
                    <IonIcon
                    onClick={() => onRemoveClick(e.rally_types.id)}
                      name="remove-circle"
                      className="clickable"
                      style={{
                        height: 20,
                        width: 20,
                        color: "var(--dangerColor)",
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                className="p1 mt1 accentButton"
                onClick={() => setAddRallyTypeActive(true)}
              >
                + Rally Type
              </button>
            </div>
          </div>
        </div>
      </BasicMenu>
    </div>
  );
}
