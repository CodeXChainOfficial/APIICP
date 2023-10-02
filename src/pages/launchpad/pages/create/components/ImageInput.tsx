import { useState } from "react";
import styled from "@emotion/styled";
import { useController } from "react-hook-form";
import { FieldError, FieldLabel, FormInputStyle } from "../styles/form";
import { InputProps } from "../types/form";

const ImageInput = ({ name, control, rules, placeholder, label, required }: InputProps) => {
  const [preview, setPreview] = useState("");

  const { field, fieldState } = useController({
    name,
    control,
    rules: { required, ...rules },
  });

  const onChange = (e: any) => {
    const file = e.target.files[0];

    setPreview(URL.createObjectURL(file));

    field.onChange({ ...e, target: { ...e.target, value: { path: e.target.value, file } } });
  };

  return (
    <Wrapper>
      <FieldLabel className={required ? "required" : ""}>{label || name}</FieldLabel>
      <Placeholder>{placeholder}</Placeholder>
      <Input {...field} value={field.value.path} onChange={onChange} type="file" accept="image/*" />
      {fieldState.isTouched && fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
      {preview && <Img key={preview} src={preview} alt="" />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  --img-height: 96px;
  --img-width: 96px;

  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Placeholder = styled(FieldLabel)`
  color: var(--contrast-white-30);
`;

const Img = styled.img`
  position: absolute;
  z-index: -1;
  bottom: 0;
  width: var(--img-width);
  height: var(--img-height);
  border-radius: 8px;
  animation: fade-img 1s ease-in-out forwards;

  @keyframes fade-img {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Input = styled.input`
  ${FormInputStyle}

  position: relative;

  width: var(--img-width);
  height: var(--img-height);

  &::-webkit-file-upload-button {
    visibility: hidden;
  }

  background-color: var(--contrast-white-10, rgba(255, 255, 255, 0.1));
  border: 2px dashed var(--contrast-white-90, rgba(255, 255, 255, 0.9));

  &::before {
    content: "+";
    font-size: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
  }
`;

export default ImageInput;