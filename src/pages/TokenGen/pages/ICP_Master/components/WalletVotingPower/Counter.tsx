import styled from "@emotion/styled";
import Button from "@mui/material/Button";

type Props = {
  onIncrement: () => void;
  onDecrement: () => void;
  value: number;
  maxValue: number;
  minValue: number;
};

const VotingCounter = ({ value, minValue, maxValue, onIncrement, onDecrement }: Props) => {
  const disableDecrement = value <= minValue;
  const disableIncrement = value >= maxValue;

  const raiseDecrement = () => {
    if (!disableDecrement) onDecrement();
  };
  const raiseIncrement = () => {
    if (!disableIncrement) onIncrement();
  };

  return (
    <Wrapper>
      <StyledButton onClick={raiseDecrement} disabled={disableDecrement}>
        -
      </StyledButton>

      <Value>{value}</Value>

      <StyledButton onClick={raiseIncrement} disabled={disableIncrement}>
        +
      </StyledButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 200px;
  border: 1px solid var(--contrast-white-10);
  padding: 10px 14px;
  border-radius: 8px;
`;

const StyledButton = styled(Button)`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
  border-radius: 8px;
  padding: 8px 32px;
  border: 1px solid transparent;
  cursor: pointer;
  width: auto;
  margin: 0;
  background-color: var(--contrast-white-10);

  /* &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  } */

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 25.6px;
  letter-spacing: 0.8px;
  text-transform: capitalize;
  display: grid;
  place-items: center;
`;

export default VotingCounter;
