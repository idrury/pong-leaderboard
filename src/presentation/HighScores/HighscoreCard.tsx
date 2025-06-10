import IonIcon from "@reacticons/ionicons";
import Card from "react-bootstrap/Card";
import { RallyObject } from "../../Types";
import { DateTime } from "luxon";
import { timeToHex } from "./HsBusinessLogic";
import ShinyText from "../Animations/ShinyText";
import Counter from "../Animations/Counter";
import { getPlaces } from "../../common/CommonFunctions";
import { Ref } from "react";
interface HighscoreCardProps {
  rally: RallyObject;
  maxHits: number;
  nodeRef?: Ref<HTMLDivElement>;
}

function HighscoreCard({
  rally,
  maxHits,
  nodeRef,
}: HighscoreCardProps) {
  if (!rally) return;

  const time: number = Math.round(
    DateTime.now()
      .diff(DateTime.fromJSDate(new Date(rally?.created_at)))
      .as("minutes")
  );

  return (
    <div
      ref={nodeRef}
      className="col center "
      style={{
        background: timeToHex(time, maxHits, true),
      }}
    >
      <div>
        <Card.Body className="w100 col middle p2">
          <div
            className="row middle center bold mt2 mb2"
            style={{ textTransform: "capitalize" }}
          >
            <IonIcon name="bowling-ball" className="mr1" />
            <p className="">{rally.rally_types?.name || "Other"}</p>
          </div>
          {time < 5 && rally.num_hits > 0 && (
            <div
              className="boxed m0"
              style={{ background: "var(--secondaryColor)" }}
            >
              <ShinyText text="New Record" />
            </div>
          )}
          <div className="pt2 mb2">
            <Counter
              value={rally.num_hits}
              places={getPlaces(rally.num_hits)}
              fontSize={80}
              padding={5}
              gap={10}
              textColor="white"
              fontWeight={900}
            />
          </div>
          <div className="row middle center mt2 mb2">
            <IonIcon name="person-circle" className="mr1" />
            <div className="m0" style={{ fontSize: "10pt" }}>
              {rally.people.name ? (
                <div className="row">
                  <p className="pr1">
                    {DateTime.now()
                      .minus({ minutes: time })
                      .toRelative({ style: "long" })}{" "}
                    by
                  </p>
                  <p
                    style={{ textTransform: "capitalize" }}
                    className="bold"
                  >
                    {rally.people.name}
                  </p>
                </div>
              ) : (
                "not claimed yet!"
              )}
            </div>
          </div>
        </Card.Body>
      </div>
    </div>
  );
}

export default HighscoreCard;
