import IonIcon from "@reacticons/ionicons";
import Card from "react-bootstrap/Card";
import { HighestRallyType } from "../../Types";
import { DateTime } from "luxon";
import { timeToHex } from "./HsBusinessLogic";

interface HighscoreCardProps {
  highestRally: HighestRallyType;
  maxHits: number;
}

function HighscoreCard({
  highestRally,
  maxHits,
}: HighscoreCardProps) {
  // console.log('HighscoreCardProps:', highestRally);
  const hex = timeToHex(highestRally.time, maxHits);
  //console.log(hex)
  return (
    <>
      <div>
        <Card
          className="outline row m1 center middle"
          style={{
            height: 150,
            background: hex,
          }}
        >
          <Card.Body className="w100 col middle">
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
            <Card.Text className="number">
              {highestRally.highestHits}
            </Card.Text>
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
    </>
  );
}

export default HighscoreCard;
