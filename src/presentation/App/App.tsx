import { useEffect, useState } from "react";
import "./App.css";
import {
  fetchRallies,
  fetchRallyTypes,
} from "../../DatabaseAccess/select";
import HighscoreCard from "../HighscoreCard";
import RecentScores from "../RecentScores/RecentScores";
import Header from "../Header/Header";
import {
  PopSavedModalFn,
  SavedModalType,
  type RallyObject,
  type RallyTypeObject,
} from "../../Types";
import { useStopwatch } from "react-timer-hook";
import { findHighestRallyByType } from "./AppFunctions";
import SavedModal from "../SavedModal";
import IonIcon from "@reacticons/ionicons";

function App() {
  const [rallies, setRallies] = useState<RallyObject[]>();
  const [rallyTypes, setRallyTypes] = useState<RallyTypeObject[]>();
  const { totalSeconds, reset } = useStopwatch({
    autoStart: true,
  });
  const [savedModal, setSavedModal] = useState<SavedModalType>({
    active: false,
  });

  const allHighestRallies =
    rallies && rallyTypes
      ? findHighestRallyByType(rallies, rallyTypes)
      : [];
  const allRallies = rallies && rallyTypes ? rallies : [];
  useEffect(() => {
    fetchData();
  }, []);

  /** Re-fetch the rallies every 10 secs */
  if (totalSeconds > 10) {
    getAllRallies();
    reset();
  }

  /*******************************
   * Get rally data from the DB
   */
  async function fetchData() {
    console.log("Fetching data...");
    try {
      const rallyTypes = await fetchRallyTypes();
      setRallyTypes(rallyTypes);
      getAllRallies();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  /*********************************
   * Get all rallies from the DB
   */
  async function getAllRallies() {
    console.log("Fetching rallies...");
    try {
      setRallies(await fetchRallies());
    } catch (error) {
      console.error("Error occured fetching rallies:", error);
    }
  }

  /** Activate the saved popup box */
  const popSavedModal: PopSavedModalFn = (
    header,
    body,
    isError = false
  ) => {
    setSavedModal({
      active: true,
      header: header,
      body: body,
      state: isError ? "fail" : "success",
    });
  };

  function showToolTip(e: React.MouseEvent<HTMLHeadingElement>) {
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
  }

  return (
    <>
      <div className="w100">
        <SavedModal
          active={savedModal.active}
          onClose={() => setSavedModal({ active: false })}
          header={savedModal.header}
          body={savedModal.body}
          state={savedModal.state}
        />
        <Header activeSavedModal={popSavedModal} />
        <div className="row shrinkWrap">
          <div className="w100">
            <div className="row middle ml2">
              <IonIcon name="analytics" className="mt2" />
              <h2
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/watch?v=U8wLBOlCKPU",
                    "_blank"
                  )
                }
                className="mb2 mt2 pt2 pl2 m0 textLeft"
                style={{
                  textTransform: "uppercase",
                  cursor: "help",
                  position: "relative",
                }}
                onMouseEnter={(e) => showToolTip(e)}
                onMouseLeave={(e) => {
                  const tooltip =
                    e.currentTarget.querySelector("div");
                  if (tooltip) tooltip.remove();
                }}
              >
                High scores
              </h2>
            </div>

            <div
              className="row wrap w100"
              style={{
                maxHeight: "90vh",
                overflow: "auto",
                minWidth: 300,
              }}
            >
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
              minWidth: 300,
            }}
          >
            <div
              style={{ textTransform: "uppercase" }}
              className="row middle mb1  mt2"
            >
              <IonIcon name="list" className="mr2" />
              <h2 className="textLeft">Recent rallies</h2>
            </div>
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
