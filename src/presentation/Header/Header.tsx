import { useEffect, useState } from "react";
import AddRallyMenu from "./AddRallyMenu";
import { PopSavedModalFn, RallyTypeObject } from "../../Types";
import IonIcon from "@reacticons/ionicons";
import QrCodeModal from "../App/QrCodeModal";
import { isMobileBrowser } from "../../common/CommonFunctions";
import Aurora from "../Animations/Aurora";
import Noise from "../Animations/Noise";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface HeaderProps {
  rallyTypes?: RallyTypeObject[];
  activeSavedModal: PopSavedModalFn;
}

export default function Header({
  activeSavedModal,
  rallyTypes,
}: HeaderProps) {
  const [editActive, setEditActive] = useState(false);
  const [rallyTypesState, setRallyTypeState] = useState(rallyTypes);

  useEffect(() => {
    setRallyTypeState(rallyTypes);
  }, [rallyTypes])

  useGSAP(() => {
    gsap.from(".titleTransition", {
      opacity: 0,
      x: -100,
      ease: "back",
    });

    gsap.from(".spinTransition", {
      opacity: 0,
      rotate: 360,
      ease: "back",
    });
  });


  return (
    <div>
      <div
        style={{ position: "fixed", minHeight: "100vh", zIndex: -5 }}
      >
        <Aurora
          colorStops={["#050c0f", "#124450", "#146679"]}
          blend={0.9}
          amplitude={2}
          speed={1}
        />
        <Noise
          patternSize={250}
          patternScaleX={1}
          patternScaleY={1}
          patternRefreshInterval={2}
          patternAlpha={15}
        />
      </div>
      <AddRallyMenu
        active={editActive}
        currentRallyTypes={rallyTypesState}
        onClose={() => setEditActive(false)}
        activateSaved={activeSavedModal}
      />
      <div
        className={`m0 between middle w100 pt1 pb1 wrap ${
          isMobileBrowser() && "center"
        }`}
      >
        {!isMobileBrowser() && <QrCodeModal />}
        <div className="centerRow middle pl2">
          <IonIcon
            name="bowling-ball-sharp"
            className="mr2 h2Icon spinTransition"
          />
          <h2
            className="titleTransition"
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=xvFZjo5PgG0",
                "_blank"
              )
            }
            style={{
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Ping-Pong-A-Thon 2025
          </h2>
        </div>
        <div
          style={{ zIndex: 20, top: 10 }}
          className={`row middle center ${
            isMobileBrowser() && "w100 fixed"
          }`}
        >
          <button
            className="accentButton mr2 ml2 p0 pt2 pb2 pl2 pr2 outline w100"
            onClick={() => setEditActive(true)}
          >
            <div className="row middle center w100">
              <IonIcon name="add-circle" className="h2Icon" />
              ADD A RALLY
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
