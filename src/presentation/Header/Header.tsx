import { useState } from "react";
import AddRallyMenu from "./AddRallyMenu";
import { PopSavedModalFn } from "../../Types";
import IonIcon from "@reacticons/ionicons";
import QrCodeModal from "../App/QrCodeModal";
import { isMobileBrowser } from "../../common/CommonFunctions";

interface HeaderProps {
  activeSavedModal: PopSavedModalFn;
}

export default function Header({ activeSavedModal }: HeaderProps) {
  const [editActive, setEditActive] = useState(false);

  return (
    <div>
      <AddRallyMenu
        active={editActive}
        onClose={() => setEditActive(false)}
        activateSaved={activeSavedModal}
      />
      <div className="boxed m0 between middle w100 pt1 pb1">
       {!isMobileBrowser() && <QrCodeModal />}
        <div className="row middle pl2">
          <IonIcon name="bowling-ball-sharp" className="mr1" />
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
          <button
            className="accentButton mr2 p0 pt2 pb2 pl2 pr2 outline"
            onClick={() => setEditActive(true)}
          >
            <div className="row middle center">
              <IonIcon name="add-circle" className="h2Icon" />
              ADD A RALLY
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
