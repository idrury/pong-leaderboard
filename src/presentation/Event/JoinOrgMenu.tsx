import React from "react";
import BasicMenu from "../BasicMenu";
import {
  ActivatableElement,
  OrganisationSummaryObject,
} from "../../Types";
import IonIcon from "@reacticons/ionicons";

export interface JoinOrgMenuProps extends ActivatableElement {
  organisation: OrganisationSummaryObject;
  onConfirm: () => void;
}

/******************************
 * JoinOrgMenu component
 * @todo Create description
 */
export function JoinOrgMenu({
  active,
  organisation,
  onConfirm,
  onClose,
}: JoinOrgMenuProps) {
  return (
    <BasicMenu active={active} onClose={() => onClose} width={400}>
      <div>
        <h2>Do you want to join {organisation.org_name}?</h2>
        <p className="col center middle textCenter mb2 pb2">
          You can still see scores without joining, but you won't be
          able to add new rallies.
        </p>
        <div className="row w100">
          <button className="w100 mr1 row center middle" onClick={() => onClose()}>
            <IonIcon name="arrow-back" className="mr1" />
            <p>Cancel</p>
          </button>

          <button
            className="accentButton w100 mr1  row center middle"
            onClick={() => onConfirm()}
          >
            <IonIcon name="checkmark-circle" className="mr1" />
            <p>Confirm</p>
          </button>
        </div>
      </div>
    </BasicMenu>
  );
}
