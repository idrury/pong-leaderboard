import { useState } from "react";
import ErrorLabel from "../ErrorLabel";
import {
  ErrorLabelType,
  PopSavedModalFn,
} from "../../Types";
import { SignUpUser } from "../../DatabaseAccess/authentication";

interface SignUpProps {
  popModal?: PopSavedModalFn;
}

export default function SignUp({
  popModal,
}: SignUpProps) {
  const [password, setPassword] =
    useState<string>();
  const [confirmPassword, setConfirmPassword] =
    useState<string>();
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();

  const [error, setError] =
    useState<ErrorLabelType>({
      active: false,
    });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || name.length < 3) {
      setError({
        active: true,
        selector: "name",
        text: "Please enter a valid name",
      });
      return;
    }

    if (!email || email.length < 3) {
      setError({
        active: true,
        selector: "email",
        text: "Please enter a valid email",
      });
      return;
    }

    if (!password || password.length < 8) {
      setError({
        active: true,
        selector: "password",
        text: "Password must be at least 8 characters",
      });
      return;
    }

    if (password !== confirmPassword) {
      setError({
        active: true,
        selector: "confirmPassword",
        text: "Passwords do not match",
      });
      return;
    }

    try {
      await SignUpUser(email, password, name);
      popModal?.("Sign up successful!");
    } catch (error) {
      popModal?.(
        "An error occurred signing you up!",
        "Please try again later.",
        true
      );
    }

    setError({
      active: false,
    });
  }

  return (
    <div>
      <form onSubmit={(f) => onSubmit(f)}>
        <div className="pr3">
          <input
            className="mb2"
            type="name"
            placeholder="Name"
            value={name || ""}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
          <ErrorLabel
            text={error.text}
            active={error?.selector === "name"}
          />

          <input
            className="mb2"
            type="email"
            placeholder="Email"
            value={email || ""}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
          <ErrorLabel
            text={error.text}
            active={error?.selector === "email"}
          />
          <input
            className="mb2"
            type="password"
            placeholder="Password"
            value={password || ""}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
          <ErrorLabel
            text={error.text}
            active={
              error?.selector === "password"
            }
          />
          <input
            className="mb2"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword || ""}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />
          <ErrorLabel
            text={error.text}
            active={
              error?.selector ===
              "confirmPassword"
            }
          />
        </div>
        <button
          className="w100 accentButton"
          type="submit"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
