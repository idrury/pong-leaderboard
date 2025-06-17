import IonIcon from "@reacticons/ionicons";
import { useState } from "react";
import { fetchEvent } from "../../DatabaseAccess/select";
import { PopSavedModalFn } from "../../Types";
import { useNavigate } from "react-router-dom";

interface EnterCodeProps {
  popModal: PopSavedModalFn;
}

export default function EnterCode({ popModal }: EnterCodeProps) {
  const [eventId, setEventId] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Handle event ID submission logic here

    try {
      const event = await fetchEvent(eventId);
      if (event) navigate(eventId);
    } catch (error) {
      popModal(
        "Looks like that event doesn't exist!",
        undefined,
        true
      );
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
          <form onSubmit={handleSubmit} className="w100">
            <input
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
