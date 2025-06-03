import '.././App.css'
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

interface RecentScoresProps {
  record: {
    type: string;
    number: number;
    name: string;
  };
}

function RecentScores ({ record }: RecentScoresProps) {

  return (
    <>
      <ListGroup as="ol" numbered>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          {record.type}
          <div className="ms-2 me-auto">
            <div className="fw-bold">Subheading</div>
            {record.name}
          </div>
          <Badge bg="primary" pill>
            {record.number}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    </>
  )
}

export default RecentScores;