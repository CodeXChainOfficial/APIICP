import styled from "@emotion/styled";

import { Button } from "@mui/material";



 



export default function CreateToken() {

  const erc20Contracts = [
    {
      name: 'ERC20 Standard',
      description: 'A standard ERC20 token with basic functionality like transfer, balanceOf, and approve.',
    },
    {
      name: 'ERC20 Advance',
      description: 'Burnable ERC-20: An ERC-20 token with the additional ability to burn (destroy) tokens. This is useful for reducing the total supply Pausable ERC-20: An ERC-20 token that can be paused, preventing any transfers or token operations during a specific period. This can be useful in emergencies or to implement compliance, Mintable ERC-20: In contrast to burnable, this type allows new tokens to be created or "minted" as needed. It can be controlled by the contract owner to add new tokens to the supply.',
    },
    {
      name: 'ERC20 Liquidity',
      description: 'An ERC20 token designed for providing liquidity in decentralized exchanges.',
    },
    {
      name: 'ERC20 Governance',
      description: 'These tokens are used for governance in decentralized autonomous organizations (DAOs) or other voting-based systems. Token holders have voting rights proportional to the number of tokens they hold.',
    },
    {
      name: 'ERC20 Vesting',
      description: 'Tokens that are released to holders over a period of time. This can be used for team tokens, advisors, or any situation where you want to incentivize long-term holding.',
    },
    {
      name: 'ERC20 Airdrop',
      description: 'An ERC20 token used for distributing tokens via airdrops.',
    },
    {
      name: 'ERC20 Wrapped',
      description: 'Tokens that represent assets on another blockchain. For example, wrapped Bitcoin (WBTC) is an ERC-20 token that represents Bitcoin on the Ethereum blockchain.',
    },
    {
      name: 'ERC20 Rebate',
      description: 'Tokens that provide rebates, discounts, or rewards for using a particular service.',
    },
  ];

  const NFTContracts = [
    {
      name: 'ERC721 Standard',
      description: 'The ERC721Base smart contract implements the ERC721 NFT standard, along with the ERC721A optimization to the standard. It allows you to mint NFTs to yourself (or to someone else) and selling those NFTs on a marketplace.',
    
    },
    {
      name: 'ERC721 Collection',
      description: 'Burnable ERC-20: An ERC-20 token with the additional ability to burn (destroy) tokens. This is useful for reducing the total supply Pausable ERC-20: An ERC-20 token that can be paused, preventing any transfers or token operations during a specific period. This can be useful in emergencies or to implement compliance, Mintable ERC-20: In contrast to burnable, this type allows new tokens to be created or "minted" as needed. It can be controlled by the contract owner to add new tokens to the supply.',
    },
    {
      name: 'ERC721 Delayed Reveal',
      description: 'An ERC20 token designed for providing liquidity in decentralized exchanges.',
    },
    {
      name: 'ERC721 Drop',
      description: 'These tokens are used for governance in decentralized autonomous organizations (DAOs) or other voting-based systems. Token holders have voting rights proportional to the number of tokens they hold.',
    },
    {
      name: 'ERC721 Lezy Mint',
      description: 'Tokens that are released to holders over a period of time. This can be used for team tokens, advisors, or any situation where you want to incentivize long-term holding.',
    },
    {
      name: 'ERC721 Signature Mint',
      description: 'An ERC20 token used for distributing tokens via airdrops.',
    },
    {
      name: 'ERC721 Wrapped',
      description: 'Tokens that represent assets on another blockchain. For example, wrapped Bitcoin (WBTC) is an ERC-20 token that represents Bitcoin on the Ethereum blockchain.',
    },
    {
      name: 'ERC721 Rebate',
      description: 'Tokens that provide rebates, discounts, or rewards for using a particular service.',
    },
  ];


  const ERC20List = () => {
    const erc20Contracts = [
      {
        name: 'ERC20 Standard',
        description: 'A standard ERC20 token with basic functionality like transfer, balanceOf, and approve.',
      },
      {
        name: 'ERC20 Advance',
        description: 'Burnable ERC-20: An ERC-20 token with the additional ability to burn (destroy) tokens. This is useful for reducing the total supply Pausable ERC-20: An ERC-20 token that can be paused, preventing any transfers or token operations during a specific period. This can be useful in emergencies or to implement compliance, Mintable ERC-20: In contrast to burnable, this type allows new tokens to be created or "minted" as needed. It can be controlled by the contract owner to add new tokens to the supply.',
      },
      {
        name: 'ERC20 Liquidity',
        description: 'An ERC20 token designed for providing liquidity in decentralized exchanges.',
      },
      {
        name: 'ERC20 Governance',
        description: 'These tokens are used for governance in decentralized autonomous organizations (DAOs) or other voting-based systems. Token holders have voting rights proportional to the number of tokens they hold.',
      },
      {
        name: 'ERC20 Vesting',
        description: 'Tokens that are released to holders over a period of time. This can be used for team tokens, advisors, or any situation where you want to incentivize long-term holding.',
      },
      {
        name: 'ERC20 Airdrop',
        description: 'An ERC20 token used for distributing tokens via airdrops.',
      },
      {
        name: 'ERC20 Wrapped',
        description: 'Tokens that represent assets on another blockchain. For example, wrapped Bitcoin (WBTC) is an ERC-20 token that represents Bitcoin on the Ethereum blockchain.',
      },
      {
        name: 'ERC20 Rebate',
        description: 'Tokens that provide rebates, discounts, or rewards for using a particular service.',
      },
    ];
  }
  const NFTlist = () => {
    const NFTContracts = [
      {
        name: 'ERC721 Standard',
        description: 'The ERC721Base smart contract implements the ERC721 NFT standard, along with the ERC721A optimization to the standard. It allows you to mint NFTs to yourself (or to someone else) and selling those NFTs on a marketplace.',
      },
      {
        name: 'ERC721 Collection',
        description: 'Burnable ERC-20: An ERC-20 token with the additional ability to burn (destroy) tokens. This is useful for reducing the total supply Pausable ERC-20: An ERC-20 token that can be paused, preventing any transfers or token operations during a specific period. This can be useful in emergencies or to implement compliance, Mintable ERC-20: In contrast to burnable, this type allows new tokens to be created or "minted" as needed. It can be controlled by the contract owner to add new tokens to the supply.',
      },
      {
        name: 'ERC721 Delayed Reveal',
        description: 'An ERC20 token designed for providing liquidity in decentralized exchanges.',
      },
      {
        name: 'ERC721 Drop',
        description: 'These tokens are used for governance in decentralized autonomous organizations (DAOs) or other voting-based systems. Token holders have voting rights proportional to the number of tokens they hold.',
      },
      {
        name: 'ERC721 Lezy Mint',
        description: 'Tokens that are released to holders over a period of time. This can be used for team tokens, advisors, or any situation where you want to incentivize long-term holding.',
      },
      {
        name: 'ERC721 Signature Mint',
        description: 'An ERC20 token used for distributing tokens via airdrops.',
      },
      {
        name: 'ERC721 Wrapped',
        description: 'Tokens that represent assets on another blockchain. For example, wrapped Bitcoin (WBTC) is an ERC-20 token that represents Bitcoin on the Ethereum blockchain.',
      },
      {
        name: 'ERC721 Rebate',
        description: 'Tokens that provide rebates, discounts, or rewards for using a particular service.',
      },
    ];
  }
  

  return (
<></>
  );
}

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

 
`;

const Title = styled.h3`
  color: var(--blue);
  font-size: 20px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin-block-end: 10px;
  gap: 20px;
`;

const Title1 = styled.h3`
  color: var(--blue);
  font-size: 35px;
  font-weight: 900;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin-block-end: 10px;
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
