import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import { useController } from "react-hook-form";
import { InputProps } from "../types/form";
import { FormInputStyle } from "../styles/form";
import { media } from "@/shared/styles/media";
import useWatchLaunchPadType from "../hooks/useWatchLaunchPadType";

const WalletList = ({ control }: Pick<InputProps, "control">) => {
  const [count, setCount] = useState(1);

  const launchpadType = useWatchLaunchPadType({ control });
}


const Wrapper = styled.div`
  display: grid;
  gap: 20px;
`;

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  ${media.sm} {
    grid-template-columns: 1fr;
  }

  & div.button-group {
    display: flex;
    gap: 20px;
  }
`;

const Input = styled.input`
  ${FormInputStyle}
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

const RemoveButton = styled(StyledButton)`
  background-color: var(--red);

  &:hover {
    background-color: var(--red);
  }
`;

export default WalletList;
