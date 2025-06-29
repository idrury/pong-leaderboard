import { useEffect, useState } from "react";
import {
  EventObject,
  PopSavedModalFn,
  ProfileObject,
  UserAdminOrgsObject,
} from "../../Types";

interface PlayerBestScoresProps {
  profile: ProfileObject | undefined;
  popModal: PopSavedModalFn;
}

export default function PlayerBestScores ({
  profile,
}: PlayerBestScoresProps) {

  return (
    <div className="w100">
      <div className="p2 boxed outline m1">
        <div className="row center middle">
          <h2 className="m0">Your Best Scores</h2>
        </div>
        <div>
          <h4 className="mb2">
            Score 1
          </h4>
        </div>
      </div>
    </div>
  );
}
