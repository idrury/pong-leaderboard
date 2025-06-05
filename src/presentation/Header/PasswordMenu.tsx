import { useState } from "react";
import {
  ActivatableElement,
  ErrorLabelType,
  PasswordType,
} from "../../Types";
import BasicMenu from "../BasicMenu";
import { checkPin } from "../../DatabaseAccess/rpc";
import ErrorLabel from "../ErrorLabel";

interface PasswordMenuProps extends ActivatableElement {
  type: PasswordType;
  onSuccess: (type: PasswordType) => void;
}

export default function PasswordMenu({
  active,
  type,
  onClose,
  onSuccess,
}: PasswordMenuProps) {
  const [pin, setPin] = useState<string>();
  const [validation, setValidation] = useState<ErrorLabelType>({
    active: false,
  });

  async function handleCheckPin() {
    let result = false;
    if (!pin) return;

    try {
      result = await checkPin(1, pin);
    } catch (error) {
      console.error("Error checking pin:", error);
    }

    if (result == true) {
      onSuccess(type);
      setValidation({ active: false });
    } else
      setValidation({
        active: true,
        selector: "pin",
        text: "Incorrect pin",
      });

    setPin("");
    return;
  }

  return (
    <BasicMenu
      disableClickOff
      active={active}
      onClose={onClose}
      width={300}
      icon={{
        name: "lock-closed",
        size: 30,
        color: "var(--primaryColor)",
      }}
    >
      <div>
        <h2>Enter admin password to continue</h2>
        <form
          action="submit"
          onSubmit={(e) => {
            e.preventDefault();
            handleCheckPin();
          }}
        >
          <div className="pr2 mr2">
            <input
            autoFocus
              placeholder="Password"
              autoComplete="new-password"
              type="password"
              value={pin || ""}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          {validation.active && (
            <div className="mt1">
              <ErrorLabel
                active={validation.selector == "pin"}
                text={validation?.text || ""}
                color="var(--dangerColor)"
              />
            </div>
          )}
          <button className="w100 mt2" type="submit">
            Submit
          </button>
        </form>
      </div>
    </BasicMenu>
  );
}
