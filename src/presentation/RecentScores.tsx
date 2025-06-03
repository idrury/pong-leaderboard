import '.././App.css'
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import type { RallyObject } from '../Types';

interface RecentScoresProps {
  rally: RallyObject;
}

function RecentScores ({ rally }: RecentScoresProps) {
  console.log('RecentScores rally prop:', rally);

  return (
    <>
      <ListGroup style={{ minWidth: '300px' }}>
        <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
          <div>
            <div className="fw-bold">{rally.rally_type || 'Unknown Type'}</div>
            <div className="text-muted small">Person: {rally.people?.name || 'No player'}</div>
          </div>
          <Badge bg="primary" pill className="fs-4 px-4 py-2">
            {rally.num_hits}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    </>
  )
}

export default RecentScores;