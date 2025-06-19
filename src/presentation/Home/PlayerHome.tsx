import "./PlayerHome.css";
import { PopSavedModalFn, ProfileObject } from "../../Types";

import Header from "../../presentation/Header/Header";
import { Session } from "@supabase/supabase-js";

import EnterCode from "../../presentation/Event/EnterCode";
import OrganisationDetails from "../../presentation/Event/OrganisationDetails";
import { useEffect, useState } from "react";

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
  const [profileObj, setProfileObj] = useState<ProfileObject>();

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
      <div className="col w100 middle">
        <EnterCode popModal={popModal} />
        <div style={{ height: 50 }} />
        <OrganisationDetails profile={profileObj} popModal={popModal} />
      </div>
    </div>
  );
}
