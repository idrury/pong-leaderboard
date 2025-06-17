import { useState } from "react";
import MoveableMenu from "../MoveableMenu";
import IonIcon from "@reacticons/ionicons";

export default function qrCodeModal() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pl1">
      <div className="row middle boxed" style={{background: "#FFF"}}>
        <img
          onClick={() => setOpen(!open)}
          className="clickable mr2"
          style={{ maxWidth: 75 }}
          src="/qr-code.png"
          alt="QR Code"
        />
        <div
          className="row middle pr2"
          style={{ top: 25, left: 100, height: 30 }}
        >
          <IonIcon
            className="h2Icon"
            name="arrow-back-circle"
            style={{ color: "var(--primaryColor)" }}
          />
          <h3
            style={{
              textTransform: "uppercase",
              color: 'var(--primaryColor)'
            }}
          >
            Join in!
          </h3>
        </div>
      </div>
      <MoveableMenu
        width={350}
        x={10}
        y={100}
        z={20}
        onClose={() => setOpen(false)}
        active={open}
        autoHide={false}
        noBlur
      >
        <div className="boxedAccent outline w100 p2">
          <h2 className="p2 mb2">Scan to add your rallies!</h2>
          <img
            className="outline"
            style={{ width: 300 }}
            src="/qr-code.png"
            alt="QR Code"
          />
          <p className="bold mt2 mb1 pt1 pb1">
            pong-leaderboard.vercel.app/
          </p>
        </div>
      </MoveableMenu>
    </div>
  );
}
