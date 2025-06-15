import IonIcon from "@reacticons/ionicons";

interface ErrorLabelProps {
  active: boolean;
  text?: string;
  color?: string;
}

export default function ErrorLabel({
  active,
  text = "Please enter a valid value",
  color = "var(--dangerColor)",
}: ErrorLabelProps) {
  if (active)
    return (
      <div className="mb2">
        <div className="leftRow middle">
          <IonIcon
            name="alert-circle"
            className="basicIcon mr2"
            style={{ color: color }}
          />
          <label
            className="mediumFade m0"
            style={{ color: color }}
          >
            {text}
          </label>
        </div>
      </div>
    );
}
