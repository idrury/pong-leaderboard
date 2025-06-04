import { DateTime } from "luxon";
import type { RallyObject } from "../../Types";
import PlayerIcons from "./PlayerIcons";

interface RecentScoresProps {
  rally: RallyObject;
}

function RecentScores({ rally }: RecentScoresProps) {
  // console.log('RecentScores rally prop:', rally);

  const playerName = rally.people?.name || "";

  return (
    <div
      className="w100 pl"
      style={{
        width: "95%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px",
        backgroundColor: "#2d3748",
        color: "white",
        borderRadius: "3px",
        border: "1px solid #4a5568",
      }}
    >
      <PlayerIcons playerName={playerName} />
      {/* Left side content */}
      <div>
        <p
          className="pt1 pb1 m0"
          style={{
            fontWeight: "bold",
            textAlign: "start",
          }}
        >
          {rally.rally_type || "Subheading"}
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

      {/* Right side number */}
      <p>
        {DateTime.fromJSDate(new Date(rally.created_at)).toRelative()}
      </p>
      <div className="boxedAccent w10">
        <h3 className="m0 p0 textCenter">{rally.num_hits}</h3>
      </div>
    </div>
  );
}

export default RecentScores;
