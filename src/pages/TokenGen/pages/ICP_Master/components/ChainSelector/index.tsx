import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import { useController } from "react-hook-form";
import { media } from "@/shared/styles/media";
import ChainModal from "./ChainModal";
import { InputProps } from "../../types/form";
import { FieldError } from "../../styles/form";
import { Blockchain } from "../../types";

const ChainSelector = ({ name, control, required }: InputProps) => {
  const { field, fieldState } = useController({ name, control, rules: { required } });

  const [open, setOpen] = useState(false);

  const value = field.value ?? { name: "", net: "" };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSelect = (blockchain: Blockchain) => {
    field.onChange({ target: { value: blockchain } });
    handleClose();
  };

  return (
    <Wrapper>
      <Input {...field} value={value.name} onChange={(e) => {}} />

      <ButtonContainer>
        <StyledButton onClick={handleOpen}>Select Chain</StyledButton>
      </ButtonContainer>

      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}

      <ChainModal
        mainnetChains={mainnet}
        testnetChains={testnet}
        selectedChain={value}
        onSelect={handleSelect}
        open={open}
        onClose={handleClose}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  margin-block: 10px;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px 1fr;
  /* max-height: 30px; */

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  position: absolute;
  z-index: -1;
  top: 0;
  opacity: 0;
`;

const StyledButton = styled(Button)`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
  border-radius: 8px;
  background-color: var(--blue);
  padding: 8px 32px;
  border: 1px solid transparent;
  cursor: pointer;

  &:hover {
    background-color: var(--blue);
  }
`;

export default ChainSelector;

const mainnet = [

  "ICP",

];

const testnet = [

  "ICP",

  // "arbritrum nova",
];
