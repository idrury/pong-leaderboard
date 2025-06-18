import { useEffect, useState } from "react";
import ErrorLabel from "../ErrorLabel";
import { ErrorLabelType, PopSavedModalFn } from "../../Types";
import { SignUpUser } from "../../DatabaseAccess/authentication";
import IonIcon from "@reacticons/ionicons";
import { fetchProfileByName } from "../../DatabaseAccess/select";

interface SignUpProps {
  popModal?: PopSavedModalFn;
  onSuccess: () => void;
}

export default function SignUp({ popModal }: SignUpProps) {
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();
  const [nameIsUnique, setNameIsUnique] = useState(false);

  const [error, setError] = useState<ErrorLabelType>({
    active: false,
  });

  useEffect(() => {
    // Set a new timeout to execute the action after 1 second
    const timer = setTimeout(() => {
      checkNameIsUnique();
    }, 1000);

    // Cleanup function to clear the timeout if the component unmounts or the value changes
    return () => clearTimeout(timer);
  }, [name]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || name.length < 3 || nameIsUnique == false) {
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

  async function checkNameIsUnique() {
    if (!name || name.length <= 2) return;

    try {
      await fetchProfileByName(name);
      setError({
        selector: "name",
        active: true,
        text: "That username already exists :(",
      });
      setNameIsUnique(false);
    } catch (error) {
      setError({
        selector: "name",
        active: true,
        text: "That one's good!",
        safe: true,
      });
      setNameIsUnique(true);
    }
  }

  return (
    <div>
      <form onSubmit={(f) => onSubmit(f)}>
        <div className="">
          <label className="pb2 row">
            User name (must be unique)
          </label>
          <input
            className="mb2"
            autoComplete="username"
            type="name"
            placeholder="Tryvern123"
            value={name || ""}
            onChange={(e) => {setName(e.target.value); setNameIsUnique(false)}}
          />
          <ErrorLabel
            text={error.text}
            active={error?.selector === "name"}
            color={
              error?.safe == true ? "var(--safeColor)" : undefined
            }
            icon={
              error?.safe == true ? "checkmark-circle" : undefined
            }
          />
          <label className="pb2 row">Email address</label>
          <input
            autoComplete="email"
            className="mb2"
            type="email"
            placeholder="Email"
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
            autoComplete="new-password"
            type="password"
            placeholder="Password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ErrorLabel
            text={error.text}
            active={error?.selector === "password"}
          />
          <label className="pb2 row">Confirm password</label>
          <input
            className="mb2"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm Password"
            value={confirmPassword || ""}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <ErrorLabel
            text={error.text}
            active={error?.selector === "confirmPassword"}
          />
        </div>
        <button
          className="w100 accentButton row middle center"
          type="submit"
        >
          <IonIcon name="log-in-sharp" className="mr2" />
          Sign up
        </button>
      </form>
    </div>
  );
}
