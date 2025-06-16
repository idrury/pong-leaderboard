import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { fetchProfile } from "../../DatabaseAccess/select";

import Header from "../Header/Header";
import { PopSavedModalFn, SavedModalType } from "../../Types";

import SavedModal from "../SavedModal";

import { supabase } from "../../DatabaseAccess/SupabaseClient";
import { Session } from "@supabase/supabase-js";

import {
  PublicRoute,
  ProtectedRoute,
} from "../Authentication/AuthRouter";
import { PlayerHome } from "../../pages/player-home/PlayerHome";
import Event from "../Event/Event";
import Aurora from "../Animations/Aurora";
import Noise from "../Animations/Noise";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>();
  const [savedModal, setSavedModal] = useState<SavedModalType>({
    active: false,
  });

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (_event == "SIGNED_IN" || _event == "TOKEN_REFRESHED") {
        getProfile(session?.user?.id, _event);
      }
      setSession(session);
    });
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
    console.log(event);
    try {
      setProfile(await fetchProfile(userId));
    } catch (error) {
      console.error("Error fetching profile:", error);
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
        <Routes>
          {/* Public routes - accessible when not signed in */}
          {/* <Route element={<PublicRoute session={session} />}> */}
          <Route path="/:eventId" element={<Event profile={profile} session={session} popSavedModal={popSavedModal} />} />
          {/* <Route path="*" element={<Navigate to="/event-id"  />} /> */}
          {/* </Route> */}

          {/* Protected routes - require authentication */}
          {/* <Route element={<ProtectedRoute session={session} />}> */}
          <Route
            path="/"
            element={<PlayerHome popModal={popSavedModal} />}
          />

          {/* </Route> */}

          {/* Fallback route - redirect to appropriate page based on auth status */}
          {/* <Route
            path="*"
            element={<Navigate to="/"  />}
          /> */}
        </Routes>
      </div>
      {/* <Aurora
        colorStops={["#050c0f", "#124450", "#146679"]}
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
      /> */}
    </>
  );
}

export default App;
