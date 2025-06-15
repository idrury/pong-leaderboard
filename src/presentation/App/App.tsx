import { useEffect, useState } from "react";
import "./App.css";
import {
  fetchProfile,
  fetchRallies,
  fetchRallyTypes,
} from "../../DatabaseAccess/select";
import HighscoreCard from "../HighScores/HighscoreCard";
import RecentScores from "../RecentScores/RecentScores";
import Header from "../Header/Header";
import {
  HighestRallyType,
  PopSavedModalFn,
  SavedModalType,
  type RallyObject,
  type RallyTypeObject,
} from "../../Types";
import { useStopwatch } from "react-timer-hook";
import SavedModal from "../SavedModal";
import IonIcon from "@reacticons/ionicons";
import {
  findHighestRallyByType,
  getHighestMins,
} from "./AppFunctions";
import { PacmanLoader } from "react-spinners";
import AnimatedContent from "../Animations/AnimatedContent";
import { supabase } from "../../DatabaseAccess/SupabaseClient";
import { Session } from "@supabase/supabase-js";

function App() {
  const [rallies, setRallies] =
    useState<RallyObject[]>();
  const [rallyTypes, setRallyTypes] =
    useState<RallyTypeObject[]>();
  const { totalSeconds } = useStopwatch({
    autoStart: true,
    interval: 10000,
  });
  const [savedModal, setSavedModal] =
    useState<SavedModalType>({
      active: false,
    });
  const [highestRallies, setHighestRallies] =
    useState<HighestRallyType[]>();
  const [maxHits, setMaxHits] = useState(0);
  const [session, setSession] =
    useState<Session | null>(null);
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    // Fetch the user's profile
    supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log(session?.user.id)
        if (_event != "SIGNED_OUT") {
          getProfile(session?.user?.id, _event);
        }
        setSession(session);
      }
    );
    fetchData();
  }, []);

  useEffect(() => {
    getAllRallies(rallyTypes);
  }, [totalSeconds]);

  /****************************
   * Set the profile object
   * @param userId
   * @param event
   */
  async function getProfile(
    userId: string | undefined,
    event: string
  ) {
    console.log(event);
    try {
      setProfile(await fetchProfile(userId));
    } catch (error) {
      console.error(
        "Error fetching profile:",
        error
      );
    }
  }

  /*******************************
   * Get rally data from the DB
   */
  async function fetchData() {
    console.log("Fetching data...");
    try {
      const rallyTypes = await fetchRallyTypes();
      setRallyTypes(rallyTypes);
      await getAllRallies(rallyTypes);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error
      );
    }
  }

  /*********************************
   * Get all rallies from the DB
   */
  async function getAllRallies(
    rallyTypes: RallyTypeObject[] | undefined
  ) {
    console.log("Fetching rallies...");
    try {
      const rallies = await fetchRallies();
      const highestRallies =
        findHighestRallyByType(
          rallies,
          rallyTypes || []
        );

      setRallies(rallies);
      setHighestRallies(highestRallies);
      setMaxHits(getHighestMins(highestRallies));
    } catch (error) {
      console.error(
        "Error occured fetching rallies:",
        error
      );
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

  function showToolTip(
    e: React.MouseEvent<HTMLHeadingElement>
  ) {
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
          onClose={() =>
            setSavedModal({ active: false })
          }
          header={savedModal.header}
          body={savedModal.body}
          state={savedModal.state}
        />
        <Header
          profile={profile}
          session={session || undefined}
          activeSavedModal={popSavedModal}
        />
        <div className="row shrinkWrap">
          <div className="w100">
            {highestRallies?.length === 0 ? (
              <div
                className="col middle center mediumFade"
                style={{ minHeight: "60vh" }}
              >
                <PacmanLoader color="var(--primaryColor)" />
                <p
                  className="bold mt2"
                  style={{
                    color: "var(--primaryColor)",
                  }}
                >
                  Loading your scores...
                </p>
              </div>
            ) : (
              <div className="pr2">
                <div className="row middle ml1 pl2 mt2 mr2 boxed">
                  <IonIcon
                    name="analytics"
                    className="h2Icon"
                    style={{
                      color: "var(--text)",
                    }}
                  />
                  <h2
                    className="mt2 pb2 m0 textLeft"
                    onClick={() =>
                      window.open(
                        "https://www.youtube.com/watch?v=U8wLBOlCKPU",
                        "_blank"
                      )
                    }
                    style={{
                      textTransform: "uppercase",
                      cursor: "help",
                      position: "relative",
                    }}
                    onMouseEnter={(e) =>
                      showToolTip(e)
                    }
                    onMouseLeave={(e) => {
                      const tooltip =
                        e.currentTarget.querySelector(
                          "div"
                        );
                      if (tooltip)
                        tooltip.remove();
                    }}
                  >
                    High scores
                  </h2>
                </div>
                <div
                  className="mt1 mr1"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(350px, 1fr))",
                  }}
                >
                  {highestRallies?.map(
                    (rally, index) => (
                      <HighscoreCard
                        key={index}
                        highestRally={rally}
                        maxHits={maxHits}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <AnimatedContent
            distance={300}
            direction="horizontal"
            reverse={false}
            duration={1.2}
            initialOpacity={0.2}
            animateOpacity
            scale={1}
            threshold={0}
            delay={0.3}
          >
            <div
              className="w25"
              style={{
                maxHeight: "90vh",
                overflow: "auto",
                minWidth: 300,
              }}
            >
              <div
                style={{
                  textTransform: "uppercase",
                }}
                className="row middle boxed mb1 mt2 pt2 pb2 mr0"
              >
                <IonIcon
                  name="list"
                  className="mr2 ml2"
                />
                <h2 className="textLeft m0">
                  Recent rallies
                </h2>
              </div>
              <div className="pr1">
                {rallies?.map((rally, index) => (
                  <RecentScores
                    key={index}
                    rally={rally}
                  />
                ))}
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </>
  );
}

export default App;
