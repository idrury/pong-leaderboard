import "./PlayerHome.css";

import { ListGroup } from "react-bootstrap";

import { PopSavedModalFn, ProfileObject } from "../../Types";

import Header from "../../presentation/Header/Header";
import { Session } from "@supabase/supabase-js";

import EnterCode from "../../presentation/Event/EnterCode";

interface PlayerHomeProps {
  popModal: PopSavedModalFn;
  profile: ProfileObject;
  session: Session;
}

const campaigns = [
  { name: "Campaign 2", year: "2023" },
  { name: "Campaign 2", year: "2022" },
  { name: "Campaign 3", year: "2021" },
];

export function PlayerHome({
  popModal,
  profile,
  session,
}: PlayerHomeProps) {
  return (
    <div>
      <Header
        profile={profile}
        session={session || undefined}
        activeSavedModal={popModal}
      />
      <div className="col w100 middle">
        <EnterCode popModal={popModal} />
        <div className="CampaignList">
          <ListGroup className="CampaignTable">
            <ListGroup.Item className="CampaignRow CampaignHeaderRow">
              <span className="CampaignCol CampaignColName">
                Campaigns
              </span>
              <span className="CampaignCol CampaignColYear">
                Year
              </span>
            </ListGroup.Item>
            {campaigns.map((item, idx) => (
              <ListGroup.Item className="CampaignRow" key={idx}>
                <span className="CampaignCol CampaignColName">
                  {item.name}
                </span>
                <span className="CampaignCol CampaignColYear">
                  {item.year}
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}
