import './App.css'
import HighscoreCard from './presentation/HighscoreCard';
import RecentScores from './presentation/RecentScores';


function App () {

  const record_types = ['rec1', 'rec2', 'rec3'];
  const records = [
    {
      type: 'rec1',
      number: 100,
      name: 'Player1'
    },
    {
      type: 'rec2',
      number: 100,
      name: 'Player2'
    },
    {
      type: 'rec3',
      number: 100,
      name: 'Player3'
    },
  ];


  return (
    <>
      <div>
        {record_types.map((recordType, index) => (
          <HighscoreCard key={index} recordType={recordType} />
        ))}
      </div>
      <div>
        {records.map((record, index) => (
          <RecentScores key={index} record={record} />
        ))}
      </div>
    </>
  )
}

export default App