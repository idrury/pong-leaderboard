import IonIcon from "@reacticons/ionicons";
import Card from "react-bootstrap/Card";
import { HighestRallyType } from "../../Types";
import { DateTime } from "luxon";
import { timeToHex } from "./HsBusinessLogic";
import ShinyText from "../Animations/ShinyText";
import Counter from "../Animations/Counter";
import { getPlaces } from "../../common/CommonFunctions";
interface HighscoreCardProps {
  highestRally: HighestRallyType;
  maxHits: number;
}

function HighscoreCard({
  highestRally,
  maxHits,
}: HighscoreCardProps) {

  return (
    <div
      className="m1 outline col center "
      style={{
        background: timeToHex(highestRally.time, maxHits, true)
      }}
    >
      <div>
        <Card.Body className="w100 col middle p2">
          <div
            className="row middle center bold mt2 mb2"
            style={{ textTransform: "capitalize" }}
          >
            <IonIcon name="bowling-ball" className="mr1" />
            <p className="">{highestRally.rallyType}</p>
          </div>
          {(highestRally.time < 5 && highestRally.highestHits > 0) && (
            <div
              className="boxed m0"
              style={{ background: "var(--secondaryColor)" }}
            >
              <ShinyText text="New Record" />
            </div>
          )}
          <div className="pt2 mb2">
            <Counter
              value={highestRally.highestHits}
              places={getPlaces(highestRally.highestHits)}
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
              {highestRally.person ? (
                <div className="row">
                  <p className="pr1">
                    {DateTime.now()
                      .minus({ minutes: highestRally.time })
                      .toRelative({ style: "long" })}{" "}
                    by
                  </p>
                  <p
                    style={{ textTransform: "capitalize" }}
                    className="bold"
                  >
                    {highestRally.person}
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
