import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const FormInputStyle = css`
  color: var(--contrastWhite);
  font-size: 16px;
  font-weight: 600;
  line-height: 25.6px;
  letter-spacing: 0.8px;
  padding: 10px;

  border-radius: 8px;
  border: 1px solid var(--contrast-white-10, rgba(255, 255, 255, 0.1));
  background: var(--black2);

  transition: 0.4s ease-in-out;

  &:focus {
    outline: 1px solid grey;
  }

  &::placeholder {
    color: var(--contrast-white-30);
    &::first-letter {
      text-transform: capitalize;
    }
  }
`;

export const FieldLabel = styled.span`
  color: var(--contrastWhite);
  font-size: 16px;
  font-weight: 600;
  line-height: 25.6px;
  letter-spacing: 0.8px;
  &::first-letter {
    text-transform: capitalize;
  }

  &.required {
    &::after {
      content: "*";
    }
  }
`;

export const FieldError = styled(FieldLabel)`
  color: var(--red);
  font-size: 12px;
  margin-block-start: -8px;
`;
