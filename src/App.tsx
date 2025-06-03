import './App.css'
import HighscoreCard from './presentation/HighscoreCard';


function App () {

  const record_types = ['rec1', 'rec2', 'rec3'];


  return (
    <>
      <div>
        {record_types.map((recordType, index) => (
          <HighscoreCard key={index} recordType={recordType} />
        ))}
      </div>
    </>
  )
}

export default App