type PlayerIconsProps = {
  playerName: string;
};
export default function PlayerIcons({
  playerName,
}: PlayerIconsProps) {
  playerName = playerName.toLowerCase();

  const isStarPlayer =
    playerName === "james mann" ||
    playerName === "isaac drury" ||
    playerName === "isaac drury";
  const isJesusChrist =
    playerName === "jesus" ||
    playerName === "jesus christ" ||
    playerName === "jesus";
  const isPingPong =
    playerName === "ping pong" ||
    playerName === "ping" ||
    playerName === "pong" ||
    playerName === "pingpongathon";
  const isNate = playerName === "nate" || playerName === "nat";
  const isJerry = playerName === "jerry" || playerName === "";
  const isDaniel =
    playerName === "daniel" || playerName === "daniel ambrose";
  const isIsaacMann = playerName === "isaac mann";
  const isIsaacHegedus = playerName === "isaac hegedus";

  
  return (
    <div>
      {/* Star icon for special players */}
      {isStarPlayer && <div>⭐</div>}
      {isJesusChrist && <div>👑</div>}
      {isPingPong && (
        <div
          style={{
            fontSize: "18px",
          }}
        >
          🏓
        </div>
      )}
      {isNate && <div>🏓</div>}
      {isJerry && <div>🏓</div>}
      {isDaniel && <div>🏓</div>}
      {isIsaacMann && (
        <div
          onClick={() =>
            window.open(
              "https://www.youtube.com/watch?v=wo_D2TYJj6E",
              "_blank"
            )
          }
        
        >
          🥪
        </div>
      )}
      {isIsaacHegedus && (
        <div
          onClick={() =>
            window.open(
              "https://www.youtube.com/watch?v=HcOnFbKjSyo",
              "_blank"
            )
          }
        
        >
          <img
            src="/white-history.png"
            alt="white history"
            style={{
              width: "18px",
              height: "18px",
            }}
          />
        </div>
      )}
    </div>
  );
}
