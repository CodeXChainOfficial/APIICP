import { useState } from "react";
import styled from "@emotion/styled";
import { useController } from "react-hook-form";
import { FieldError, FieldLabel, FormInputStyle } from "../styles/form";
import { InputProps } from "../types/form";
import { media } from "@/shared/styles/media";

type Selected = 0 | 1 | -1;

const RadioInput = ({ placeholder, label, radio, required, ...rest }: InputProps) => {
  const [selected, setSelected] = useState<Selected>(-1);

  const { field, fieldState } = useController({ ...rest, rules: { required, ...rest.rules } });

  if (!radio || !radio.length) return <></>;

  const handleSelected = (index: Selected) => {
    let value = radio[index as number].value;

    if (index === selected && !required) {
      index = -1;
      value = typeof value === "boolean" ? false : "";
    }

    setSelected(index);
    field.onChange({ target: { value } });
  };

  return (
    <Wrapper>
      <FieldLabel className={required ? "required" : ""}>{label || rest.name}</FieldLabel>

      <Group>
        {radio.map((item, idx) => (
          <Item key={item.value + ""} type="button" onClick={() => handleSelected(idx as Selected)}>
            {item.label || item.value}

            <Icon color={idx === selected ? "var(--blue)" : "white"} />
          </Item>
        ))}

        <Input {...field} value="" />
      </Group>

      {fieldState.isTouched && fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Group = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.button`
  ${FormInputStyle}
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Input = styled.input`
  ${FormInputStyle}

  opacity: 0;
  visibility: hidden;
  position: absolute;
  z-index: -1;
`;

const Icon = ({ color = "white" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.0016" cy="10.0001" r="6.4" fill={color} />
    <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="2" />
  </svg>
);

export default RadioInput;
