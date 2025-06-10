import { DateTime } from "luxon";
import type { RallyObject } from "../../Types";
import PlayerIcons from "./PlayerIcons";

interface RecentScoresProps {
  rally: RallyObject;
}

function RecentScores({ rally }: RecentScoresProps) {
  const playerName = rally.people?.name || "";

  return (
    <div
      className="boxed middle row between w100 mb1"
    >
      <div className="row middle w50">
        <div style={{ width: 30 }}>
          <PlayerIcons playerName={playerName} />
        </div>
        <div>
          <p
            className="pt1 pb1 m0"
            style={{
              fontWeight: "bold",
              textAlign: "start",
            }}
          >
            {rally.rally_types?.name || "no type"}
          </p>
          <div
            className=""
            style={{
              textAlign: "start",
              textTransform: "capitalize",
            }}
          >
            <p className="pb1  m0">
              {rally.people?.name || "Cras justo odio"}
            </p>
          </div>
        </div>
      </div>

      <div className="w25">
        <p
          style={{ color: "var(--mediumAccent)" }}
          className="pt1 pb1 m0"
        >
          {DateTime.fromJSDate(new Date(rally.created_at)).toRelative({style:'short'})}
        </p>
      </div>
      <div className="boxedAccent w10">
        <h3 className="m0 p0 textCenter">{rally.num_hits}</h3>
      </div>
    </div>
  );
}

export default RecentScores;
