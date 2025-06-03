import '.././App.css'
import type { RallyObject } from '../Types';

interface RecentScoresProps {
  rally: RallyObject;
}

function RecentScores ({ rally }: RecentScoresProps) {
  console.log('RecentScores rally prop:', rally);

  return (
    <div 
    className='w100 pl'
    style={{
      width: "95%",
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '5px',
      backgroundColor: '#2d3748',
      color: 'white',
      borderRadius: '3px',
      border: '1px solid #4a5568'
    }}>
      {/* Left side content */}
      <div>
        <p className='pt1 pl1 m0' style={{
          fontWeight: 'bold',
          fontSize: '16px',
          marginBottom: '2px',
          textAlign: "start"
        }}>
          {rally.rally_type || 'Subheading'}
        </p>
        <div className='' style={{
          fontSize: '14px',
          color: '#a0aec0',
           textAlign: "start"
        }}>
          <p className='pb1 pl1 m0'>{rally.people?.name || 'Cras justo odio'}</p>
        </div>
      </div>

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