import type { RallyObject } from '../Types';

interface RecentScoresProps {
  rally: RallyObject;
}

function RecentScores ({ rally }: RecentScoresProps) {
  // console.log('RecentScores rally prop:', rally);

  const playerName = rally.people?.name || 'Cras justo odio';
  const isStarPlayer = playerName === 'James Mann' || playerName === 'Isaac Drury' || playerName === 'isaac drury';
  const isJesusChrist = playerName === 'Jesus' || playerName === 'Jesus Christ' || playerName === 'jesus christ' || playerName === 'jesus';
  const isPingPong = playerName === 'Ping Pong' || playerName === 'Ping' || playerName === 'Pong' || playerName === 'pingpongathon';
  const isNate = playerName === 'Nate' || playerName === 'nate' || playerName === 'Nat' || playerName === 'nat';
  const isJerry = playerName === 'Jerry' || playerName === 'jerry' || playerName === '';
  const isDaniel = playerName === 'Daniel' || playerName === 'daniel' || playerName === 'Daniel Ambrose' || playerName === 'daniel ambrose';
  const isIsaacMann = playerName === 'Isaac Mann' || playerName === 'isaac mann';
  const isIsaacHegedus = playerName === 'Isaac Hegedus' || playerName === 'isaac hegedus';
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
      {isJesusChrist && (
        <div style={{
          color: '#ffd700',
          fontSize: '18px',
          marginRight: '8px',
          marginLeft: '-32px',
        }}>
          👑
        </div>
      )}
      {isPingPong && (
        <div style={{
          color: '#ffd700',
          fontSize: '18px',
          marginRight: '8px',
          marginLeft: '-32px',
        }}>
          🏓
        </div>
      )}
      {isNate && (
        <div style={{
          color: '#ffd700',
          fontSize: '18px',
          marginRight: '8px',
          marginLeft: '-32px',
        }}>
          🏓
        </div>
      )}
      {isJerry && (
        <div style={{
          color: '#ffd700',
          fontSize: '18px',
          marginRight: '8px',
          marginLeft: '-32px',
        }}>
          🏓
        </div>
      )}
      {isDaniel && (
        <div style={{
          color: '#ffd700',
          fontSize: '18px',
          marginRight: '8px',
          marginLeft: '-32px',
        }}>
          🏓
        </div>
      )}
      {isIsaacMann && (
        <div
          onClick={() => window.open('https://www.youtube.com/watch?v=wo_D2TYJj6E', '_blank')}
          style={{
            color: '#ffd700',
            fontSize: '18px',
            marginRight: '8px',
            marginLeft: '-32px',
          }}>
          🥪
        </div>
      )}
      {isIsaacHegedus && (
        <div
          onClick={() => window.open('https://www.youtube.com/watch?v=HcOnFbKjSyo', '_blank')}
          style={{
            color: '#ffd700',
            fontSize: '18px',
            marginRight: '8px',
            marginLeft: '-32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}>
          <img
            src="/white-history.png"
            alt="white history"
            style={{
              width: '18px',
              height: '18px',
              marginRight: '4px'
            }}
          />

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