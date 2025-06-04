import { ActivatableElement } from "../../Types";
import BasicMenu from "../BasicMenu";

interface PasswordMenuProps extends ActivatableElement {
    onSuccess: () => void;
}

export default function PasswordMenu({ active, onClose, onSuccess }:PasswordMenuProps) {
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
            <button onClick={() => onSuccess()}>Submit</button>
        </div>
    </BasicMenu>
  );
}
