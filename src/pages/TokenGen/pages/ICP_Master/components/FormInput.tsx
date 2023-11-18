import styled from "@emotion/styled";
import { useController } from "react-hook-form";
import { FieldError, FieldLabel, FormInputStyle } from "../styles/form";
import { InputProps } from "../types/form";

const FormInput = ({ name, control, rules, placeholder, label, required }: InputProps) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required, ...rules },
  });

  return (
    <Wrapper>
      <FieldLabel className={required ? "required" : ""}>{label || name}</FieldLabel>
      <Input {...field} placeholder={placeholder} />
      {fieldState.isTouched && fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  ${FormInputStyle}
`;

export default FormInput;
