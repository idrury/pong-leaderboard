import IonIcon from "@reacticons/ionicons";
import { useEffect } from "react";
import {  useTimer } from "react-timer-hook";
import { ActivatableElement } from "../Types";

interface SavedModalProps extends ActivatableElement {
  timeout?: number;
  header?: string;
  body?: string;
  state?: "success" | "fail";
}

export default function SavedModal({
  active,
  onClose,
  timeout = 5,
  header,
  body,
  state = "success",
}:SavedModalProps) {
  const timerExpiry:Date = new Date();
  timerExpiry.setSeconds(
    new Date().getSeconds() + timeout
  );
  const {
    restart,
  } = useTimer({
    autoStart: false,
    expiryTimestamp: timerExpiry,
    onExpire: () => onClose(),
  });

  useEffect(() => {
    if (active == true) restart(timerExpiry, true);
  }, [active]);

  if (active) {
    return (
      <div
        className="boxedAccent boxedOutline s1 slowFade m0 p0"
        style={{
          backgroundColor: `${
            state == "success"
              ? "var(--primaryColor)"
              : "var(--dangerColor)"
          }`,
          position: "fixed",
          zIndex: 100,
          height: "auto",
          width: 250,
          right: 20,
          top: 20,
        }}
      >
        <IonIcon
          className="buttonIcon m0"
          name="close"
          style={{
            color: "var(--smallAccent)",
            position: "fixed",
            right: 20,
            width: 15,
          }}
          onClick={() => onClose()}
        />
        <div className="p0 m2 leftRow middle">
          <div>
            <IonIcon
              className="m1"
              name={`${
                state == "success"
                  ? "checkmark-circle-outline"
                  : "close-circle-outline"
              }`}
              style={{ width: 20, color: "#111111" }}
            />
          </div>
          <div>
            {header && (
              <h3 style={{ color: "#111111" }} className="m1">
                {header}
              </h3>
            )}
            {body && (
              <p style={{ color: "#111111" }} className="m1">
                {body}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
