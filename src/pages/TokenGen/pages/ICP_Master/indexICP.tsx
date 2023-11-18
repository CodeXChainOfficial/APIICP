import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./components/FormInput";
import FormTextarea from "./components/FormTextarea";
import ImageInput from "./components/ImageInput";
import RadioInput from "./components/RadioInput";
import ChainSelector from "./components/ChainSelector";
import { Button } from "@mui/material";
import SelectedChains from "./components/SelectedChains";
import WalletList from "./components/WalletList";
import WalletVotingPower from "./components/WalletVotingPower";
import CreateDAO from "./components/CreateDAO";
import { useNavigate } from "react-router-dom";
import React, { Key, useEffect, useState } from "react";
import { Container, Grid } from '@mui/material';
import ERC20Item from './card';
import { Element } from 'react-scroll';

  
  






const handleSectionChange = (selectedSection: string) => {
};
export default function CreateTokenICP() {



  const [principal, setPrincipal] = useState<string | null>(null);
  const [agent, setAgent] = useState<object | null>(null);
  const [actor, setActor] = useState<object | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const principalParam = url.searchParams.get("principal");
    const agentParam = url.searchParams.get("agent");
    const actorParam = url.searchParams.get("actor");

    if (principalParam) {
      setPrincipal(principalParam);
    }

    if (agentParam) {
      setAgent(JSON.parse(agentParam));
    }

    if (actorParam) {
      setActor(JSON.parse(actorParam));
    }
  }, []);

  const ICP20Contracts = [
    {
      name: 'ICP20 Standard',
      description: 'A standard ICP20 token with basic functionality like transfer, balanceOf, and approve.',
    },
    {
      name: 'ICP20 Advance',
      description: 'Burnable ERC-20, Pausable ERC-20 & Mintable ERC-20.',
    },
    {
      name: 'ICP20 Liquidity',
      description: 'An ICP20 token designed for providing liquidity in decentralized exchanges.',
    },
    {
      name: 'ICP20 Governance',
      description: 'Token holders have voting rights proportional to the number of tokens they hold.',
    },
    {
      name: 'ICP20 Vesting',
      description: 'This can be used for team tokens, advisors, or any situation where you want to incentivize long-term holding.',
    },
    {
      name: 'ICP20 Airdrop',
      description: 'An ICP20 token used for distributing tokens via airdrops.',
    },
    {
      name: 'ICP20 Wrapped',
      description: 'Tokens that represent assets on another blockchain.',
    },
    {
      name: 'ICP20 Rebate',
      description: 'Tokens that provide rebates, discounts, or rewards for using a particular service.',
    },
  ];  

  const NFTContracts = [
    {
      name: 'DIP721 Standard',
      description: 'The DIP721Base smart contract implements the DIP721 NFT standard.',
    
    },
    {
      name: 'DIP721 Collection',
      description: 'Burnable ERC-20, Pausable ERC-20 & Mintable ERC-20.',
    },
    {
      name: 'DIP721 Delayed Reveal',
      description: 'An ICP20 token designed for providing liquidity in decentralized exchanges.',
    },
    {
      name: 'DIP721 Drop',
      description: '',
    },
    {
      name: 'DIP721 Lezy Mint',
      description: '',
    },
    {
      name: 'DIP721 Signature Mint',
      description: 'An ICP20 token used for distributing tokens via airdrops.',
    },
    {
      name: 'DIP721 Wrapped',
      description: 'Tokens that represent assets on another blockchain.',
    },
    {
      name: 'DIP721 Rebate',
      description: 'Tokens that provide rebates, discounts, or rewards for using a particular service.',
    },
  ];
  const MarketplaceContracts = [
    {
      name: 'NFT Marketplace',
      description: 'Define Sale, Trade, Royality and fees',
    
    },
    {
      name: 'NFT Collection Deploy',
      description: 'Connect and deploy collections',
    },
    {
      name: 'NFT Mint',
      description: 'Mint nft on the marketplace',
    },
    
  ];

  const DAOContracts = [
    {
    name: 'DAO infrastructure',
    description: 'Define Governance, Token, Voting power',
  
  },
  {
    name: 'NFT Voting Power',
    description: 'Deploy and connect the NFT for Governance and Voting power',
  },
  {
    name: 'Token Voting power',
    description: 'Deploy and connect the Token for Governance and Voting power',
  },
  ];

  const ICP20List = () => {
    const ICP20Contracts = [
      {
        name: 'ICP20 Standard',
        description: 'A standard ICP20 token with basic functionality like transfer, balanceOf, and approve.',
      },
      {
        name: 'ICP20 Advance',
        description: 'Burnable ERC-20: An ERC-20 token with the additional ability to burn (destroy) tokens. This is useful for reducing the total supply Pausable ERC-20: An ERC-20 token that can be paused, preventing any transfers or token operations during a specific period. This can be useful in emergencies or to implement compliance, Mintable ERC-20: In contrast to burnable, this type allows new tokens to be created or "minted" as needed. It can be controlled by the contract owner to add new tokens to the supply.',
      },
      {
        name: 'ICP20 Liquidity',
        description: 'An ICP20 token designed for providing liquidity in decentralized exchanges.',
      },
      {
        name: 'ICP20 Governance',
        description: 'These tokens are used for governance in decentralized autonomous organizations (DAOs) or other voting-based systems. Token holders have voting rights proportional to the number of tokens they hold.',
      },
      {
        name: 'ICP20 Vesting',
        description: 'Tokens that are released to holders over a period of time. This can be used for team tokens, advisors, or any situation where you want to incentivize long-term holding.',
      },
      {
        name: 'ICP20 Airdrop',
        description: 'An ICP20 token used for distributing tokens via airdrops.',
      },
      {
        name: 'ICP20 Wrapped',
        description: 'Tokens that represent assets on another blockchain. For example, wrapped Bitcoin (WBTC) is an ERC-20 token that represents Bitcoin on the Ethereum blockchain.',
      },
      {
        name: 'ICP20 Rebate',
        description: 'Tokens that provide rebates, discounts, or rewards for using a particular service.',
      },
    ];
  }
  const NFTlist = () => {
    const NFTContracts = [
      {
        name: 'DIP721 Standard',
        description: 'The DIP721Base smart contract implements the DIP721 NFT standard, along with the DIP721A optimization to the standard. It allows you to mint NFTs to yourself (or to someone else) and selling those NFTs on a marketplace.',
      },
      {
        name: 'DIP721 Collection',
        description: 'Burnable DIP-20: An DIP-20 token with the additional ability to burn (destroy) tokens. This is useful for reducing the total supply Pausable DIP-20: An DIP-20 token that can be paused, preventing any transfers or token operations during a specific period. This can be useful in emergencies or to implement compliance, Mintable DIP-20: In contrast to burnable, this type allows new tokens to be created or "minted" as needed. It can be controlled by the contract owner to add new tokens to the supply.',
      },
      {
        name: 'DIP721 Delayed Reveal',
        description: 'An ICP20 token designed for providing liquidity in decentralized exchanges.',
      },
      {
        name: 'DIP721 Drop',
        description: 'These tokens are used for governance in decentralized autonomous organizations (DAOs) or other voting-based systems. Token holders have voting rights proportional to the number of tokens they hold.',
      },
      {
        name: 'DIP721 Lezy Mint',
        description: 'Tokens that are released to holders over a period of time. This can be used for team tokens, advisors, or any situation where you want to incentivize long-term holding.',
      },
      {
        name: 'DIP721 Signature Mint',
        description: 'An ICP20 token used for distributing tokens via airdrops.',
      },
      {
        name: 'DIP721 Wrapped',
        description: 'Tokens that represent assets on another blockchain. For example, wrapped Bitcoin (WBTC) is an DIP-20 token that represents Bitcoin on the Ethereum blockchain.',
      },
      {
        name: 'DIP721 Rebate',
        description: 'Tokens that provide rebates, discounts, or rewards for using a particular service.',
      },
    ];
  }

  const Marketplacelist = () => {
    const MarketplaceContracts = [
      {
      name: 'NFT Marketplace',
      description: 'Define Sale, Trade, Royality and fees',
    
    },
    {
      name: 'NFT Collection Deploy',
      description: 'Connect and deploy collections',
    },
    {
      name: 'NFT Mint',
      description: 'Mint nft on the marketplace',
    },
  ];
}


const DAOlist = () => {
  const DAOContracts = [
    {
    name: 'DAO infrastructure',
    description: 'Define Governance, Token, Voting power',
  
  },
  {
    name: 'NFT Voting Power',
    description: 'Deploy and connect the NFT for Governance and Voting power',
  },
  {
    name: 'Token Voting power',
    description: 'Deploy and connect the Token for Governance and Voting power',
  },
];
}
  
  const navigate = useNavigate();
  
  const [section, setSection] = useState('all'); // 'all' is the default section



  return (

    <>

<div>
  <h1>ICP Data</h1>
  <div>
    <strong>Principal:</strong> {principal}
  </div>

</div>

<Title1>Smart Contract Selection</Title1>

<NavMenu>
        <NavMenuItem onClick={() => handleSectionChange('all')}>All</NavMenuItem>
        <NavMenuItem onClick={() => handleSectionChange('token')}>Token</NavMenuItem>
        <NavMenuItem onClick={() => handleSectionChange('nft')}>NFT</NavMenuItem>
        <NavMenuItem onClick={() => handleSectionChange('dao')}>DAO</NavMenuItem>
        <NavMenuItem onClick={() => handleSectionChange('marketplace')}>Marketplace</NavMenuItem>
      </NavMenu>
    
    <>


    {section === 'all' && (
        <Element name="allContainer" className="element">
        
    

        <Element name="icpContainer" className="element">

        <Container>
          <Title>Token Generator</Title>
          <Subtitle>Test</Subtitle>
          <Grid container spacing={3}>
            {ICP20Contracts.map((contract: { name: any; description: any; }, index: Key | null | undefined) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ERC20Item name={contract.name} description={contract.description} />
              </Grid>
            ))}
          </Grid>
        </Container>
        </Element>

        <Element name="nftContainer" className="element">

        <Container>
          <Title>NFT Generator</Title>
          <Subtitle>Test</Subtitle>
          <Grid container spacing={3}>
            {NFTContracts.map((contract: { name: any; description: any; }, index: Key | null | undefined) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ERC20Item name={contract.name} description={contract.description} />
              </Grid>
            ))}
          </Grid>
        </Container>
        </Element>

        <Element name="marketplaceContainer" className="element">

        <Container>
          <Title>Marketplace Generator</Title>
          <Subtitle>Test</Subtitle>
          <Grid container spacing={3}>
            {MarketplaceContracts.map((contract: { name: any; description: any; }, index: Key | null | undefined) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ERC20Item name={contract.name} description={contract.description} />
              </Grid>
            ))}
          </Grid>
        </Container>
        </Element>

        <Element name="daoContainer" className="element">

        <Container>
          <Title>DAO Generators</Title>
          <Subtitle>Test</Subtitle>
          <Grid container spacing={3}>
            {DAOContracts.map((contract: { name: any; description: any; }, index: Key | null | undefined) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ERC20Item name={contract.name} description={contract.description} />
              </Grid>
            ))}
          </Grid>
        </Container>
        </Element>
        </Element>
      )}

 
    
      
        {section === 'token' && (
        <Element name="icpContainer" className="element">
            <Element name="icpContainer" className="element">

<Container>
  <Title>Token Generator</Title>
  <Subtitle>Test</Subtitle>
  <Grid container spacing={3}>
    {ICP20Contracts.map((contract: { name: any; description: any; }, index: Key | null | undefined) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <ERC20Item name={contract.name} description={contract.description} />
      </Grid>
    ))}
  </Grid>
</Container>
</Element>
        </Element>
      )}
      {section === 'nft' && (
        <Element name="nftContainer" className="element">
              <Element name="nftContainer" className="element">

<Container>
  <Title>NFT Generator</Title>
  <Subtitle>Test</Subtitle>
  <Grid container spacing={3}>
    {NFTContracts.map((contract: { name: any; description: any; }, index: Key | null | undefined) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <ERC20Item name={contract.name} description={contract.description} />
      </Grid>
    ))}
  </Grid>
</Container>
</Element>
        </Element>
      )}
      {section === 'dao' && (
        <Element name="daoContainer" className="element">
           <Element name="daoContainer" className="element">

<Container>
  <Title>DAO Generators</Title>
  <Subtitle>Test</Subtitle>
  <Grid container spacing={3}>
    {DAOContracts.map((contract: { name: any; description: any; }, index: Key | null | undefined) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <ERC20Item name={contract.name} description={contract.description} />
      </Grid>
    ))}
  </Grid>
</Container>
</Element>

        </Element>
      )}
      {section === 'marketplace' && (
        <Element name="marketplaceContainer" className="element">
                <Element name="marketplaceContainer" className="element">

<Container>
  <Title>Marketplace Generator</Title>
  <Subtitle>Test</Subtitle>
  <Grid container spacing={3}>
    {MarketplaceContracts.map((contract: { name: any; description: any; }, index: Key | null | undefined) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <ERC20Item name={contract.name} description={contract.description} />
      </Grid>
    ))}
  </Grid>
</Container>
</Element>
        </Element>
      )}
      </></> 
  );
}


const NavMenu = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 20px;
  background: #333;
`;

const NavMenuItem = styled.div`
  color: #fff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px 32px;
  background: var(--black2);

 =
`;

const Title = styled.h3`
  color: var(--allert-blur-50);
  font-size: 28px;
  font-weight: 900;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin-block-start: 40px;
  margin-block-end: 10px;

  gap: 20px;
`;

const Subtitle = styled.h5`
  color: var(--white);
  font-size: 20px;
  font-weight: 300;
  line-height: 32px;
  letter-spacing: 0px;
  text-transform: capitalize;
  margin-block-end: 40px;

  gap: 20px;
`;

const Title1 = styled.h3`
  color: var(--blue);
  font-size: 35px;
  font-weight: 900;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin-block-end: 20px;
  margin-block-start: 20px;
  left: 20px;
  padding: 0px 52px;
`;

const Submit = styled(Button)`
  color: var(--white);
  font-size: 16px;
  font-weight: 600;
  line-height: 25.6px;
  letter-spacing: 0.8px;
  padding: 8px 16px;
  width: max-content;
  border-radius: 4px;
  border: none;
  background: var(--gradient1);
  cursor: pointer;
  margin: 80px 0 0 auto;
`;
