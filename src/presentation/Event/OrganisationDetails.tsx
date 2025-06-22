import { useEffect, useState } from "react";
import {
  EventObject,
  PopSavedModalFn,
  ProfileObject,
  UserAdminOrgsObject,
} from "../../Types";
import {
  fetchEvents,
  fetchUsersOrganisations,
} from "../../DatabaseAccess/select";
import IonIcon from "@reacticons/ionicons";
import { useNavigate } from "react-router-dom";
import EditEventMenu from "./EditEventMenu";

interface OrganisationDetailsProps {
  profile: ProfileObject | undefined;
  popModal: PopSavedModalFn;
}

export default function OrganisationDetails({
  profile,
  popModal,
}: OrganisationDetailsProps) {
  const [organisations, setOrganisations] =
    useState<UserAdminOrgsObject[]>();
  const [events, setEvents] = useState<EventObject[]>();
  const [createActive, setCreateActive] = useState(false);
  const [eventsActive, setEventsActive] = useState(false);
  const [editEventActive, setEditEventActive] = useState<string>();

  const navigate = useNavigate();

  useEffect(() => {
    getOrganisationData();
  }, [profile]);

  async function getOrganisationData() {
    if (!profile) return;

    try {
      const orgs = await fetchUsersOrganisations(profile.id);
      setOrganisations(orgs);
      orgs?.length > 0 &&
        setEvents(await fetchEvents(orgs[0].id));
    } catch (error) {
      console.log(error);
    }
  }

  function onEventClick(event: EventObject) {
    navigate(`events/${event.id}`);
  }

  return (
    <div className="w50 pt2 pb2">
      <EditEventMenu
        active={editEventActive != undefined}
        onClose={() => setEditEventActive(undefined)}
        event={events?.find((e) => e.id == editEventActive)}
        org={organisations && organisations[0]}
        popModal={popModal}
      />

      <div className="m2 p2 boxed outline">
        <div className="row center middle">
          <IonIcon
            onClick={() => setEventsActive(!eventsActive)}
            name={eventsActive ? "caret-down" : "caret-forward"}
            className="buttonIcon h2Icon mr1"
          />
          <h2 className="m0">Your organisation</h2>
        </div>
        <div>
          {organisations && organisations[0] ? (
            <div className="w100">
              <div className="p2">
                <h4 className="row">{organisations[0].name}</h4>
                {events?.map((evt) => (
                  <div
                    onClick={() => setEditEventActive(evt.id)}
                    key={evt.id}
                    className="row between middle boxedDark w100 p0 clickable"
                  >
                    <div className="row middle between w100 pr2 pl2">
                      <div className="row middle center">
                        <IonIcon
                          name="bowling-ball"
                          className="pr1"
                        />
                        <h3>{evt.name}</h3>
                      </div>
                      <div
                        className="row middle center clickable p2"
                        onClick={() => onEventClick(evt)}
                      >
                        <IonIcon name="code" className="pr1" />
                        <p>{evt.id}</p>
                      </div>
                      <div className="row middle center">
                        <IonIcon
                          name={
                            evt.is_locked
                              ? "lock-closed"
                              : "lock-open"
                          }
                          className="pr1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div>
                  <button
                    onClick={() => setCreateActive(!createActive)}
                    className="accentButton w100 mt2 row middle center"
                  >
                    <IonIcon
                      name="add-circle"
                      className="mr1 pIcon"
                    />
                    Create new event
                  </button>
                </div>
                {createActive && (
                  <div className="mt2">
                    <p>COMING SOON!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="mb2">
                You're not part of any organisations
              </h4>
              <button className="w50 boxedAccent mt2">
                Create one
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
