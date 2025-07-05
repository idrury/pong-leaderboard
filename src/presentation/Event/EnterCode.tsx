import IonIcon from "@reacticons/ionicons";
import { useEffect, useState } from "react";
import { fetchEvent } from "../../DatabaseAccess/select";
import {
  ErrorLabelType,
  PopSavedModalFn,
} from "../../Types";
import { useNavigate } from "react-router-dom";
import toString from "../../common/CommonFunctions";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";

interface EnterCodeProps {
  popModal?: PopSavedModalFn;
}

export default function EnterCode({}: EnterCodeProps) {
  const [eventId, setEventId] = useState("");
  const [error, setError] =
    useState<ErrorLabelType>({
      active: false,
    });

  const navigate = useNavigate();

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    // Handle event ID submission logic here
    const localEvent =
      toString(eventId).toUpperCase();
    setError({ active: false });
    try {
      const event = await fetchEvent(localEvent);
      if (event) {
        navigate(`events/${localEvent}`);
      }
    } catch (error) {
      setError({
        text: "Looks like that event doesn't exist!",
        selector: "code",
        active: true,
      });
      return;
    }
  }
  return (
    <div className="col middle w100">
      <div />
      <div className="">
        <h1 className="">Ping-pong-a-thon</h1>
      </div>
      <div className="col center middle w100">
        <div className="w100 ml2 mr2 col middle">
          <h3
            style={{ zIndex: 10 }}
            className="textCenter pb2"
          >
            Enter your event code
          </h3>
          <form
            onSubmit={handleSubmit}
            className="w33"
          >
            <div
              className="w100 neonGlow m0"
              style={{
                borderRadius: 50,
              }}
            >
              <div
                className="row w100 middle"
                style={{
                  background: "#FFFFFFCC",
                  borderRadius: 50,
                }}
              >
                <input
                  autoFocus
                  className="w100 ml2  pl2 h100 invisible"
                  type="text"
                  value={eventId}
                  onChange={(e) =>
                    setEventId(e.target.value)
                  }
                  placeholder="XY3F"
                  style={{ fontWeight: 400 }}
                  required
                />
                <button
                  type="submit"
                  disabled={!eventId}
                  className="accentButton middle center m1"
                  style={{ fontSize: "12pt" }}
                >
                  <IonIcon
                    name="arrow-forward"
                    className="m0 h2Icon"
                  />
                </button>
              </div>
            </div>
            {error.selector == "code" && (
              <div
                className="mt2 boxedLight mb2 row middle center"
                style={{
                  height: 25,
                  borderRadius: 25,
                }}
              >
                <IonIcon
                  name="alert-circle"
                  className="mr2"
                  style={{
                    color: "var(--dangerColor",
                  }}
                />
                <p
                  style={{
                    color: "var(--dangerColor)",
                  }}
                >
                  {error.text}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
