// import type CardText from 'react-bootstrap/esm/CardText';
import '.././App.css'
import Card from 'react-bootstrap/Card';

interface HighscoreCardProps {
  recordType: string;
}

function HighscoreCard ({ recordType }: HighscoreCardProps) {

  return (
    <>
      <div>
        <Card style={{ width: '18rem', border: '1px solid #ccc', margin: '20px' }}>
          <Card.Body>
            <Card.Title className='record'>{recordType}</Card.Title>
            <Card.Text className='number'>
              NUMBER
            </Card.Text>
            <Card.Text className='name'>
              NAME
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default HighscoreCard;