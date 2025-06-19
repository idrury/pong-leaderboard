import {
  CampaignRallyTypeObject,
  OrganisationSummaryObject,
  PopSavedModalFn,
  ProfileObject,
} from "../../Types";
import IonIcon from "@reacticons/ionicons";
import QrCodeModal from "../App/QrCodeModal";
import { isMobileBrowser } from "../../common/CommonFunctions";
import { Session } from "@supabase/supabase-js";
import Auth from "../Authentication/Auth";
import { useEffect, useState } from "react";

interface HeaderProps {
  rallyTypesState?: CampaignRallyTypeObject[];
  activeSavedModal: PopSavedModalFn;
  activateEditModal?: () => void;
  session?: Session | undefined;
  profile?: ProfileObject | undefined;
  gameCode?: string;
  organisation?: OrganisationSummaryObject;
}

export default function Header({
  session,
  activeSavedModal,
  activateEditModal,
  profile,
  gameCode,
  organisation,
}: HeaderProps) {
  const [mobileBrowser, setMobileBrowser] = useState(false);

  useEffect(() => {
    setMobileBrowser(isMobileBrowser());
  }, []);

  return (
    <div>
      <div
        className="m0 between middle w100 pt1 pb1"
        style={{ position: "relative" }}
      >
        {/* Left side: QR code */}
        {gameCode && (
          <div className="pl2 row middle">
            <div className="clickable">
              <a href="/" style={{ color: "var(--text)" }}>
                <IonIcon name="home" className="h2Icon" />
              </a>
            </div>
            {!mobileBrowser && (
              <div className="row middle" style={{ minWidth: 0 }}>
                <QrCodeModal />
              </div>
            )}
          </div>
        )}
        {/* Centered Title and Icon */}
        <div>
          {gameCode && (
            <div
              className="row middle center"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/watch?v=xvFZjo5PgG0",
                  "_blank"
                )
              }
            >
              <IonIcon
                name="phone-portrait-outline"
                className="mr2 h2Icon"
              />
              {!mobileBrowser && (
                <h2
                  style={{
                    fontWeight: 400,
                    fontSize: 30,
                    cursor: "pointer",
                    margin: 0,
                  }}
                  className="pr2"
                >
                  Join with code
                </h2>
              )}
              <h2>{gameCode || "XXXX"}</h2>
            </div>
          )}
        </div>
        {/* Right side: Add rally and Auth */}
        <div className="row middle" style={{ minWidth: 0 }}>
          {session &&
            !mobileBrowser &&
            gameCode &&
            !organisation?.blocked_user_ids?.find(
              (b) => b == profile?.id
            ) && (
              <button
                className="accentButton mr2 p0 pt2 pb2 pl2 pr2 outline"
                onClick={() =>
                  activateEditModal && activateEditModal()
                }
              >
                <div className="row middle center">
                  <IonIcon name="add-circle" className="h2Icon" />
                  Add rally
                </div>
              </button>
            )}
          <div className="ml1">
            <Auth
              profile={profile}
              session={session}
              popModal={activeSavedModal}
            />
          </div>
        </div>
      </div>
      {session && mobileBrowser && gameCode && (
        <div className="w100">
          <div className="pr2 pl2">
            <button
              className="accentButton mr2 p0 pt2 pb2 pl2 pr2 outline w100"
              onClick={() => activateEditModal && activateEditModal()}
            >
              <div className="row middle center">
                <IonIcon name="add-circle" className="h2Icon" />
                Add rally
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
