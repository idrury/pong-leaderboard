import BasicMenu from "../BasicMenu";
import { PopSavedModalFn, ProfileObject } from "../../Types";
import { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import { Session } from "@supabase/supabase-js";
import IonIcon from "@reacticons/ionicons";
import { supabase } from "../../DatabaseAccess/SupabaseClient";

interface AuthProps {
  session: Session | undefined;
  popModal?: PopSavedModalFn;
  profile: ProfileObject | undefined;
}

export default function Auth ({
  popModal,
  session,
  profile,
}: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [active, setActive] = useState(false);

  async function handleSignOut () {
    if (session) {
      await supabase.auth.signOut();
    }
  }

  return (
    <div>
      {session ? (
        <button
          onClick={() => setActive(true)}
          className="accentButton mr2 p0 pt2 pb2 pl2 pr2 outline"
        >
          <div className="row middle center">
            <IonIcon name="person-circle" className="h2Icon" style={{marginTop: -2}}/>
            {profile?.name || "Signed in"}
          </div>
        </button>
      ) : (
        <button
          onClick={() => setActive(true)}
          className="accentButton mr2 p0 pt2 pb2 pl2 pr2 outline"
        >
          <div className="row middle center">
            <IonIcon name="person-circle" className="h2Icon" />
            Sign in
          </div>
        </button>
      )}
      <BasicMenu
        disableClickOff
        active={active}
        onClose={() => setActive(false)}
        width={300}
      >
        {session ? (
          <div>
            <div className="mb2">Signed in as</div>
            <h2>{profile?.name}</h2>
            <button
              className="w100 row center middle accentButton"
              onClick={() => handleSignOut()}
            >
              <IonIcon name="log-out" className="mr1" /> Sign out
            </button>
          </div>
        ) : (
          <div className="w100">
            <div className="row middle center mb2 w100">
              <button
                className={`w50 ${!isSignUp && "accentButton"}`}
                onClick={() => setIsSignUp(false)}
              >
                Sign in
              </button>
              <div style={{ width: 10, height: 10 }} />
              <button
                className={`w50 ${isSignUp && "accentButton"}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign up
              </button>
            </div>
            {isSignUp ? (
              <SignUp
                popModal={popModal}
                onSuccess={() => setActive(false)}
              />
            ) : (
              <Login
                popModal={popModal}
                onSuccess={() => setActive(false)}
              />
            )}
          </div>
        )}
      </BasicMenu>
    </div>
  );
}
