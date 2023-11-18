import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import useWatchLaunchPadType from "../hooks/useWatchLaunchPadType";
import { InputProps } from "../types/form";
import { media } from "@/shared/styles/media";

const CreateDAO = ({ control }: Pick<InputProps, "control">) => {
  const launchpadType = useWatchLaunchPadType({ control });


  return (
    <Wrapper>
      <StyledButton>Create DAO</StyledButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px 1fr;
  /* max-height: 30px; */

  ${media.sm} {
    grid-template-columns: 1fr;
  }
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

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    background-color: var(--blue);
  }
`;

export default CreateDAO;
