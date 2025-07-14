import IonIcon from "@reacticons/ionicons";
import { useState } from "react";
import { fetchEvent } from "../../DatabaseAccess/select";
import {
  ErrorLabelType,
  PopSavedModalFn,
} from "../../Types";
import { useNavigate } from "react-router-dom";
import toString, { isMobileBrowser } from "../../common/CommonFunctions";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { SplitText } from "gsap/SplitText";


interface EnterCodeProps {
  popModal?: PopSavedModalFn;
}

export default function EnterCode({}: EnterCodeProps) {
  const [eventId, setEventId] = useState("");
  const [error, setError] =
    useState<ErrorLabelType>({
      active: false,
    });
  const [enterHovered, setEnterHovered] =
    useState(false);
  const navigate = useNavigate();

  gsap.registerEffect(SplitText);

  useGSAP(() => {
    const titleSplit = SplitText.create(
      "#title",
      { type: "chars" }
    );

    gsap.from(titleSplit.chars, {
      opacity: 0,
      y: -50,
      stagger: 0.05,
    });
  }, []);

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

  async function onEnterOver() {
    if(!eventId) return;
    await gsap.to("#enterButton", {
      width: 200,
      duration: 0.1,
      ease: "bounce",
    });
    setEnterHovered(true);
  }

  async function onEnterOut() {
        if(!eventId) return;

    await gsap.to("#enterButton", {
      width: 'auto',
      duration: 0.1,
      ease: "bounce",
    });

    setEnterHovered(false);
  }

  return (
    <div className="col middle w100">
      <div />
      <div className="">
        <h1 id="title" style={{fontSize: `${isMobileBrowser() ? 40 : undefined}px`}}>Ping-pong-a-thon</h1>
      </div>
      <div className="col center middle w100">
        <div className="w100 ml2 mr2 col middle">

          <form
            onSubmit={handleSubmit}
            className="w25"
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
                  className="w100 ml2 pl2 h100 invisible"
                  type="text"
                  value={eventId}
                  onChange={(e) =>
                    setEventId(e.target.value)
                  }
                  placeholder="XY3F"
                  style={{
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                  required
                />
                <button
                  type="submit"
                  id="enterButton"
                  onMouseOver={onEnterOver}
                  onMouseOut={onEnterOut}
                  disabled={!eventId}
                  className="accentButton middle end m1"
                  style={{ fontSize: "12pt"}}
                >
                  {enterHovered && (
                    <h3
                      style={{ fontSize: 20 }}
                      className="mr2"
                    >
                      Submit
                    </h3>
                  )}
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
