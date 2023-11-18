import styled from "@emotion/styled";
import { useEffect } from "react";
import gsap from "gsap";

type Props = {
  value: number;
  max: number;
};

const VotingProgress = ({ value, max }: Props) => {
  const classes = {
    progress: "progress-container",
    value: "progress-value",
  };

  const percent = convertValueToPercentage(value);

  useEffect(() => {
    animateToNewValue(percent);
  }, [percent]);

  function convertValueToPercentage(value: number) {
    // Example: let value == 3, max = 5; 3 * (100 / 5) = 60 (that is, 60%).
    const percent = max > 0 ? value * Math.ceil(100 / max) : 100;
    return percent > 100 ? 100 : percent < 0 ? 0 : percent; // clip percent between 0 and 100.
  }

  const animateToNewValue = (value: number) => {
    const progValue = "." + classes.value;

    const xPercent = (100 - value) * -1;
    gsap.to(progValue, { xPercent, transformOrigin: "left center", ease: "power1.out" });
  };

  return (
    <Wrapper>
      <span>{percent}%</span>

      <div>
        <Progress className={classes.value} />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: min(400px, 100%);
  height: 8px;
  display: grid;
  place-items: center;

  span {
    position: absolute;
    top: -30px;
  }

  & > div {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #d9d9d9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    border-radius: 8px;
  }
`;

const Progress = styled.div`
  position: absolute;
  left: 0;
  background-color: var(--blue);
  border-radius: inherit;
  height: inherit;
  width: 100%;
`;

export default VotingProgress;
