import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  fetchRallies,
  fetchRallyTypes,

} from "../../DatabaseAccess/select";
import HighscoreCard from "../HighScores/HighscoreCard";
import RecentScores from "../RecentScores/RecentScores";
import Header from "../Header/Header";
import {
  PopSavedModalFn,
  SavedModalType,
  type RallyObject,
  type RallyTypeObject,
} from "../../Types";
import { useStopwatch } from "react-timer-hook";
import SavedModal from "../SavedModal";
import {
  getHighestMins,
} from "./AppFunctions";
import { PacmanLoader } from "react-spinners";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function App() {
  const [rallies, setRallies] = useState<RallyObject[]>();
  const [rallyTypes, setRallyTypes] = useState<RallyTypeObject[]>();
  const { totalSeconds } = useStopwatch({
    autoStart: true,
    interval: 10000,
  });
  const [savedModal, setSavedModal] = useState<SavedModalType>({
    active: false,
  });
  const [maxHits, setMaxHits] = useState(0);
  const highScoreRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    fetchData();
  }, [totalSeconds]);

  useGSAP(() => {
    gsap.from(highScoreRefs.current, {
      opacity: 0,
      rotate: 20,
      zoom: 0.1,
      duration: 0.5,
      stagger: 0.2,
    });
  }, [rallyTypes?.length]);

  const addToRefs = (element: any) => {
    if (element && !highScoreRefs.current.includes(element)) {
      highScoreRefs.current.push(element);
    }
  };

  /*******************************
   * Get rally data from the DB
   */
  async function fetchData() {
    console.log("Fetching data...");
    try {
      setRallies(await fetchRallies());
      const fetchedRallyTypes = await fetchRallyTypes()
      setRallyTypes(fetchedRallyTypes)
      setMaxHits(getHighestMins(fetchedRallyTypes||[]));
    } catch (error) {
      console.error("Error fetching data:", error);
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

  // function showToolTip(e: React.MouseEvent<HTMLHeadingElement>) {
  //   const tooltip = document.createElement("div");
  //   tooltip.innerHTML = `
  //                 <img src="../lightsaber-hdr.png" alt="lightsaber" style="width: 16px; height: 16px; margin-right: 5px; vertical-align: middle;" />
  //                 Hello There
  //               `;
  //   tooltip.style.cssText = `
  //                 position: absolute;
  //                 background: #333;
  //                 color: white;
  //                 padding: 5px 10px;
  //                 border-radius: 4px;
  //                 font-size: 12px;
  //                 top: -30px;
  //                 left: 0;
  //                 z-index: 1000;
  //                 white-space: nowrap;
  //                 display: flex;
  //                 align-items: center;
  //               `;
  //   e.currentTarget.appendChild(tooltip);
  // }

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
        <Header
          activeSavedModal={popSavedModal}
          rallyTypes={rallyTypes}
        />
        <div className="row shrinkWrap">
          <div className="w100">
            {rallyTypes?.length === 0 ? (
              <div
                className="col middle center mediumFade"
                style={{ minHeight: "60vh" }}
              >
                <PacmanLoader color="var(--primaryColor)" />
                <p
                  className="bold mt2"
                  style={{ color: "var(--primaryColor)" }}
                >
                  Loading your scores...
                </p>
              </div>
            ) : (
              <div className="">
                <div
                  className="mt2"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(350px, 1fr))",
                  }}
                >
                  {rallyTypes?.map((type, index) => (
                    <HighscoreCard
                      key={index}
                      nodeRef={addToRefs}
                      rallyType={type}
                      maxHits={maxHits}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
            <div className="mr2"/>
          <div
            className="w25"
            style={{
              maxHeight: "90vh",
              overflow: "auto",
              minWidth: 300,
            }}
          >
            <div className="pr1 mt2">
              {rallies?.map((rally, index) => (
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
