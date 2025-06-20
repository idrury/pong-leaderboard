import React, { useState } from "react";
import { ErrorLabelType, PopSavedModalFn } from "../../Types";
import IonIcon from "@reacticons/ionicons";
import ErrorLabel from "../ErrorLabel";
import { signInUser } from "../../DatabaseAccess/authentication";
interface LoginProps {
  popModal?: PopSavedModalFn;
  onSuccess: () => void;
}
export default function Login({ popModal }: LoginProps) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<ErrorLabelType>({
    active: false,
  });

  async function onSubmit(f: React.FormEvent) {
    f.preventDefault();

     if (!email || email.length < 3) {
      setError({
        active: true,
        selector: "email",
        text: "Please enter a valid email",
      });
      return;
    }
     if (!password || password.length < 2) {
      setError({
        active: true,
        selector: "password",
        text: "Enter a valid password",
      });
      return;
    }

    try {
      await signInUser(email, password);
      popModal?.(`Welcome back!`)
    } catch (error) {
        popModal?.(
        "Incorrect username or password!",
        undefined,
        true
      );
      setPassword(undefined);
    }


 setError({
      active: false,
    });
  }

  return (
    <div>
      <form onSubmit={(f) => onSubmit(f)}>
        <div className="">
          <label className="pb2 row">Email address</label>
          <input
            className="mb2"
            type="email"
            placeholder="johnSmith@gmail.com"
            autoComplete="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
          />
           <ErrorLabel
            text={error.text}
            active={error?.selector === "email"}
          />
            <label className="pb2 row">Password</label>
          <input
          className="mb2"
            type="password"
            placeholder="Password"
            autoComplete="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ErrorLabel
            text={error.text}
            active={error?.selector === "password"}
          />
        </div>
        <button
          className="w100 accentButton middle center"
          type="submit"
        >
          <IonIcon name="log-in-sharp" className="mr2" />
          Sign in
        </button>
      </form>
    </div>
  );
}
