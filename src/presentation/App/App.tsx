import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { fetchProfile } from "../../DatabaseAccess/select";

import {
  PopSavedModalFn,
  SavedModalType,
} from "../../Types";

import SavedModal from "../SavedModal";

import { supabase } from "../../DatabaseAccess/SupabaseClient";
import { Session } from "@supabase/supabase-js";

import { PlayerHome } from "../Home/PlayerHome";
import EventId from "../Home/EventId";
import Event from "../Event/Event";
import Aurora from "../Animations/Aurora";
import Noise from "../Animations/Noise";
import OrganisationDetails from "../Event/OrganisationDetails";

function App() {
  const [session, setSession] =
    useState<Session | null>(null);
  const [profile, setProfile] = useState<any>();
  const [savedModal, setSavedModal] =
    useState<SavedModalType>({
      active: false,
    });

  useEffect(() => {
    supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (
          _event == "SIGNED_IN" ||
          _event == "TOKEN_REFRESHED"
        ) {
          getProfile(session?.user?.id, _event);
        }
        setSession(session);
      }
    );
  }, []);

  /****************************
   * Set the profile object
   * @param userId
   * @param event
   */
  async function getProfile(
    userId: string | undefined,
    event: string
  ) {
    console.info(event);
    try {
      setProfile(await fetchProfile(userId));
    } catch (error) {
      console.error(
        "Error fetching profile:",
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
          onClose={() =>
            setSavedModal({ active: false })
          }
          header={savedModal.header}
          body={savedModal.body}
          state={savedModal.state}
        />

        <Routes>
          <Route
            path="/"
            element={
              session ? (
                <PlayerHome
                  popModal={popSavedModal}
                  session={session}
                  profile={profile}
                />
              ) : (
                <EventId
                  popModal={popSavedModal}
                />
              )
            }
          />
          <Route
            path="/events/:eventId"
            element={
              <Event
                session={session || undefined}
                profile={profile}
                popSavedModal={popSavedModal}
              />
            }
          />
          <Route path="/organisation">
          <Route index element={<OrganisationDetails profile={profile} popModal={popSavedModal}/>}/>
          </Route>
        </Routes>
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -5,
        }}
      >
        <div style={{ zIndex: -1 }}></div>

        <Aurora
          colorStops={[
            "#050c0f",
            "#124450",
            "#146679",
          ]}
          blend={0.9}
          amplitude={2}
          speed={1}
        />
        <Noise
          patternSize={250}
          patternScaleX={1}
          patternScaleY={1}
          patternRefreshInterval={2}
          patternAlpha={15}
        />
      </div>
    </>
  );
}

export default App;
