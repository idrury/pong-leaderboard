import { useState } from "react";
import MoveableMenu from "../MoveableMenu";
import IonIcon from "@reacticons/ionicons";

export default function qrCodeModal() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pl1">
      <img
        onClick={() => setOpen(!open)}
        className="clickable"
        style={{ maxWidth: 75 }}
        src="/qr-code.png"
        alt="QR Code"
      />
      <MoveableMenu
        width={120}
        height={20}
        x={95}
        y={30}
        z={20}
        onClose={() => {}}
        active={!open}
        autoHide={false}
        noBlur
      >
        <div className="boxedSecondary outline h100 row middle">
          <IonIcon
            className="h2Icon"
            name="arrow-back-circle"
            style={{ color: "var(--background)" }}
          />
          <h3
            style={{
              textTransform: "uppercase",
              color: "var(--background)",
            }}
            className=""
          >
            Join in!
          </h3>
        </div>
      </MoveableMenu>
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
        <div className="boxedAccent w100 p2">
          <h2 className="boxed p2 mb2">SCAN TO ADD YOUR RALLIES!</h2>
          <img
            style={{ width: 350 }}
            src="/qr-code.png"
            alt="QR Code"
          />
          <p className="bold mt2 mb1 boxed pt1 pb1">
            pong-leaderboard.vercel.app/
          </p>
        </div>
      </MoveableMenu>
    </div>
  );
}
