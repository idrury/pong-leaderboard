import { useEffect, useState } from "react";
import AddRallyMenu from "./AddRallyMenu";
import { PopSavedModalFn, RallyTypeObject } from "../../Types";
import IonIcon from "@reacticons/ionicons";
import QrCodeModal from "../App/QrCodeModal";
import { isMobileBrowser } from "../../common/CommonFunctions";
import { Session } from "@supabase/supabase-js";
import Auth from "../Authentication/Auth";
import Aurora from "../Animations/Aurora";
import Noise from "../Animations/Noise";

interface HeaderProps {
  rallyTypesState?: RallyTypeObject[];
  activeSavedModal: PopSavedModalFn;
  session: Session | undefined;
  profile: any | undefined;
}

export default function Header({
  session,
  rallyTypesState,
  activeSavedModal,
  profile,
}: HeaderProps) {
  const [editActive, setEditActive] =
    useState(false);

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
      <div className="m0 between middle w100 pt1 pb1">
        {!isMobileBrowser() && <QrCodeModal />}
        <div className="row middle pl2">
          <IonIcon
            name="bowling-ball-sharp"
            className="mr1"
          />
          <h2
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=xvFZjo5PgG0",
                "_blank"
              )
            }
            style={{
              fontWeight: 500,
              fontSize: "large",
              cursor: "pointer",
            }}
          >
            Ping-Pong-A-Thon 2025
          </h2>
        </div>
        <div className="row middle">
          {session && (
            <button
              className="accentButton mr2 p0 pt2 pb2 pl2 pr2 outline"
              onClick={() => setEditActive(true)}
            >
              <div className="row middle center">
                <IonIcon
                  name="add-circle"
                  className="h2Icon"
                />
                Add rally
              </div>
            </button>
          )}
          <Auth
            profile={profile}
            session={session}
            popModal={activeSavedModal}
          />
        </div>
      </div>
    </div>
  );
}
