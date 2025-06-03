import { useEffect, useState } from 'react'
import './App.css'
import { fetchPeople, fetchRallies, fetchRallyTypes } from './DatabaseAccess/select'
import HighscoreCard from './presentation/HighscoreCard';
import RecentScores from './presentation/RecentScores';
import Header from './presentation/Header'
import type { RallyObject, RallyTypeObject } from './Types';
import { useStopwatch } from 'react-timer-hook';

function App () {

  const [rallies, setRallies] = useState<RallyObject[]>();
  const [rallyTypes, setRallyTypes] = useState<RallyTypeObject[]>();
  const {totalSeconds, reset} = useStopwatch({autoStart: true});

  useEffect(() => {
    fetchData();
  }, []);

  console.log(totalSeconds)

  if(totalSeconds > 10) {
    fetchData();
    reset();
  }

  

  async function fetchData () {
    try {
      const people = await fetchPeople();
      console.log('Fetched people:', people);

      const rallies = await fetchRallies();
      console.log('Fetched rallies:', rallies); const rallyTypes = await fetchRallyTypes();
      console.log('Fetched rally types:', rallyTypes);
      setRallies(rallies);
      setRallyTypes(rallyTypes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function findHighestRally (rallies: RallyObject[]): RallyObject | null {
    if (!rallies || rallies.length === 0) {
      console.log('No rallies available');
      return null;
    }

    // Log all rally hits
    // console.log('All rally hits:');
    rallies.forEach((rally, index) => {
      console.log(`Rally ${index}: ${rally.num_hits} hits`, rally);
    });

    // Sort rallies by num_hits in descending order and get the highest one
    const sortedRallies = [...rallies].sort((a, b) => b.num_hits - a.num_hits);

    // console.log('Rallies ranked by hits (highest to lowest):');
    // sortedRallies.forEach((rally, index) => {
    //   console.log(`Rank ${index + 1}: ${rally.num_hits} hits`, rally);
    // });

    const highestRally = sortedRallies[0];
    // console.log('Highest rally:', highestRally);

    return highestRally;
  }

  function findHighestRallyByType (rallies: RallyObject[], rallyTypes: RallyTypeObject[]) {
    if (!rallies || !rallyTypes || rallies.length === 0 || rallyTypes.length === 0) {
      console.log('No rallies or rally types available');
      return [];
    }

    const allHighestRallies = rallyTypes.map(rallyType => {
      // Filter rallies that match this rally type
      // Note: Currently rally_type field in rallies is null in your data
      const matchingRallies = rallies.filter(rally => {
        return rally.rally_type === rallyType.name || rally.rally_type === rallyType.id.toString();
      });

      // If no matching rallies found due to null rally_type, 
      // we'll temporarily assign rallies based on index for demonstration
      let ralliesToCheck = matchingRallies;
      if (matchingRallies.length === 0) {
        // Temporary logic: assign rallies to types by index until database is fixed
        const typeIndex = rallyTypes.findIndex(rt => rt.id === rallyType.id);
        ralliesToCheck = rallies.filter((_, index) => index % rallyTypes.length === typeIndex);
      }

      // Find the highest rally among matching rallies
      const highestRally = ralliesToCheck.length > 0 ? ralliesToCheck.reduce((highest, current) => {
        return current.num_hits > highest.num_hits ? current : highest;
      }, ralliesToCheck[0]) : null;

      return {
        rallyType: rallyType.name,
        highestHits: highestRally ? highestRally.num_hits : 0,
        person: highestRally ? highestRally.people?.name || null : null
      };
    });

    console.log('All highest rallies by type:', allHighestRallies);
    return allHighestRallies;
  }

  // Call the function when rallies are available
  useEffect(() => {
    if (rallies && rallies.length > 0) {
      const highestRally = findHighestRally(rallies);
      console.log('Rally with most hits:', highestRally);

      if (rallyTypes && rallyTypes.length > 0) {
        const allHighestRallies = findHighestRallyByType(rallies, rallyTypes);
        console.log('All highest rallies by type:', allHighestRallies);
      }
    }
  }, [rallies, rallyTypes]);

  // Compute allHighestRallies from rallies and rallyTypes
  const allHighestRallies = (rallies && rallyTypes) ? findHighestRallyByType(rallies, rallyTypes) : [];
  const allRallies = (rallies && rallyTypes) ? rallies : [];

  return (
    <>
      <div>
        <Header />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
          <div style={{ display: "flex" }}>
            {allHighestRallies.map((item, index) => (
              <HighscoreCard
                key={index}
                recordType={item.rallyType}
                highestRally={{
                  num_hits: String(item.highestHits),
                  person: item.person || ''
                }}
              />
            ))}
          </div>

          <div>
            <h1 style={{ alignContent: 'center', alignItems: 'flex-start' }}>Recnt scores</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              {allRallies.map((rally, index) => (
                <RecentScores key={index} rally={rally} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App