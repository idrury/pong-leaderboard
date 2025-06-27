import "./PlayerHome.css";
import { PopSavedModalFn, ProfileObject } from "../../Types";

import HeaderOrganisation from "../../presentation/Header/HeaderOrganisation";
import { Session } from "@supabase/supabase-js";

import EnterCode from "../../presentation/Event/EnterCode";
import PlayerLatestScores from "../../presentation/PlayerHome/PlayerLatestScores";
import PlayerBestScores from "../../presentation/PlayerHome/PlayerBestScores";
import GlobalScores from "../../presentation/PlayerHome/GlobalScores";
import { useEffect, useState } from "react";

interface PlayerHomeProps {
  popModal: PopSavedModalFn;
  profile: ProfileObject;
  session: Session;
}

export function PlayerHome ({
  popModal,
  profile,
  session,
}: PlayerHomeProps) {
  const [profileObj, setProfileObj] = useState<ProfileObject>();

  useEffect(() => {
    setProfileObj(profile);
  });
  return (
    <div>
      <HeaderOrganisation
        profile={profileObj}
        session={session || undefined}
        activeSavedModal={popModal}
      />
      <div className="row w100" style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div className="col" style={{ flex: 1, marginRight: '20px' }}>
          <PlayerBestScores profile={profileObj} popModal={popModal} />
          <PlayerLatestScores profile={profileObj} popModal={popModal} />
        </div>
        <div className="col middle" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '50px', margin: '0 20px' }}>
          <EnterCode popModal={popModal} />
        </div>
        <div className="col" style={{ flex: 1, marginLeft: '20px' }}>
          <GlobalScores profile={profileObj} popModal={popModal} />
        </div>
      </div>
    </div>
  );
}
