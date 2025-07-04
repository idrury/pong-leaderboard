import React from "react";
import "./EventId.css";

import { PopSavedModalFn } from "../../Types";

import Header from "../Header/Header";
import EnterCode from "../Event/EnterCode";

interface EventIdProps {
  popModal: PopSavedModalFn;
  onSubmit?: (eventId: string) => void;
}

const EventId: React.FC<EventIdProps> = ({ popModal }) => {
  return (
    <div>
      <Header activeSavedModal={popModal} />
      <div
        className="col w100 middle center"
      >
        <div className="w33">
          <EnterCode popModal={popModal} />
        </div>
      </div>
    </div>
  );
};

export default EventId;
