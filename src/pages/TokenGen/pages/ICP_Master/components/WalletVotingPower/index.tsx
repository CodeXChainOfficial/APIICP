import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useWatch } from "react-hook-form";
import { FieldLabel } from "../../styles/form";
import { InputProps } from "../../types/form";
import useWatchLaunchPadType from "../../hooks/useWatchLaunchPadType";
import VotingCounter from "./Counter";
import VotingProgress from "./Progress";
import { media } from "@/shared/styles/media";

const WalletVotingPower = ({ control }: Pick<InputProps, "control">) => {

  const [votingPower, setVotingPower] = useState(1);

  const launchpadType = useWatchLaunchPadType({ control });




  const handleIncrement = () => {
    setVotingPower((prev) => ++prev);
  };

  const handleDecrement = () => {
    setVotingPower((prev) => --prev);
  };

  return (
    <Wrapper>
      <FieldLabel>Wallet Voting Power</FieldLabel>

  
        
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px 10px;
  border-radius: 8px;

  ${media.md} {
    background: var(--black);
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin: auto;
  border: 1px solid var(--contrast-white-10, rgba(255, 255, 255, 0.1));
  border-right: none;
  border-left: none;
  padding-block: 20px;
`;

export default WalletVotingPower;


