import IonIcon from "@reacticons/ionicons";
import Card from "react-bootstrap/Card";
import {
  CampaignRallyTypeObject,
  ProfileObject,
} from "../../Types";
import { DateTime } from "luxon";
import { timeToHex } from "./HsBusinessLogic";
import ShinyText from "../Animations/ShinyText";
import Counter from "../Animations/Counter";
import { getPlaces } from "../../common/CommonFunctions";
import { Ref } from "react";
interface HighscoreCardProps {
  rallyType: CampaignRallyTypeObject;
  maxHits: number;
  nodeRef?: Ref<HTMLDivElement>;
}

function HighscoreCard({
  rallyType,
  maxHits,
  nodeRef,
}: HighscoreCardProps) {
  if (!rallyType) return;
  const time: number = Math.round(
    DateTime.now()
      .diff(
        DateTime.fromJSDate(
          new Date(
            rallyType.created_at || new Date()
          )
        )
      )
      .as("minutes") + 1
  );

  return (
    <div
      ref={nodeRef}
      className="col center m1 outline"
      style={{
        background: timeToHex(
          time,
          maxHits,
          true
        ),
        maxWidth: "100vw",
        borderRadius: 25
      }}
    >
      <div>
        <div className="w100 col middle p2">
          <div
            className="row middle center bold mt2 mb2"
            style={{
              textTransform: "capitalize",
            }}
          >
            <IonIcon
              name="bowling-ball"
              className="mr1"
            />
            <p className="">
              {rallyType.name || "Other"}
            </p>
          </div>
          {time < 10 &&
            rallyType.num_hits > 0 && (
              <div
                className="boxed m0"
                style={{
                  background:
                    "var(--secondaryColor)",
                }}
              >
                <ShinyText text="New Record" />
              </div>
            )}
          <div className="pt2 mb2">
            <Counter
              value={rallyType.num_hits}
              places={getPlaces(
                rallyType.num_hits
              )}
              fontSize={80}
              padding={5}
              gap={10}
              textColor="white"
              fontWeight={900}
            />
          </div>
          <div className="row middle center mt2 mb2">
            <IonIcon
              name="person-circle"
              className="mr1"
            />
            <div
              className="m0"
              style={{ fontSize: "10pt" }}
            >
              {rallyType.profiles ? (
                <div className="row">
                  <p className="pr1">
                    {DateTime.now()
                      .minus({ minutes: time })
                      .toRelative({
                        style: "long",
                      })}{" "}
                    by
                  </p>
                  <div
                    style={{
                      textTransform: "capitalize",
                    }}
                    className="bold"
                  >
                    <div className="row">
                      {(
                        rallyType.profiles as ProfileObject[]
                      )?.map((p, i) => (
                        <p key={i} className="pr1 wrap">
                          {p.name || p.anon_name}{" "}
                          {i ==
                            rallyType.profiles
                              .length -
                              1 || " |"}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                "not claimed yet!"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HighscoreCard;
