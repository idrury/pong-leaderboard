import IonIcon from "@reacticons/ionicons";
import { IoniconName } from "../../assets/Ionicons";
import { ActivatableElement } from "../../Types";
import BasicMenu from "../BasicMenu";

interface ConfirmMenuProps
  extends ActivatableElement {
  onConfirm: () => void;
  header?: string;
  body?:string;
  width?: number | string;
  zIndex?: number; 
  icon?: IoniconName;
}

export default function ConfirmMenu({
  header = "Please confirm",
  body,
  icon,
  active,
  width = 300,
  zIndex = 20,
  onConfirm,
  onClose,
}: ConfirmMenuProps) {
  return (
   
    <BasicMenu
      active={active}
      width={width}
      zIndex={zIndex}
      onClose={onClose}
      disableClickOff
    >
      <div className="p2">
        {icon && (
          <IonIcon
            name={icon}
            style={{ height: 50, width: 50 }}
          />
        )}
        <h2 style={{fontSize: 20}}>{header}</h2>
        {body && <p>{body}</p>}
        <form action="submit" onSubmit={f => {f.preventDefault(), onConfirm()}}>
          <div className="row middle center w100 pt2 mt2">
            <button autoFocus
              onClick={onClose}
              className="row middle center w100 mr1"
            >
              <IonIcon
                name="arrow-back"
                className="mr2"
              />
              <p>Cancel</p>
            </button>
            <button
              onClick={onConfirm}
              className="accentButton row middle center w100 ml1"
            >
              <IonIcon
                name="checkmark-circle"
                className="mr2"
              />
              <p>Confirm</p>
            </button>
          </div>
        </form>
      </div>
    </BasicMenu>
  );
}
