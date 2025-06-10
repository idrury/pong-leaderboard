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
import { SplitText } from "gsap/SplitText";

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
  }, [rallyTypes]);

  useGSAP(() => {
    gsap.registerPlugin(SplitText);

    gsap.from(".titleTransition", {
      opacity: 0,
      x: -100,
      ease: "back",
    });

    gsap.from(".spinTransition", {
      opacity: 0,
      rotate: 0,
      ease: "back",
    });
  });

  // useGSAP(() => {
  //   gsap.from(".repeatSpin", {
  //     rotate: 360,
  //   });
  // }, [rallyTypesState]);

  function buttonMouseOver() {
    gsap.to(".textJump", {
      justifyContent: "start",
      width: "100%",
      duration: 0.2,
      ease: "power3",
    });

     gsap.from(".repeatSpin", {
      rotate: 360,
    });
  }

  function buttonMouseOff() {
    gsap.to(".textJump", {
      width: 200,
      duration: 0.2,
    });
         gsap.from(".repeatSpin", {
      rotate: 360,
    });
  }

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
        className={`m0 between middle w100 pt1 pb1  ${
          isMobileBrowser() && "center wrap"
        }`}
      >
        {!isMobileBrowser() && (
          <div className="w25 start">
            <QrCodeModal />
          </div>
        )}
        <div className="centerRow middle w50 center pl2">
          <IonIcon
            name="bowling-ball-sharp"
            className="mr2 h2Icon spinTransition"
          />
          {
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
              {isMobileBrowser()
                ? "Pong 25"
                : "Ping-Pong-A-Thon 2025"}
            </h2>
          }
        </div>
        <div
          className={`row middle end ${
            isMobileBrowser() ? "w100" : "w25"
          }`}
        >
          <button
            onMouseEnter={() => buttonMouseOver()}
            onMouseLeave={() => buttonMouseOff()}
            className="accentButton w100 mr2 ml2 p0 pt2 pb2 pl2 pr2 outline textJump"
            onClick={() => setEditActive(true)}
          >
            <div className="row middle center w100">
              <IonIcon
                name="add-circle"
                className="h2Icon repeatSpin"
              />
              ADD A RALLY
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
