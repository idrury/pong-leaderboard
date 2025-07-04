import { useEffect, useState } from "react";
import {
  EventObject,
  PopSavedModalFn,
  ProfileObject,
  UserAdminOrgsObject,
} from "../../Types";

interface GlobalScoresProps {
  profile: ProfileObject | undefined;
  popModal: PopSavedModalFn;
}

export default function GlobalScores ({
  profile,
}: GlobalScoresProps) {

  return (
    <div className="w100">
      <div className="p2 boxed m1">
        <div className="row center middle">
          <h3 className="m0">Global Scores</h3>
        </div>
        <div>
          <h2 className="mb2">
            Score 1
          </h2>
        </div>
      </div>
    </div>
  );
}
