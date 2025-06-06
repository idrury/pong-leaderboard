import { useState } from "react";
import AddRallyMenu from "./AddRallyMenu";
import { PopSavedModalFn } from "../../Types";
import IonIcon from "@reacticons/ionicons";
import QrCodeModal from "../App/QrCodeModal";

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
      <div className="boxed outline m0 between middle w100 pt1 pb1">
        <QrCodeModal />
        <div className="row middle">
          <IonIcon name="bowling-ball-sharp" className="mr1" />
          <h2
            className="pl2"
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
          style={{height: 50}}
            className="accentButton mr2"
            onClick={() => setEditActive(true)}
          >
            <div className="row middle center">
              <IonIcon name="add-circle" className="mr1" />
              Add rally
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
