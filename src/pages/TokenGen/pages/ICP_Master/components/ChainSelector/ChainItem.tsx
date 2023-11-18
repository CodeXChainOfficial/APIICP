import styled from "@emotion/styled";
import Button from "@mui/material/Button";

type Props = {
  blockchain: string;
  isSelected?: boolean;
  net?: "mainnet" | "testnet";
  onSelect: () => void;
};

const ChainItem = ({ blockchain, isSelected, net, onSelect }: Props) => {
  return (
    <Item className={isSelected ? "selected" : ""} onClick={onSelect}>
      <ImgDiv>
        <img src={`/blockchains/${blockchain.toLowerCase()}.png`} alt="" />
      </ImgDiv>
      <span>{`${blockchain} ${net}`}</span>
    </Item>
  );
};

const Item = styled(Button)`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  color: var(--white);
  background-color: var(--black2);

  &.selected {
    background-color: var(--blue);
  }

  &:hover {
    background-color: var(--black2);
  }

  span {
    text-transform: capitalize;
  }
`;

const ImgDiv = styled.div`
  background-color: var(--black);
  width: 40px;
  height: 40px;
  border-radius: 50%;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

export default ChainItem;
