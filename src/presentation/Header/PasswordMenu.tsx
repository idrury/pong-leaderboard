import { ActivatableElement, PasswordType } from "../../Types";
import BasicMenu from "../BasicMenu";

interface PasswordMenuProps extends ActivatableElement {
    type: PasswordType;
    onSuccess: (type: PasswordType) => void;
}

export default function PasswordMenu({ active, type, onClose, onSuccess }:PasswordMenuProps) {

  return (
    <BasicMenu
      active={active}
      onClose={onClose}
      width="100%"
      icon={{
        name: "lock-closed",
        size: 30,
        color: "var(--primaryColor)",
      }}
    >
        <div>
            <h2>Enter admin password</h2>
            <button onClick={() => onSuccess(type)}>Submit</button>
        </div>
    </BasicMenu>
  );
}
