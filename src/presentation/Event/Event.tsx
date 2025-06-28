import { PacmanLoader } from "react-spinners";
import {
  CampaignRallyTypeObject,
  OrganisationSummaryObject,
  PopSavedModalFn,
  ProfileObject,
  RallyObject,
} from "../../Types";
import HighscoreCard from "../HighScores/HighscoreCard";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  fetchOrganisationFromEvent,
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
import EditRallyMenu from "./EditRallyMenu";
import Banner from "../Banner";
import IonIcon from "@reacticons/ionicons";
import { supabase } from "../../DatabaseAccess/SupabaseClient";

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
  const [addMenuActive, setAddMenuActive] = useState(false);
  const [editMenuActive, setEditMenuActive] = useState(false);
  const [selectedRally, setSelectedRally] = useState<RallyObject>();
  const [org, setOrg] = useState<OrganisationSummaryObject>();
  const [isAdmin, setIsAdmin] = useState(false);
  const eventId = useParams().eventId;

  useEffect(() => {
    getOrganisation();
  }, [profile]);

  useGSAP(() => {
    gsap.from(highScoreRefs.current, {
      opacity: 0,
      rotate: 20,
      zoom: 0.1,
      duration: 0.5,
      stagger: 0.2,
    });
  }, [rallyTypes?.length]);

  /********************************
   * Runs on inital page load and gets rally +
   * organisation information
   */
  async function getOrganisation() {
    if (!eventId) return;
    try {
      const organisation = await fetchOrganisationFromEvent(eventId);
      getData(organisation);
      setOrg(organisation);
      setIsAdmin(organisation.admin_ids.includes(profile?.id));
      await joinChannel(organisation);
    } catch (error) {
      console.error(error);
      popSavedModal(
        "Error fetching event!",
        "Refresh the page and try again!",
        true
      );
    }
  }

  /*******************************
   * Get rally data from the DB
   */
  async function getData(
    organisation?: OrganisationSummaryObject | undefined
  ) {
    console.info("Fetching data...");
    const localOrg = organisation || org;

    if (!localOrg) {
      console.error("no org found");
      return;
    }

    try {
      const rallies = groupRalliesById(
        await fetchRallies(localOrg.event_id)
      );
      setRallies(rallies);

      const fetchedRallyTypes = await fetchRallyTypes(
        localOrg.event_id
      );
      setRallyTypes(fetchedRallyTypes);
      setMaxHits(getHighestMins(fetchedRallyTypes || []));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  /**********************************************************
   * Join the supabase realtime channel and listen for changes
   * @param org The organisation 
   */
  async function joinChannel(org: OrganisationSummaryObject) {
    // Get the schema changes channel
    const channel = await supabase.channel("schema-db-changes");

    // Return if channel doesn't exists
    if (!channel) {
      console.error("channel doesn't exist");
      return;
    }

    // Return if channel has already been joined
    if (channel.state == "joined" || channel.state == "joining") {
      console.warn(
        "Joining channel skipped because the channel has been joined already"
      );
      return;
    }

    // Subscribe to the channel
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rallys",
          filter: `event_id=eq.${eventId}`,
        },
        async (data) => {
          console.log(data);
          await getData(org);
        }
      )
      .subscribe();
  }

  /*********************************************
   * Use refs to reference each highscore
   * card (For animation purposes)
   * @param element The element to add to the ref
   */
  const addToRefs = (element: any) => {
    if (element && !highScoreRefs.current.includes(element)) {
      highScoreRefs.current.push(element);
    }
  };

  /******************************************
   * Show edit menu when a rally is clicked on
   * @param rally The rally object
   */
  function onRallyClick(rally: RallyObject) {
    setSelectedRally(rally);
    setEditMenuActive(true);
  }

  if (!eventId || !org) return <div>none</div>;
  return (
    <div>
      {org?.blocked_user_ids?.find((b) => b == profile?.id) && (
        <Banner background="var(--dangerColor)">
          <IonIcon name="ban-sharp" className="pr2" />
          You've been banned from adding rallies from this event
        </Banner>
      )}
      <Header
        gameCode={eventId}
        profile={profile}
        session={session || undefined}
        activeSavedModal={popSavedModal}
        activateEditModal={() => setAddMenuActive(true)}
        organisation={org}
      />
      <AddRallyMenu
        profile={profile}
        organisation={org}
        active={addMenuActive}
        currentRallyTypes={rallyTypes}
        onClose={() => setAddMenuActive(false)}
        activateSaved={popSavedModal}
        eventId={eventId}
      />
      <EditRallyMenu
        active={editMenuActive}
        onClose={() => setEditMenuActive(false)}
        rally={selectedRally}
        isAdmin={isAdmin}
        popModal={popSavedModal}
        organisation={org}
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
              <RecentScores
                key={index}
                rally={rally}
                onRallyClick={(rally) => onRallyClick(rally)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
