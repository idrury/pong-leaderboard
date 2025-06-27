import {
  CampaignRallyTypeObject,
  OrganisationSummaryObject,
  PopSavedModalFn,
  ProfileObject,
} from "../../Types";
import { isMobileBrowser } from "../../common/CommonFunctions";
import { Session } from "@supabase/supabase-js";
import Auth from "../Authentication/Auth";
import { useEffect, useState } from "react";
import IonIcon from "@reacticons/ionicons";

interface HeaderProps {
  rallyTypesState?: CampaignRallyTypeObject[];
  activeSavedModal: PopSavedModalFn;
  activateEditModal?: () => void;
  session?: Session | undefined;
  profile?: ProfileObject | undefined;
  gameCode?: string;
  organisation?: OrganisationSummaryObject;
}

export default function Header ({
  session,
  activeSavedModal,
  activateEditModal,
  profile,
  gameCode,
}: HeaderProps) {
  const [mobileBrowser, setMobileBrowser] =
    useState(false);

  useEffect(() => {
    setMobileBrowser(isMobileBrowser());
  }, []);

  return (
    <div>
      <div
        className="m0 w100 pt1 pb1"
        style={{ position: "relative" }}
      >
        {/* Right side: My Organisation and Auth */}
        <div
          className="row right"
          style={{ minWidth: 0, justifyContent: "flex-end", marginTop: "15px" }}
        >
          <div>
            <button
              className="accentButton mr2 p0 pt2 pb2 pl2 pr2 outline"
            >
              <div className="row middle center">
                <IonIcon name="people" className="h2Icon" />
                My Organisation
              </div>
            </button>
          </div>
          <div className="ml1">
            <Auth
              profile={profile}
              session={session}
              popModal={activeSavedModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
