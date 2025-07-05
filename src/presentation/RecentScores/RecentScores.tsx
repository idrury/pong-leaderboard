import { DateTime } from "luxon";
import type {
  ProfileObject,
  RallyObject,
} from "../../Types";
import PlayerIcons from "./PlayerIcons";

interface RecentScoresProps {
  rally: RallyObject;
  onRallyClick: (rally: RallyObject) => void;
}

function RecentScores({
  rally,
  onRallyClick,
}: RecentScoresProps) {
  const playerNames = extractPlayerNames();

  function extractPlayerNames() {
    let returnString = "";
    (rally.profiles as ProfileObject[]).forEach(
      (p, idx) => {
        returnString = returnString.concat(
          p.name
        );

        if (
          idx <
          (rally.profiles as ProfileObject[])
            .length -
            1
        )
          returnString =
            returnString.concat(" | ");
      }
    );

    return returnString;
  }

  return (
    <div
      onClick={() => onRallyClick(rally)}
      className="middle row outline between w100 mb1 clickable p0 boxed"
      style={{
      }}
    >
      <div className="row middle w50 ">
        <div style={{ width: 30 }}>
          <PlayerIcons
            playerName={playerNames || ""}
          />
        </div>
        <div>
          <h3
            className="pt1 pb1 m0"
            style={{
              fontWeight: "bold",
              textAlign: "start",
            }}
          >
            {rally.rally_types?.name || "no type"}
          </h3>
          <div
            className=""
            style={{
              textAlign: "start",
              textTransform: "capitalize",
            }}
          >
            <p className="pb1  m0">
              {playerNames || "Cras justo odio"}
            </p>
          </div>
        </div>
      </div>

      <div className="w25">
        <p
          style={{ color: "var(--mediumAccent)" }}
          className="pt1 pb1 m0"
        >
          {DateTime.fromJSDate(
            new Date(rally.created_at)
          ).toRelative({ style: "short" })}
        </p>
      </div>
      <div
        className={`${
          rally.is_high_score
            ? "boxedSecondary"
            : "boxed"
        } m0 p2 row middle center w10 h100`}
      >
        <h3
          className="m0 p0 textCenter middle"
          style={{
            fontWeight: 600,
            height: "30px",
            color: `${
              rally.is_high_score
                ? "var(--background)"
                : "var(--text)"
            }`,
          }}
        >
          {rally.num_hits}
        </h3>
      </div>
    </div>
  );
}

export default RecentScores;
