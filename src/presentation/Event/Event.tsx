import { PacmanLoader } from "react-spinners";
import {
  CampaignRallyTypeObject,
  PopSavedModalFn,
  ProfileObject,
  RallyObject,
} from "../../Types";
import HighscoreCard from "../HighScores/HighscoreCard";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useStopwatch } from "react-timer-hook";
import {
  fetchRallies,
  fetchRallyTypes,
} from "../../DatabaseAccess/select";
import { getHighestMins } from "../App/AppFunctions";
import RecentScores from "../RecentScores/RecentScores";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import { Session } from "@supabase/supabase-js";
import AddRallyMenu from "../Header/AddRallyMenu";
import { groupRalliesById } from "../../common/CommonFunctions";

interface EventProps {
  profile: ProfileObject;
  session: Session | undefined;
  popSavedModal: PopSavedModalFn;
}

export default function Event({
  profile,
  session,
  popSavedModal,
}: EventProps) {
  const [maxHits, setMaxHits] = useState(0);
  const highScoreRefs = useRef<HTMLDivElement[]>([]);
  const [rallies, setRallies] = useState<RallyObject[]>();
  const [rallyTypes, setRallyTypes] =
    useState<CampaignRallyTypeObject[]>();
  const { totalSeconds } = useStopwatch({
    autoStart: true,
    interval: 10000,
  });
  const [editActive, setEditActive] = useState(false);
  const eventId = useParams().eventId;

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

  /*******************************
   * Get rally data from the DB
   */
  async function fetchData() {
    console.log("Fetching data...");
    if (!eventId) return;
    try {
      const rallies = groupRalliesById(await fetchRallies(eventId));
      setRallies(rallies);

      const fetchedRallyTypes = await fetchRallyTypes(eventId);
      setRallyTypes(fetchedRallyTypes);
      setMaxHits(getHighestMins(fetchedRallyTypes || []));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const addToRefs = (element: any) => {
    if (element && !highScoreRefs.current.includes(element)) {
      highScoreRefs.current.push(element);
    }
  };

  if (!eventId) return <div>none</div>;
  return (
    <div>
      <Header
      gameCode={eventId}
        profile={profile}
        session={session || undefined}
        activeSavedModal={popSavedModal}
        activateEditModal={() => setEditActive(true)}
      />
      <AddRallyMenu
        profile={profile}
        active={editActive}
        currentRallyTypes={rallyTypes}
        onClose={() => setEditActive(false)}
        activateSaved={popSavedModal}
        eventId={eventId}
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
                style={{
                  color: "var(--primaryColor)",
                }}
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
        <div className="mr2" />
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
  );
}
