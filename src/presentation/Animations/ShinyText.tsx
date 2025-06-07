import IonIcon from "@reacticons/ionicons";
import "./animation.css";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`shiny-text boxed row ${
        disabled ? "disabled" : ""
      } ${className}`}
      style={{ animationDuration }}
    >
      <IonIcon
        name="trophy"
        className="mr1"
        style={{ color: "var(--background)" }}
      />
      <p className="bold" style={{ color: "var(--background)" }}>
        {text}
      </p>
    </div>
  );
};

export default ShinyText;
