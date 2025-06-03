import '.././App.css'
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

interface RecentScoresProps {
  rally: {
    num_hits: number;
    rally_type: string | null;
  };
}

function RecentScores ({ rally }: RecentScoresProps) {

  return (
    <>
      <ListGroup>
        <ListGroup.Item
          as="li"
        >
          {rally.rally_type || 'Unknown'}
          <div className="ms-2 me-auto">
            <div className="fw-bold">Subheading</div>
          </div>
          <Badge bg="primary" pill>
            Score: {rally.num_hits}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    </>
  )
}

export default RecentScores;