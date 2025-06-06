import IonIcon from "@reacticons/ionicons";
import Card from "react-bootstrap/Card";
import { HighestRallyType } from "../../Types";
import { DateTime } from "luxon";
import { timeToHex } from "./HsBusinessLogic";
import SplitText from "./SplitText";
import { memo, useEffect } from "react";

interface HighscoreCardProps {
  highestRally: HighestRallyType;
  maxHits: number;
  score: number
}

const HighscoreCard = memo(
  function HighscoreCard({
    highestRally,
    maxHits,
    score
  }: HighscoreCardProps) {

    useEffect(() => {}, [score])
    console.log(highestRally)
    // console.log('HighscoreCardProps:', highestRally);
    const hex = timeToHex(highestRally.time, maxHits);
    //console.log(hex)
    return (
      <div className="m1">
        <div className="w100 h100 outerShadow">
          <Card
            className="outline clickable"
            style={{
              background: hex,
            }}
          >
            <Card.Body className="w100 col middle p2">
              <div
                className="row middle center bold"
                style={{ textTransform: "capitalize" }}
              >
                <IonIcon name="bowling-ball" className="mr1" />
                <p className="">{highestRally.rallyType}</p>
              </div>
              {highestRally.time < 5 && (
                <div
                  className="row middle center boxed mt2 w50"
                  style={{
                    background: "var(--secondaryColor)",
                  }}
                >
                  <IonIcon
                    name="trophy"
                    className="mr1"
                    style={{ color: "var(--background)" }}
                  />
                  <p
                    className="bold pt1 pb1"
                    style={{ color: "var(--background)" }}
                  >
                    New Record
                  </p>
                </div>
              )}
              <div className="pt2 mt2">
                <SplitText
                  text={score.toString()}
                  className="number"
                />
              </div>
              <div className="row middle center mt2">
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
          </Card>
        </div>
      </div>
    );
  }
);

export default HighscoreCard;
