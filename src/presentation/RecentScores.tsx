import '.././App.css'
import type { RallyObject } from '../Types';

interface RecentScoresProps {
  rally: RallyObject;
}

function RecentScores ({ rally }: RecentScoresProps) {
  // console.log('RecentScores rally prop:', rally);

  const playerName = rally.people?.name || 'Cras justo odio';
  const isStarPlayer = playerName === 'James Mann' || playerName === 'Isaac Drury';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      minWidth: '350px',
      padding: '12px 16px',
      marginBottom: '8px',
      backgroundColor: '#2d3748',
      color: 'white',
      borderRadius: '6px',
      border: '1px solid #4a5568'
    }}>
      {/* Left side content */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontWeight: 'bold',
          fontSize: '16px',
          marginBottom: '2px'
        }}>
          {rally.rally_type || 'Subheading'}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#a0aec0'
        }}>
          {playerName}
        </div>
      </div>

      {/* Star icon for special players */}
      {isStarPlayer && (
        <div style={{
          color: '#ffd700',
          fontSize: '18px',
          marginRight: '8px',
          marginLeft: '-32px',
        }}>
          ⭐
        </div>
      )}

      {/* Right side number */}
      <div style={{
        backgroundColor: 'var(--primaryColor)',
        color: 'white',
        borderRadius: '50%',
        width: '38px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        marginLeft: '16px',
        flexShrink: 0
      }}>
        {rally.num_hits}
      </div>
    </div>
  )
}

export default RecentScores;