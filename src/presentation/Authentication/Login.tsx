import { PopSavedModalFn } from "../../Types";
    interface LoginProps {
      popModal?: PopSavedModalFn;
    }
export default function Login({popModal}: LoginProps) {


  return (
    <div>
      <div>
        <div className="pr3">
          <input
            className="mb2"
            type="email"
            placeholder="Email"
          />
          <input
            type="password"
            placeholder="Password"
          />
        </div>
      </div>
    </div>
  );
}
