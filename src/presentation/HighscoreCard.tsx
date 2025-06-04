import Card from 'react-bootstrap/Card';

interface HighscoreCardProps {
  highestRally: {
    num_hits: string; // highscore name
    person: string;
  }
  recordType: string; // type of highscore
}

function HighscoreCard ({ recordType, highestRally }: HighscoreCardProps) {
  // console.log('HighscoreCardProps:', highestRally);

  return (
    <>
      <div>
        <Card className='outline row m1 center middle' style={{ width: 350,height: 150 }}>
          <Card.Body>
            <Card.Title className='record'>{recordType}</Card.Title>
            <Card.Text className='number'>
              {highestRally.num_hits}
            </Card.Text>
            <Card.Text className='name'>
              {highestRally.person}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default HighscoreCard;