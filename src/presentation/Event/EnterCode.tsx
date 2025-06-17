import IonIcon from "@reacticons/ionicons";
import { useState } from "react";
import { fetchEvent } from "../../DatabaseAccess/select";
import { ErrorLabelType, PopSavedModalFn } from "../../Types";
import { useNavigate } from "react-router-dom";
import toString from "../../common/CommonFunctions";

interface EnterCodeProps {
  popModal?: PopSavedModalFn;
}

export default function EnterCode({ }: EnterCodeProps) {
  const [eventId, setEventId] = useState("");
  const [error, setError] = useState<ErrorLabelType>({
    active: false,
  });

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Handle event ID submission logic here
    const localEvent = toString(eventId).toUpperCase();
    setError({active: false})
    try {
      const event = await fetchEvent(localEvent);
      if (event) navigate(localEvent);
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
    <div className="w50 col middle">
      <div style={{ height: "15vh" }} />
      <div className="col center middle w50">
        <IonIcon
          name="trophy-sharp"
          style={{ fontSize: 80, color: "var(--secondaryColor)" }}
        />
        <div className="ml2 mr2">
          <h1>Event code</h1>
          <h4>
            Please enter your event ID to access the leaderboard
          </h4>
          {error.selector == "code" && (
            <div className="boxedLight mb2 row middle center">
              <IonIcon
                name="alert-circle"
                className="mr2"
                style={{ color: "var(--dangerColor" }}
              />
              <p
                style={{
                  color: "var(--dangerColor)",
                  fontWeight: 600,
                }}
              >
                {error.text}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="w100">
            <input
            autoFocus
              className="w100 mb2 textCenter"
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="XY3F"
              required
            />

            <button
              type="submit"
              className="w100 accentButton outline middle center"
              style={{ fontSize: "12pt" }}
            >
              <IonIcon
                name="caret-forward-circle"
                className="mr2 h2Icon"
              />
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
