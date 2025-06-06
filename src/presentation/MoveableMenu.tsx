import IonIcon from "@reacticons/ionicons";
import { useEffect, useState, type MouseEvent } from "react";
import { ActivatableElement } from "../Types";

interface MoveableMenuInterface extends ActivatableElement{
  x: number;
  y: number;
  z?: number;
  children: any;
  width?: number;
  height?: number;
  onRight?: boolean;
  onTop?: boolean;
  noBlur?: boolean;
  autoHide?: boolean;
}

const MoveableMenu = ({
  x = 0,
  y = 0,
  z = 15,
  active,
  onClose,
  children,
  width = 300,
  height = 300,
  onRight = false,
  onTop = false,
  noBlur = false,
  autoHide = false,
}: MoveableMenuInterface) => {
  let moveRight = onRight ? width : 0;
  let moveUp = onTop ? height : 0;

  const [screenWidth, setScreenWidth] = useState(
    window.innerWidth
  );
  const screenHeight = window.innerHeight;

  useEffect(() => {
    const handleResize = () =>
      setScreenWidth(window.innerWidth);
    window.addEventListener(
      "resize",
      handleResize
    );
    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  if (screenWidth - x < width) {
    moveRight = width;
  }

  if (screenHeight - y + 50 < height) {
    moveUp = height;
  }

  // Center box if screen width is small
  if (
    screenWidth <
    width + Math.round(width / 1.5)
  ) {
    x = screenWidth / 2 + width / 2;
  }

  // Center box if screen height is small
  if (
    screenHeight <
    height + Math.round(height)
  ) {
    y = screenHeight / 2 + height / 2;
    moveUp = height;
  }

  function updateIsActive(e: MouseEvent<HTMLDivElement>, forceClose = false) {
    if (
      /* @ts-ignore*/
      e?.target?.id == "close" ||
      (forceClose == true && autoHide == true)
    )
      onClose();
  }

  if (active) {
    return (
      <div
        id="close"
        className={`${
          !noBlur && "moveableMenuBackground"
        } mediumFade`}
        onClick={(e) => updateIsActive(e, true)}
      >
        <div
          className="moveableMenu delayFadeIn boxedOutline p0"
          style={{
            width: width,
            height: height,
            left: x - moveRight,
            top: y - moveUp,
            zIndex: z,
          }}
        >
          {autoHide && (
            <div
              className="rightRow boxed"
              style={{
                width: "94%",
                margin: 0,
                padding: "3%",
              }}
            >
              <IonIcon
                className="buttonIcon"
                name="close"
                onClick={(e) =>
                  updateIsActive(e, true)
                }
              ></IonIcon>
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }
};
export default MoveableMenu;
