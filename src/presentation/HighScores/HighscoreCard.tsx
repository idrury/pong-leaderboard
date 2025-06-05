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
            width: 350,
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
            <div
              className="row middle center mt2 bold"
              style={{ textTransform: "capitalize" }}
            >
              <IonIcon name="person-circle" className="mr1" />
              <p className="m0">
                {highestRally.person
                  ? `${DateTime.now()
                      .minus({ minutes: highestRally.time })
                      .toRelative({ style: "long" })} by ${
                      highestRally.person
                    }`
                  : "not claimed yet!"}
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default HighscoreCard;
