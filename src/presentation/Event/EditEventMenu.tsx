import { useEffect, useState } from "react";
import {
  ActivatableElement,
  CampaignRallyTypeObject,
  ErrorLabelType,
  EventObject,
  PopSavedModalFn,
  ProfileObject,
  RallyTypeObject,
  UserAdminOrgsObject,
} from "../../Types";
import BasicMenu from "../BasicMenu";
import {
  fetchAllRallyTypes,
  fetchOrgAdmins,
  fetchProfileByName,
  fetchRallyTypes,
} from "../../DatabaseAccess/select";
import AddRallyTypeMenu from "./AddRallyTypeMenu";
import {
  insertRallyTypeForEvent,
  insertUserAdmin,
} from "../../DatabaseAccess/insert";
import IonIcon from "@reacticons/ionicons";
import {
  deleteEventRallyType,
  deleteUserAdmin,
} from "../../DatabaseAccess/delete";
import ErrorLabel from "../ErrorLabel";

interface EditEventMenuProps extends ActivatableElement {
  event: EventObject | undefined;
  org: UserAdminOrgsObject | undefined;
  popModal: PopSavedModalFn;
}

export default function EditEventMenu ({
  active,
  event,
  org,
  onClose,
  popModal,
}: EditEventMenuProps) {
  const [eventRallyTypes, setEventRallyTypes] =
    useState<CampaignRallyTypeObject[]>();
  const [allRallyTypes, setAllRallyTypes] =
    useState<RallyTypeObject[]>();
  const [addRallyTypeActive, setAddRallyTypeActive] = useState(false);
  const [adminProfiles, setAdminProfiles] = useState<
    { profiles: ProfileObject }[]
  >([]);
  const [newAdminName, setNewAdminName] = useState<string>();
  const [error, setError] = useState<ErrorLabelType>({
    active: false,
  });
  useEffect(() => {
    getData();
  }, [active]);

  /**
   * Fetch on initial page load
   * @returns
   */
  async function getData () {
    try {
      await getEventRallyTypes();
      await getAllRallyTypes();
      org?.id && await getOrgAdmins(org.id);
    } catch (error) {
      popModal("An error occured getting the event", undefined, true);
    }
  }

  /*************************
   * Get every rally type available
   */
  async function getAllRallyTypes () {
    try {
      setAllRallyTypes(await fetchAllRallyTypes());
    } catch (error) {
      popModal("An error occured getting the event", undefined, true);
    }
  }

  /*************************************
   * Get the rally types for this event
   */
  async function getEventRallyTypes () {
    if (!event) return;
    try {
      setEventRallyTypes(await fetchRallyTypes(event.id));
    } catch (error) {
      popModal("An error occured getting the event", undefined, true);
    }
  }
  async function getOrgAdmins (orgId: number) {
    try {
      const admins = await fetchOrgAdmins(orgId);
      setAdminProfiles(admins);
    } catch (error) {
      console.log(error);
      popModal(
        "An error occured getting the admins for this organisation",
        undefined,
        true
      );
    }
  }

  /**********************************************************
   * Handle the process of removing a rally type from the event
   * @param typeId
   */
  async function onRemoveClick (typeId: number) {
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

  async function onAddClick (e: React.MouseEvent, typeId: number) {
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

  /**
   * Handle removing user as admin
   * @param userId
   */
  async function removeUserFromOrg (userId: string) {
    if (!org) return;

    try {
      await deleteUserAdmin(org.id, userId);
      await getOrgAdmins(org.id);
      popModal("User is no longer an admin");
    } catch (error) {
      console.log(error);
      popModal(
        "An error occurred removing the user",
        "Refresh the page and try again",
        true
      );
    }
  }

  /****************************************
   * Add new admin to org
   */
  async function addNewAdmin () {
    if (!org) return;
    // Validate form
    if (!newAdminName || newAdminName.length < 2) {
      setError({
        active: true,
        selector: "name",
        text: "Enter a valid user name",
      });
      return;
    }
    if (adminProfiles.some((p) => p.profiles.name == newAdminName)) {
      setError({
        active: true,
        selector: "name",
        text: "That user is already an admin",
      });
      return;
    }

    let user: ProfileObject | null = null;

    // Try fetch user
    try {
      user = await fetchProfileByName(newAdminName);
    } catch (error) {
      setError({
        active: true,
        selector: "name",
        text: "We couldn't find that user",
      });
    }

    try {
      if (!user) return;
      await insertUserAdmin(org?.id, user.id);
      setAdminProfiles([...adminProfiles].concat({ profiles: user }));
    } catch (error) {
      console.log(error);
      setError({
        active: true,
        selector: "name",
        text: "We found that user, but an issue occured adding them to the organisation!",
      });
    }

    setError({ active: false });
    popModal("New admin added");
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
        <div className="col w100 m0 p0" style={{ maxHeight: "50vh" }}>
          <h2 className="p0 m0">{event.name}</h2>
          <div className="row w100">
            <div className="col w50">
              <div>
                <h3>User admins</h3>
                <div>
                  {adminProfiles?.map((profile, i) => (
                    <div
                      key={i}
                      className="boxed row p2 between mb2 middle"
                    >
                      <p>{profile.profiles.name}</p>
                      <div className="row end middle">
                        <p className="mr2">{profile.profiles.id}</p>
                        <IonIcon
                          onClick={() =>
                            removeUserFromOrg(profile.profiles.id)
                          }
                          name="remove-circle"
                          className="clickable"
                          style={{
                            height: 20,
                            width: 20,
                            color: "var(--dangerColor)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  action="submit"
                  onSubmit={(f) => {
                    f.preventDefault();
                    addNewAdmin();
                  }}
                >
                  <div className="row mb2">
                    <input
                      value={newAdminName || ""}
                      onChange={(e) =>
                        setNewAdminName(e.target.value)
                      }
                      className="w75 mr2"
                    />
                    <button
                      type="submit"
                      className="accentButton w25"
                    >
                      + Admin
                    </button>
                  </div>
                  <ErrorLabel
                    text={error.text}
                    active={error.selector == "name"}
                  />
                </form>
              </div>
              <h3>Your rally types are</h3>
              <div style={{ maxHeight: "50vh", overflow: "auto" }}>
                <button
                  className="p1 mt1 accentButton"
                  onClick={() => setAddRallyTypeActive(true)}
                >
                  + Rally Type
                </button>
                {eventRallyTypes?.map((e, i) => (
                  <div
                    key={i}
                    className="textLeft mb1 boxed p1 row between middle"
                  >
                    <p style={{ textTransform: "capitalize" }}>
                      {e.rally_types.name}
                    </p>
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

            </div>
          </div>
        </div>
      </BasicMenu>
    </div>
  );
}
