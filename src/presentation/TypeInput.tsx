// @ts-nocheck
import Select, {
  InputActionMeta,
} from "react-select";
import Creatable from "react-select/creatable";

const colorStyles = {
  control: (
    baseStyles,
    { isDisabled, isFocused, isSelected }
  ) => ({
    ...baseStyles,
    boxShadow: "none",
    border: "none",
    fontSize: 13,
    borderRadius: 25,
    height: 50,
    textIndent: "10px",
    color: "var(--text)",
    backgroundColor: isFocused
      ? "var(--background)"
      : "var(--text)"
      ? "var(--lightBackground)"
      : isFocused
      ? "var(--mediumAccent)"
      : "var(--lightBackground)",
  }),
  placeholder: (  baseStyles,
    { isDisabled, isFocused, isSelected }) => ({
    gridArea: '1 / 1 / 1 / 1',
    display: 'flex',
    color: 'var(--mediumAccent)',
    padding: '0 5px'
  }),

  singleValue: (baseStyles) => ({
    ...baseStyles,
    borderWidth: 0,
    fontSize: 13,
    padding: "0px 0",
    margin: 0,
    borderRadius: 25,
    lineHeight: 2,
    textIndent: "15px",
    color: "var(--text)",
    display: "flex",
    justifyContent: "start",
  }),

  valueContainer: (baseStyles) => ({
    ...baseStyles,
    borderWidth: 0,
    padding: 0,
    fontSize: 13,
    borderRadius: 25,
    color: "var(--text)",
  }),

  input: (baseStyles) => ({
    ...baseStyles,
    color: "var(--text)",
  }),

  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "var(--background)",
    margin: 10,
    fontSize: 13,
  }),

  option: (
    baseStyles,
    { isDisabled, isFocused, isSelected }
  ) => ({
    ...baseStyles,
    borderRadius: 25,
    fontSize: 13,
        padding: '15px 10px',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',

    color: isDisabled
      ? undefined
      : isSelected
      ? "var(--background)"
      : isFocused
      ? "var(--background)"
      : undefined,
    backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? "var(--primaryColor)"
      : isFocused
      ? "var(--mediumAccent)"
      : undefined,
  }),
};

export default function TypeInput({
  options,
  defaultValue,
  onChange,
  disabled = false,
  placeholder = "select...",
  width = 150,
}: SelectableInputType) {
  if (disabled) {
    return (
      <div>
        <input
          disabled
          value={defaultValue}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div style={{ minWidth: width }}>
      <Select
        options={options}
        onChange={(v) =>
          onChange((v as any).value)
        }
        isDisabled={disabled}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        placeholder={placeholder}
        defaultInputValue={defaultValue || ""}
        styles={colorStyles}
      />
    </div>
  );
}

interface CreatableTypeInputProps {
  options: any[];
  value;
  defaultValue?: string;
  onChange: (val: any) => void;
  onInputChange: (
    val: string,
    meta: InputActionMeta
  ) => void;
  disabled?: boolean;
  placeholder: string;
  onCreate: (val: any) => void;
  width?: number;
}

export function CreatableTypeInput({
  options,
  value,
  defaultValue,
  onChange,
  onInputChange,
  disabled = false,
  placeholder = "select...",
  onCreate,
  width = 150,
}: CreatableTypeInputProps) {
  if (disabled) {
    return (
      <div>
        <input
          disabled
          value={defaultValue}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div style={{ minWidth: width }}>
      <Creatable
        options={options}
        inputValue={value}
        value={value}
        onChange={(val) => onChange(val)}
        onInputChange={(val, meta) =>
          onInputChange(val, meta)
        }
        onCreateOption={(val) => onCreate(val)}
        isDisabled={disabled}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        placeholder={placeholder}
        defaultInputValue={defaultValue || ""}
        styles={colorStyles}
      />
    </div>
  );
}
