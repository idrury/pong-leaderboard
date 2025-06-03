import { useEffect, useState } from "react";
import "./App.css";
import {
  fetchRallies,
  fetchRallyTypes,
} from "./DatabaseAccess/select";
import HighscoreCard from "./presentation/HighscoreCard";
import RecentScores from "./presentation/RecentScores";
import Header from "./presentation/Header";
import type { RallyObject, RallyTypeObject } from "./Types";
import { useStopwatch } from "react-timer-hook";

function App() {
  const [rallies, setRallies] = useState<RallyObject[]>();
  const [rallyTypes, setRallyTypes] = useState<RallyTypeObject[]>();
  const { totalSeconds, reset } = useStopwatch({
    autoStart: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  if (totalSeconds > 10) {
    fetchData();
    reset();
  }

  /*******************************
   * Get rally data from the DB
   */
  async function fetchData() {
    try {
      const rallies = await fetchRallies();

      const rallyTypes = await fetchRallyTypes();
      setRallies(rallies);
      setRallyTypes(rallyTypes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  /*******************************
   * Loop through all rally types and 
   * find the highest rally for each type
   * @param rallies The rallies to get
   * @param rallyTypes The types of rallies
   * @returns An array of objects containing the highest rally for each type
   */
  function findHighestRallyByType(
    rallies: RallyObject[],
    rallyTypes: RallyTypeObject[]
  ) {
    if (
      !rallies ||
      !rallyTypes ||
      rallies.length === 0 ||
      rallyTypes.length === 0
    ) {
      return [];
    }

    const allHighestRallies = rallyTypes.map((rallyType) => {
      // Filter rallies that match this rally type
      const matchingRallies = rallies.filter((rally) => {
        return (
          rally.rally_type === rallyType.name ||
          rally.rally_type === rallyType.id.toString()
        );
      });

      // Find the highest rally among matching rallies
      const highestRally =
        matchingRallies.length > 0
          ? matchingRallies.reduce((highest, current) => {
              return current.num_hits > highest.num_hits
                ? current
                : highest;
            }, matchingRallies[0])
          : null;

      return {
        rallyType: rallyType.name,
        highestHits: highestRally ? highestRally.num_hits : 0,
        person: highestRally
          ? highestRally.people?.name || null
          : null,
      };
    });

    return allHighestRallies;
  }

  // Compute allHighestRallies from rallies and rallyTypes
  const allHighestRallies =
    rallies && rallyTypes
      ? findHighestRallyByType(rallies, rallyTypes)
      : [];
  const allRallies = rallies && rallyTypes ? rallies : [];

  return (
    <>
      <div className="w100">
        <Header />
        <div className="row">
          <div className="w100">
            <h2
              onClick={() =>
                window.open(
                  "https://www.youtube.com/watch?v=U8wLBOlCKPU",
                  "_blank"
                )
              }
              className="ml2 mt2 pt2 pl2 m0 textLeft"
              style={{
                cursor: "help",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                const tooltip = document.createElement("div");
                tooltip.innerHTML = `
                  <img src="../lightsaber-hdr.png" alt="lightsaber" style="width: 16px; height: 16px; margin-right: 5px; vertical-align: middle;" />
                  Hello There
                `;
                tooltip.style.cssText = `
                  position: absolute;
                  background: #333;
                  color: white;
                  padding: 5px 10px;
                  border-radius: 4px;
                  font-size: 12px;
                  top: -30px;
                  left: 0;
                  z-index: 1000;
                  white-space: nowrap;
                  display: flex;
                  align-items: center;
                `;
                e.currentTarget.appendChild(tooltip);
              }}
              onMouseLeave={(e) => {
                const tooltip = e.currentTarget.querySelector("div");
                if (tooltip) tooltip.remove();
              }}
            >
              High scores
            </h2>

            <div className="row wrap w100">
              {allHighestRallies.map((item, index) => (
                <HighscoreCard
                  key={index}
                  recordType={item.rallyType}
                  highestRally={{
                    num_hits: String(item.highestHits),
                    person: item.person || "",
                  }}
                />
              ))}
            </div>
          </div>

          <div
            className="w25"
            style={{
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <h2 className="textLeft">Recent scores</h2>
            <div>
              {allRallies.map((rally, index) => (
                <RecentScores key={index} rally={rally} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
