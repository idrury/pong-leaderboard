import IonIcon from "@reacticons/ionicons";
import Card from "react-bootstrap/Card";

interface HighscoreCardProps {
  highestRally: {
    num_hits: string; // highscore name
    person: string;
  };
  recordType: string; // type of highscore
}

function HighscoreCard({
  recordType,
  highestRally,
}: HighscoreCardProps) {
  // console.log('HighscoreCardProps:', highestRally);

  return (
    <>
      <div>
        <Card
          className="outline row m1 center middle"
          style={{ width: 350, height: 150 }}
        >
          <Card.Body>
            <Card.Title className="record">
              <div
                className="row middle center"
                style={{ textTransform: "capitalize" }}
              >
                <IonIcon name="trophy" className="mr1" />
                <p className="">{recordType}</p>
              </div>
            </Card.Title>
            <Card.Text className="number">
              {highestRally.num_hits}
            </Card.Text>
            <Card.Text className="name center">
              <div
                className="row middle center mt2"
                style={{ textTransform: "capitalize" }}
              >
                <IonIcon name="person-circle" className="mr1" />
                <p className="m0">
                  {highestRally.person || "CLAIM THIS RECORD!"}
                </p>
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default HighscoreCard;
