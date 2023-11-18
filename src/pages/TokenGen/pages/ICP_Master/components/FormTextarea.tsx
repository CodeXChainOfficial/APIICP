import styled from "@emotion/styled";
import { useController } from "react-hook-form";
import { FieldError, FieldLabel, FormInputStyle } from "../styles/form";
import { InputProps } from "../types/form";

const FormTextarea = ({ name, control, rules, placeholder, label, required }: InputProps) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required, ...rules },
  });

  return (
    <Wrapper>
      <FieldLabel className={required ? "required" : ""}>{label || name}</FieldLabel>
      <Textarea {...field} placeholder={placeholder} />
      {fieldState.isTouched && fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Textarea = styled.textarea`
  ${FormInputStyle}

  min-height: 150px;
  min-width: 100%;
  max-height: 300px;
  max-width: 1116px;
  transition: width, height 0ms;
`;

export default FormTextarea;
