import { CampaignRallyTypeObject, PopSavedModalFn } from "../../Types";
import IonIcon from "@reacticons/ionicons";
import QrCodeModal from "../App/QrCodeModal";
import { isMobileBrowser } from "../../common/CommonFunctions";
import { Session } from "@supabase/supabase-js";
import Auth from "../Authentication/Auth";
interface HeaderProps {
  rallyTypesState?: CampaignRallyTypeObject[];
  activeSavedModal: PopSavedModalFn;
  activateEditModal?: () => void;
  session: Session | undefined;
  profile: any | undefined;
  title?: string
}

export default function Header ({
  session,
  activeSavedModal,
  activateEditModal,
  profile,
  title
}: HeaderProps) {

  return (
    <div>
      <div
        style={{ position: "fixed", minHeight: "100vh", zIndex: -5 }}
      >
      </div>
      <div className="m0 between middle w100 pt1 pb1" style={{ position: "relative" }}>
        {/* Centered Title and Icon */}
        <div
          className="row middle"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        >
          <IonIcon
            name="bowling-ball-sharp"
            className="mr2 h2Icon"
          />
          <h2
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=xvFZjo5PgG0",
                "_blank"
              )
            }
            style={{
              fontWeight: 700,
              fontSize: 30,
              cursor: "pointer",
              margin: 0,
            }}
          >
            {title || "Ping-Pong-A-Thon leaderboard"}
          </h2>
        </div>
        {/* Left side: QR code */}
        <div className="row middle" style={{ minWidth: 0 }}>
          {!isMobileBrowser() && <QrCodeModal />}
        </div>
        {/* Right side: Add rally and Auth */}
        <div className="row middle" style={{ minWidth: 0 }}>
          {session && (
            <button
              className="accentButton mr2 p0 pt2 pb2 pl2 pr2 outline"
              onClick={() => activateEditModal && activateEditModal()}
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
