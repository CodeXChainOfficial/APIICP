import styled from "@emotion/styled";
import { FieldLabel, FormInputStyle } from "../styles/form";
import { useWatch } from "react-hook-form";
import { InputProps } from "../types/form";

const SelectedChains = ({ control }: Pick<InputProps, "control">) => {


  return (
    <Wrapper>
      <FieldLabel>Deploy on:</FieldLabel>
      
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ValueLabel = styled.div`
  ${FormInputStyle}

  span {
    display: inline-block;
    text-transform: capitalize;
  }
`;

export default SelectedChains;
