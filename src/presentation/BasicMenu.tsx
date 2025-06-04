import IonIcon from "@reacticons/ionicons";
import { IoniconName } from "../assets/Ionicons";
import { ActivatableElement } from "../Types";

interface BasicMenuProps extends ActivatableElement {
  children: any;
  width: number | string;
  icon?: { name: IoniconName; color?: string; size: number };
  zIndex?: number;
  disableClickOff?: boolean;
}

const BasicMenu = ({
  active,
  onClose,
  children,
  width,
  icon,
  zIndex = 20,
  disableClickOff = false,
}: BasicMenuProps) => {
  if (active) {
    return (
      <div
        style={{ zIndex: zIndex }}
        className="moveableMenuBackground mediumFade center middle"
        onClick={() => {
          if (!disableClickOff) onClose();
        }}
      >
        <div
          className="boxedDark s2 p0 boxedOutline"
          style={{ width: width, height: "auto" }}
        >
          <div
            className="rightRow boxed m0"
            style={{
              width: "90%",
              margin: "0 0 10px 0",
              padding: "10px 5%",
            }}
          >
            <IonIcon
              className="buttonIcon"
              name="close"
              onClick={() => onClose()}
            />
          </div>
          <div style={{ padding: 10 }}>
            {icon && (
              <div className="center">
                <IonIcon
                  style={{
                    width: icon.size,
                    height: icon.size,
                    color: icon.color || "red",
                  }}
                  name={icon.name}
                />
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    );
  }
};
export default BasicMenu;
