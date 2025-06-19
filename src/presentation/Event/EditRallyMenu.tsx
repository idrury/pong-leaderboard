import IonIcon from "@reacticons/ionicons";
import {
  ActivatableElement,
  OrganisationSummaryObject,
  PopSavedModalFn,
  ProfileObject,
  RallyObject,
} from "../../Types";
import BasicMenu from "../BasicMenu";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { blockUser, patchRally } from "../../DatabaseAccess/patch";

interface EditRallyMenuProps extends ActivatableElement {
  rally: RallyObject | undefined;
  isAdmin: boolean;
  popModal: PopSavedModalFn;
  organisation: OrganisationSummaryObject;
}

export default function EditRallyMenu({
  active,
  onClose,
  isAdmin,
  rally,
  organisation,
  popModal,
}: EditRallyMenuProps) {
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  useEffect(() => {
    setDeleteConfirmed(false);
  }, [active]);

  async function onDelete() {
    if (!rally) return;

    // Confirm the delete
    if (deleteConfirmed == false) {
      setDeleteConfirmed(true);
      return;
    }

    // Do the delete
    try {
      await patchRally(rally.id, "hidden", true);
      popModal("Rally deleted!");
      onClose();
    } catch (error) {
      popModal(
        "An issue occurred deleting the rally",
        "Try again in a few moments",
        true
      );
      console.log(error);
    }
  }

  async function onBlock(userId: string) {
    try {
      await blockUser(organisation.org_id, userId);
      popModal("User banned!");
    } catch (error) {
      popModal("We can't ban this user right now", undefined, true);
      console.log(error);
    }
  }

  if (!rally) return;
  return (
    <BasicMenu
      disableClickOff
      width={300}
      active={active}
      onClose={() => onClose()}
    >
      <div className="col">
        <h2 className="m0 mb2">Rally {rally.id}</h2>
        <div className="mb2">
          <p>
            {DateTime.fromJSDate(new Date(rally.created_at)).toFormat(
              "h:m a 'on' MMMM dd yyyy"
            )}
          </p>
        </div>
        {rally.is_high_score && (
          <div className="row center middle boxedSecondary mb2">
            <IonIcon name="trophy" className="mr2" />
            <p style={{ color: "var(--background)" }}>
              This rally was a record!
            </p>
          </div>
        )}
        <label className="mb2">Type</label>
        <input
          className="mb2"
          disabled
          value={rally.rally_types.name}
        />
        <label className="mb2">hits</label>
        <input className="mb2" disabled value={rally.num_hits} />
        <label className="mb2">People</label>

        {(rally.profiles as ProfileObject[]).map((p) => (
          <div key={p.id} className="boxed row middle mb2">
            <input className="" disabled value={p.name} />
            {isAdmin && (
              <div>
                {organisation?.blocked_user_ids?.find(
                  (b) => b == p?.id
                ) ? (
                  <button
                    onClick={() => onBlock(p.id)}
                    disabled
                    className="dangerButton"
                  >
                    Banned
                  </button>
                ) : (
                  <button
                    onClick={() => onBlock(p.id)}
                    className="dangerButton"
                  >
                    Ban
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {isAdmin && (
          <button
            onClick={() => onDelete()}
            className={`${
              deleteConfirmed == true
                ? "dangerButton"
                : "dangerButtonOutline"
            } center row middle dangerButton mb2`}
          >
            <IonIcon name="trash-sharp" className="mr1" />
            {deleteConfirmed ? "Confirm delete" : "Delete rally"}
          </button>
        )}
      </div>
    </BasicMenu>
  );
}
