import { useState } from "react";
import AddRallyMenu from "./AddRallyMenu";
import { PopSavedModalFn } from "../../Types";

interface HeaderProps{
  activeSavedModal: PopSavedModalFn;
}

export default function Header ({activeSavedModal}:HeaderProps) {  
    const [editActive, setEditActive] = useState(false);

  return (
    <div>
      <AddRallyMenu active={editActive} onClose={() => setEditActive(false)} activateSaved={activeSavedModal}/>
      <div className="boxed between w100 pt1 pb1">
        <div></div>
        <p
          onClick={() => window.open('https://www.youtube.com/watch?v=xvFZjo5PgG0', '_blank')}
          style={{ fontWeight: 500, fontSize: 'large', cursor: 'pointer' }}
        >
          Ping-Pong-A-Thon
        </p>
        <div style={{ display: 'flex', alignItems: 'center', }}>
          <button className="accentButton" onClick={() => setEditActive(true)}>
            + Add rally
          </button>
        </div>
      </div>
    </div >
  );
}
