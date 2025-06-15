import BasicMenu from "../BasicMenu";
import {
  PopSavedModalFn,
} from "../../Types";
import { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import { Session } from "@supabase/supabase-js";
import IonIcon from "@reacticons/ionicons";
import { supabase } from "../../DatabaseAccess/SupabaseClient";

interface AuthProps {
  session: Session | undefined;
  popModal?: PopSavedModalFn;
  profile: any | undefined;
}

export default function Auth({
  popModal,
  session,
  profile
}: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [active, setActive] = useState(false);

  async function handleSignOut() {
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
            <IonIcon
              name="person-circle"
              className="h2Icon"
            />
            {profile?.name ||
              "Signed in"}
          </div>
        </button>
      ) : (
        <button
          onClick={() => setActive(true)}
          className="accentButton mr2 p0 pt2 pb2 pl2 pr2 outline"
        >
          <div className="row middle center">
            <IonIcon
              name="person-circle"
              className="h2Icon"
            />
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
            <button
              onClick={() => handleSignOut()}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div>
            <div className="row middle center mb2">
              Sign in
              <input
                style={{ height: 20, width: 20 }}
                className="ml2 mr2"
                type="checkbox"
                defaultChecked={isSignUp}
                onChange={(e) =>
                  setIsSignUp(e.target.checked)
                }
              />
              Sign up
            </div>
            {isSignUp ? (
              <SignUp popModal={popModal} />
            ) : (
              <Login popModal={popModal} />
            )}
          </div>
        )}
      </BasicMenu>
    </div>
  );
}
