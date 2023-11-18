import styled from "@emotion/styled";
import { media } from "@/shared/styles/media";
import Modal from "@/shared/components/Modal";
import ChainItem from "./ChainItem";
import { Blockchain } from "../../types";

type Props = {
  mainnetChains: string[];
  testnetChains: string[];
  selectedChain: Blockchain;
  open: boolean;
  onClose: () => void;
  onSelect: (blockchain: Blockchain) => void;
};

const ChainModal = ({ mainnetChains, testnetChains, selectedChain, onSelect, open, onClose }: Props) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <Wrapper>
        <Title>Select Blockchain</Title>

        <GroupContainer>
          <Group>
            {mainnetChains.map((item) => (
              <ChainItem
                key={item}
                blockchain={item}
                isSelected={item === selectedChain.name && selectedChain.net === "mainnet"}
                net="mainnet"
                onSelect={() => onSelect({ name: item, net: "mainnet" })}
              />
            ))}
          </Group>

          <Title2>Testnet</Title2>

          <Group>
            {testnetChains.map((item) => (
              <ChainItem
                key={item}
                blockchain={item}
                isSelected={item === selectedChain.name && selectedChain.net === "testnet"}
                net="testnet"
                onSelect={() => onSelect({ name: item, net: "testnet" })}
              />
            ))}
          </Group>
        </GroupContainer>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled.div`
  overflow: hidden;
  background-color: var(--black);
  border: 2px solid var(--black);
  box-shadow: 24;
  padding: 20px;
  padding-inline-end: 0;
  height: 100%;
  max-height: 98vh;
`;

const Title = styled.h3`
  color: var(--blue);
  font-size: 32px;
  font-weight: 600;
  line-height: 44.8px;
  letter-spacing: 1.6px;
  text-transform: capitalize;
  margin-block-end: 20px;
`;

const GroupContainer = styled.div`
  overflow-y: auto;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-inline-end: 20px;
  scrollbar-gutter: stable;
`;

const Group = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const Title2 = styled.h4`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin-block-start: 20px;
`;

export default ChainModal;
