import "./PlayerHome.css";
import {
  PopSavedModalFn,
  ProfileObject,
} from "../../Types";

import HeaderOrganisation from "../../presentation/Header/HeaderOrganisation";
import { Session } from "@supabase/supabase-js";

import EnterCode from "../../presentation/Event/EnterCode";
import PlayerLatestScores from "../../presentation/PlayerHome/PlayerLatestScores";
import PlayerBestScores from "../../presentation/PlayerHome/PlayerBestScores";
import GlobalScores from "../../presentation/PlayerHome/GlobalScores";
import { useEffect, useState } from "react";
import Header from "../Header/Header";

interface PlayerHomeProps {
  popModal: PopSavedModalFn;
  profile: ProfileObject;
  session: Session;
}

export function PlayerHome({
  popModal,
  profile,
  session,
}: PlayerHomeProps) {
  const [profileObj, setProfileObj] =
    useState<ProfileObject>();

  useEffect(() => {
    setProfileObj(profile);
  });
  return (
    <div>
      <Header
        profile={profileObj}
        session={session || undefined}
        activeSavedModal={popModal}
      />
      <div className="col w100 middle between" style={{height: '90vh'}}>
        <div style={{minHeight: '1vh'}}/>
        <div className="col middle w33">
          <EnterCode popModal={popModal} />
        </div>
        <div
          className="row w100 mt2"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(350px, 1fr))",
          }}
        >
          <PlayerBestScores
            profile={profileObj}
            popModal={popModal}
          />
          <PlayerLatestScores
            profile={profileObj}
            popModal={popModal}
          />
          <GlobalScores
            profile={profileObj}
            popModal={popModal}
          />
        </div>
      </div>
    </div>
  );
}
