import { useState } from "react";
import AddRallyMenu from "./AddRallyMenu";

export default function Header ({ }) {  
    const [editActive, setEditActive] = useState(false);

  return (
    <div>
      <AddRallyMenu active={editActive} onClose={() => setEditActive(false)}/>
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
