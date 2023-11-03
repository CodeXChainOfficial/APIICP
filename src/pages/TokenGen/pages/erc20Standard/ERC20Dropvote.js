import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./components/FormInput";
import FormTextarea from "./components/FormTextarea";
import ImageInput from "./components/ImageInput";
import RadioInput from "./components/RadioInput";
import ChainSelector from "./components/ChainSelector";
import { media } from "@/shared/styles/media";
import { Button, FormControl, InputLabel, MenuItem, Select, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import SelectedChains from "./components/SelectedChains";
import WalletList from "./components/WalletList";
import WalletVotingPower from "./components/WalletVotingPower";
import CreateDAO from "./components/CreateDAO";
import { useLaunchPadForm } from "../../../launchpad/data/useLaunchPad"
import { useNavigate } from "react-router-dom";
import { LaunchPadFormData, LaunchPadFormSchema, LaunchpadRoutes } from '../../../launchpad/constants'
import React, { Key, useEffect, useState } from "react";
import { Container, Grid } from '@mui/material';
import ERC20Item from './card';
import { FormInputStyle } from "./styles/form";
import Web3, { Bytes } from "web3";
import MyTokenContractABI from "./ABIerc20Dropvote.json";
import axios from "axios"; // Import Axios for making HTTP requests
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Modal from "@mui/material";

import { BrowserProvider, ethers, parseEther, parseUnits } from "ethers"

// The pkg.exports provides granular access
import { InfuraProvider } from "ethers/providers"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 50, 0.15)', // Dark blue with 15% transparency
    backdropFilter: 'blur(8px)', // Apply background blur
  },
  content: {
    width: '300px',
    height: '200px',
    margin: 'auto', // Center the modal
    background: 'transparent', // Transparent background
    border: '2px solid lightblue', // Border color and width
    borderRadius: '8px',
    padding: '20px',
    display: 'grid',
     gridTemplateColumns: 'center' ,
    alignItems: 'center',
    justifyContent: 'center', // Center title and button
    color: 'white', // Text color
    fontSize: '24px', // Text size
    gap: '30px', // Space between title and button
    marginTop: '20px', // Space from top

  },
};

const infuraRpcUrl =
  "https://mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b";

declare global {
  interface Window {
    ethereum?: any; // Replace 'any' with the appropriate type if known
  }
}



let networkInfo;

export default function ERC20Standard() {
  const [canisterInfo, setCanisterInfo] = useState('');

 
  
  const [selectedMainnetNetwork, setSelectedMainnetNetwork] =
    useState("MainNet");
  const [selectedTestnetNetwork, setSelectedTestnetNetwork] =
    useState("TestNet");
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null); // Declare web3 using useState
  const [chainId, setChainId] = useState<string>(""); // Add state for chainId
  const [selectedRpcUrl, setSelectedRpcUrl] = useState<string>(""); // Declare selectedRpcUrl state
  const [deployedTokens, setDeployedTokens] = useState([]);

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [contract, setContract] = useState(null);
 
 
  
  const convertToAbiItemArray = (abi: any) => {
    if (Array.isArray(abi)) {
      return abi;
    } else if (abi && typeof abi === "object") {
      return [abi];
    }
    return [];
  };
  const abiArray = convertToAbiItemArray(MyTokenContractABI);

    const [selectedToken, setSelectedToken] = useState(null);
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [deploymentStep, setDeploymentStep] = useState(0);
    const [functionInputs, setFunctionInputs] = useState<{ name: string; type: string; value: string }[]>([]);
const [functionOutputs, setFunctionOutputs] = useState<{ name: string; type: string; value: string }[]>([]);


      const handleSelectToken = (token, index) => {
        setSelectedTokenIndex(index);
        setSelectedToken(token);
        setSelectedFunction(null); // Reset selected function when a new token is selected
        setFunctionInputs([]); // Reset function inputs
        setFunctionOutputs([]); // Reset function outputs
      };
    
  
      const handleSelectFunction = (func) => {
        setSelectedFunction(func);
        setFunctionInputs(func.inputs.map((input) => ({ name: input.name, type: input.type, value: '' })));
        setFunctionOutputs([]);
      
      
      };
      const [loading, setLoading] = useState(false);

const handleCallFunction = async () => {
  
  setLoading(true);


  if (!selectedToken || !selectedToken.Taddress) {
    console.error('Selected token or token address is not defined.', selectedToken,selectedToken.Taddress );
    return;
  }
const infuraRpcUrl =
"https://sepolia.infura.io/v3/40b6ee6a88f44480b3ae89b1183df7ed";

const infuraProvider = new ethers.JsonRpcProvider(infuraRpcUrl);


// Connect to MetaMask wallet
await window.ethereum.enable();
const metaMaskProvider = new ethers.BrowserProvider(window.ethereum);
  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_defaultAdmin",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_totalSupply",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "_decimals",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_initialDeploymentFee",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "burnFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "prevURI",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "newURI",
          "type": "string"
        }
      ],
      "name": "ContractURIUpdated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "mintTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes[]",
          "name": "data",
          "type": "bytes[]"
        }
      ],
      "name": "multicall",
      "outputs": [
        {
          "internalType": "bytes[]",
          "name": "results",
          "type": "bytes[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "prevOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnerUpdated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "permit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_uri",
          "type": "string"
        }
      ],
      "name": "setContractURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "setOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "mintedTo",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "quantityMinted",
          "type": "uint256"
        }
      ],
      "name": "TokensMinted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawDeploymentFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contractURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deploymentFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deploymentFeeCollector",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DOMAIN_SEPARATOR",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "nonces",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const signer = await metaMaskProvider.getSigner();
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(selectedToken.Taddress, abi, signer);

  try {
    // Ensure contractAddress and contractABI are defined
    if (!contract || !abi) {
      console.error('Contract address or ABI is not defined.');
      return;
    }

    console.log('Selected Function Name:', selectedFunction.name);
    console.log('Contract ABI:', contract.interface.format());
    console.log('TokenAddress:', selectedToken.Taddress);

    if (contract && selectedFunction.name) {
      const args: any[] = functionInputs.map((input) => input.value);

      try {
        const result = await contract[selectedFunction.name](...args);

        console.log(result);
       setFunctionOutputs([{
  name: selectedFunction.name,
  value: result !== undefined ? result : 'N/A',
  // Assuming you want to keep the type from the selectedFunction.outputs
  type: selectedFunction.outputs.length > 0 ? selectedFunction.outputs[0].type : 'N/A',
}]);
        
        console.log('Outputs:', outputs);

        setFunctionOutputs(outputs);
      } catch (error) {
        console.error('Error calling function:', error);
      }
    }
  } catch (error) {
    console.error('Error creating contract instance:', error);
  }
};
 


  const contractAddress = selectedToken ? selectedToken.address : null;

  useEffect(() => {
    if (web3 && abiArray) {
      const newContract = new web3.eth.Contract(abiArray, contractAddress);
      setContract(newContract);
    }
  }, [web3, abiArray, contractAddress]);
 

  const networkOptions = {
    mainnet: {
      label: "Mainnet",
      options: [
        {
          label: "Ethereum",
          chainId: "0x1", // Ethereum Mainnet
          rpcUrl:
            "https://mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "ETH", // Native token of Ethereum

        },
        {
          label: "OneLedger-Mainnet",
          chainId: "0x1294f7c2", // Ethereum Mainnet
          rpcUrl: 'https://frankenstein-rpc.oneledger.network	',
          logo: "./IconImage/img_frame371062_22.png", // Add the path to the Goerli logo
          nativeToken: "OLT", // Native token of Arbitrum

        },
        {
          label: "Linea",
          chainId: "0xe708", // Ethereum Mainnet
          rpcUrl:
            "https://linea-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "ETH", // Native token of Linea

        },
        {
          label: "Polygon",
          chainId: "0x89", // Ethereum Mainnet
          rpcUrl:
            "https://polygon-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "MATIC", // Native token of Polygon

        },
        {
          label: "Optimism",
          chainId: "0x12c", // Ethereum Mainnet
          rpcUrl:
            "https://optimism-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "ETH", // Native token of Arbitrum

        },
        {
          label: "Arbitrum",
          chainId: "0xa4b1", // Ethereum Mainnet
          rpcUrl:
            "https://arbitrum-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "ETH", // Native token of Arbitrum

        },

        {
          label: "Avalanche",
          chainId: "0xa86a", // Ethereum Mainnet
          rpcUrl:
            "https://avalanche-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "AVAX", // Native token of Avalanche

        },
        {
          label: "Near",
          chainId: "0x4e454152", // Ethereum Mainnet
          rpcUrl:
            "https://near-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "NEAR", // Native token of Near

        },
        {
          label: "Aurora",
          chainId: "0x4e454152", // Ethereum Mainnet
          rpcUrl:
            "https://aurora-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "AETH", // Native token of Aurora

        },

        {
          label: "Celo",
          chainId: "0xa4ec", // Ethereum Mainnet
          rpcUrl:
            "https://celo-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "CELO", // Native token of Celo

        },
      ],
    },
    testnet: {
      label: "Testnet",
      options: [
        {
          label: "Eth-Goerli",
          chainId: "0x5", // Goerli Testnet

          rpcUrl:
            "https://goerli.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_48x48.png", // Add the path to the Goerli logo
            nativeToken: "ETH", // Native token of Arbitrum

        },
        {
          label: "Arthera-TestNet",
          chainId: "0x2803", // Ethereum Mainnet
          rpcUrl: "https://rpc-test.arthera.net",
          logo: "./IconImage/img_frame371062_22.png", // Add the path to the Goerli logo
          nativeToken: "AA", // Native token of Arbitrum

        },
        {
          label: "OneLedger-TestNet",
          chainId: "0xfb4d255f", // Ethereum Mainnet
          rpcUrl: 'https://frankenstein-rpc.oneledger.network	',
          logo: "./IconImage/img_frame371062_22.png", // Add the path to the Goerli logo
          nativeToken: "OLT", // Native token of Arbitrum

        },
        {
          label: "Eth-Sepolia",
          chainId: "0xaa36a7", // Ethereum Mainnet
          rpcUrl:
            "https://sepolia.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_48x48.png", // Add the path to the Goerli logo
            nativeToken: "ETH", // Native token of Arbitrum

        },
        {
          label: "Poly-Mumbai",
          chainId: "0x13881", // Ethereum Mainnet
          rpcUrl:
            "https://polygon-mumbai.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "MATIC", // Native token of Polygon

        },
        {
          label: "Opt-Goerli",
          chainId: "0x1a4", // Ethereum Mainnet
          rpcUrl:
            "https://optimism-goerli.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_7.png", // Add the path to the Goerli logo
            nativeToken: "ETH", // Native token of Arbitrum

        },
        {
          label: "Arb-Goerli",
          chainId: "0x6f70", // Ethereum Mainnet
          rpcUrl:
            "https://arbitrum-goerli.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_8.png", // Add the path to the Goerli logo
            nativeToken: "ETH", // Native token of Arbitrum

        },
        {
          label: "Avax-Fuji",
          chainId: "0xa869", // Ethereum Mainnet
          rpcUrl:
            "https://avalanche-fuji.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_9.png", // Add the path to the Goerli logo
            nativeToken: "AVAX", // Native token of Avalanche

        },  
        {
          label: "Near-Testnet",
          chainId: "0x4e454153", // Ethereum Mainnet
          rpcUrl:
            "https://near-testnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_28.png", // Add the path to the Goerli logo
            nativeToken: "NEAR", // Native token of Near

        },
        {
          label: "Aurora-Testnet",
          chainId: "0x4e454153", // Ethereum Mainnet
          rpcUrl:
            "https://aurora-testnet.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "ETH", // Native token of Aurora

        },
        {
          label: "Celo-Alfajores",
          chainId: "0xaef3", // Ethereum Mainnet

          rpcUrl:
            "https://celo-alfajores.infura.io/v3/5f3224c8075b407fa38911977320235b",
            logo: "./IconImage/img_frame371062_1.png", // Add the path to the Goerli logo
            nativeToken: "CELO", // Native token of Celo

        },
      ],
    },
  };

  useEffect(() => {
    const web3Instance = new Web3(selectedRpcUrl);
    setWeb3(web3Instance);

    // Request account access
    if (window.ethereum) {
      window.ethereum
        .enable()
        .then((accounts: string | any[]) => {
          if (accounts.length > 0) {
            const address = accounts[0];
            setUserAddress(address);
            console.log("User Address:", address);
          } else {
            console.error("No accounts found.");
          }
        })
        .catch((error: any) => {
          console.error("Error fetching user address:", error);
        });
    }
    const category = "ERC20Dropvote"; // Replace with the desired category
    const walletAddress = userAddress; // Replace with the user's wallet address
    
    axios.get(`http://localhost:5004/api/getDeployedTokens?category=${category}&walletAddress=${walletAddress}`)
      .then(response => {
        const storedTokens = response.data.deployedTokens;
        console.log(storedTokens);
        setDeployedTokens(response.data.deployedTokens);
    
      })
      .catch(error => {
        console.error(error);
      }); 
  }, [selectedRpcUrl]);

  // Handle mainnet network change
  const handleMainnetNetworkChange = (value: string) => {

    const newSelectedMainnetNetwork = value;
    const newSelectedMainnetRpcUrl = networkOptions.mainnet.options.find(
      (option) => option.label === newSelectedMainnetNetwork
    )?.rpcUrl;
    const newSelectedMainnetCHainId = networkOptions.mainnet.options.find(
      (option) => option.label === newSelectedMainnetNetwork
    )?.chainId;

    setSelectedMainnetNetwork(newSelectedMainnetNetwork);

    if (newSelectedMainnetRpcUrl) {
      setSelectedRpcUrl(newSelectedMainnetRpcUrl);
      console.log("selectedRpcUrl:", newSelectedMainnetRpcUrl);
      console.log("selectedNetwork:", newSelectedMainnetNetwork);
      networkInfo=newSelectedMainnetNetwork;
      connectToNetwork(newSelectedMainnetCHainId);
    }
  };

  // Handle testnet network change
  const handleTestnetNetworkChange = (value: string) => {
    const newSelectedTestnetNetwork = value;
    const newSelectedTestnetRpcUrl = networkOptions.testnet.options.find(
      (option) => option.label === newSelectedTestnetNetwork
    )?.rpcUrl;
    setSelectedTestnetNetwork(newSelectedTestnetNetwork);

    const newSelectedTestnetchainID = networkOptions.testnet.options.find(
      (option) => option.label === newSelectedTestnetNetwork
    )?.chainId;

    if (newSelectedTestnetRpcUrl) {
      setSelectedRpcUrl(newSelectedTestnetRpcUrl);
      console.log("selectedRpcUrl:", newSelectedTestnetRpcUrl);
      console.log("selectedNetwork:", newSelectedTestnetNetwork);
      setChainId(newSelectedTestnetNetwork); // Set the chainId based on the selected network
      networkInfo=newSelectedTestnetNetwork;
      connectToNetwork(newSelectedTestnetchainID);
    }
  };

  const connectToNetwork = async (chainId: string) => {
    if (window.ethereum) {
      try {
        // Request to switch to the desired network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }], // Pass the desired chainId to switch to
        });

        // Network switch was successful
        console.log("Switched to the desired network.");

        // You can add additional logic here to handle the switched network
        // For example, you can update the user interface or perform network-specific tasks.
      } catch (error) {
        // Handle errors, e.g., user rejected the request or the network switch failed
        console.error("Error switching network:", error);
      }
    } else {
      // Ethereum provider not available (e.g., MetaMask not installed)
      console.error("Ethereum provider not available.");
    }
    const infuraProvider = new ethers.JsonRpcProvider(infuraRpcUrl);


    // Connect to MetaMask wallet
    await window.ethereum.enable();
    const metaMaskProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await metaMaskProvider.getSigner();
    console.log("singer", signer)
    const category = "ERC20Dropvote"; // Replace with the desired category
    const walletAddress = await signer.getAddress(); // Replace with the user's wallet address
    
    axios.get(`http://localhost:5004/api/getDeployedTokens?category=${category}&walletAddress=${walletAddress}`)
      .then(response => {
        const storedTokens = response.data.deployedTokens;
        console.log("list",storedTokens);
        setDeployedTokens(response.data.deployedTokens);
    

      })
      .catch(error => {
        console.error(error);
      });
  };
    


  const navigate = useNavigate();
  const [formData, setFormData] = useLaunchPadForm();

  const { control } = useForm<LaunchPadFormData>({
    defaultValues: formData,
    resolver: zodResolver(LaunchPadFormSchema),
  });

  const onSubmit = (data: LaunchPadFormData) => {
    setFormData(data);
  };
 

  const Modal = ({ isOpen, onClose, content }) => {
    return (
      <div style={{ display: isOpen ? 'block' : 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', maxWidth: '400px', color: '#fff' }}>
          {content}
          <button style={{ color: '#fff', background: 'transparent', border: '1px solid #fff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }} onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);


  async function deployToken() {

    setIsModalOpen(true);

    setDeploymentStep(1);
    console.log('name',name);
    console.log('symbol',symbol);
    console.log('totalSupply',totalSupply);

    console.log('decimals',decimals);


    if (!name || !symbol) {
      console.error(
        "Please provide valid values for tokenName, tokenSymbol, initialSupply, and decimal."
      );
      return;
    }


    const web3Instance = new Web3(selectedRpcUrl);
    setWeb3(web3Instance);
  
    if (window.ethereum) {
      const accounts = await window.ethereum.enable();
  
      window.ethereum
        .enable()
        .then((accounts: string | any[]) => {
          if (accounts.length > 0) {
            const address = accounts[0];
            setUserAddress(address);
            console.log("User Address stage 2:", address);
          } else {
            console.error("No accounts found. (step2)");
          }
        })
        .catch((error: any) => {
          console.error("Error fetching user address:", error);
        });
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const userAddress = accounts[0]; // Get the user's address
  
    console.log("accounts:", accounts);
    console.log("userAddress:", userAddress);
    const deploymentFee = web3.utils.toWei("0.001", "ether"); // Set your deployment fee


   
  
  const MyTokenContractData =
    "6101006040527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c960e0523480156200003657600080fd5b506040516200404c3803806200404c8339810160408190526200005991620003b3565b8282818160056200006b8382620004d2565b5060066200007a8282620004d2565b50504660a052503060c0526200008f620000b5565b60805250620000a09050846200014c565b620000ab816200019e565b505050506200059e565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f620000e262000237565b80516020918201206040805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b6001600160a01b038116620001ed5760405162461bcd60e51b8152602060048201526011602482015270125b9d985b1a59081c9958da5c1a595b9d607a1b604482015260640160405180910390fd5b600b80546001600160a01b0319166001600160a01b0383169081179091556040517f299d17e95023f496e0ffc4909cff1a61f74bb5eb18de6f900f4155bfa1b3b33390600090a250565b606060058054620002489062000443565b80601f0160208091040260200160405190810160405280929190818152602001828054620002769062000443565b8015620002c75780601f106200029b57610100808354040283529160200191620002c7565b820191906000526020600020905b815481529060010190602001808311620002a957829003601f168201915b5050505050905090565b80516001600160a01b0381168114620002e957600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200031657600080fd5b81516001600160401b0380821115620003335762000333620002ee565b604051601f8301601f19908116603f011681019082821181831017156200035e576200035e620002ee565b816040528381526020925086838588010111156200037b57600080fd5b600091505b838210156200039f578582018301518183018401529082019062000380565b600093810190920192909252949350505050565b60008060008060808587031215620003ca57600080fd5b620003d585620002d1565b60208601519094506001600160401b0380821115620003f357600080fd5b620004018883890162000304565b945060408701519150808211156200041857600080fd5b50620004278782880162000304565b9250506200043860608601620002d1565b905092959194509250565b600181811c908216806200045857607f821691505b6020821081036200047957634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620004cd57600081815260208120601f850160051c81016020861015620004a85750805b601f850160051c820191505b81811015620004c957828155600101620004b4565b5050505b505050565b81516001600160401b03811115620004ee57620004ee620002ee565b6200050681620004ff845462000443565b846200047f565b602080601f8311600181146200053e5760008415620005255750858301515b600019600386901b1c1916600185901b178555620004c9565b600085815260208120601f198616915b828110156200056f578886015182559484019460019091019084016200054e565b50858210156200058e5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05160c05160e051613a74620005d860003960006111a601526000610849015260006108730152600061089d0152613a746000f3fe6080604052600436106102045760003560e01c806370a0823111610118578063a9059cbb116100a0578063d637ed591161006f578063d637ed5914610643578063dd62ed3e1461066c578063e8a3d485146106b2578063eec8897c146106c7578063f1127ed8146106e757600080fd5b8063a9059cbb146105b6578063ac9650d8146105d6578063c3cda52014610603578063d505accf1461062357600080fd5b80638e539e8c116100e75780638e539e8c14610521578063938e3d7b1461054157806395d89b41146105615780639ab24eb014610576578063a457c2d71461059657600080fd5b806370a082311461049a5780637ecebe00146104d057806384bb1e42146104f05780638da5cb5b1461050357600080fd5b80633644e5151161019b57806342966c681161016a57806342966c68146103cc578063587cde1e146103ec5780635c19a95c146104255780636f4f2837146104455780636fcfff451461046557600080fd5b80633644e51514610357578063395093511461036c5780633a46b1a81461038c578063426cfaf3146103ac57600080fd5b806318160ddd116101d757806318160ddd146102b857806323b872dd146102d7578063313ce567146102f757806335b65e1f1461031357600080fd5b806306fdde0314610209578063079fe40e14610234578063095ea7b31461026657806313af403514610296575b600080fd5b34801561021557600080fd5b5061021e610731565b60405161022b919061306b565b60405180910390f35b34801561024057600080fd5b50600b546001600160a01b03165b6040516001600160a01b03909116815260200161022b565b34801561027257600080fd5b5061028661028136600461309a565b6107c3565b604051901515815260200161022b565b3480156102a257600080fd5b506102b66102b13660046130c4565b6107dd565b005b3480156102c457600080fd5b506004545b60405190815260200161022b565b3480156102e357600080fd5b506102866102f23660046130df565b610816565b34801561030357600080fd5b506040516012815260200161022b565b34801561031f57600080fd5b506102c961032e3660046130c4565b60145460009081526015602090815260408083206001600160a01b039094168352929052205490565b34801561036357600080fd5b506102c961083c565b34801561037857600080fd5b5061028661038736600461309a565b6108cc565b34801561039857600080fd5b506102c96103a736600461309a565b61090b565b3480156103b857600080fd5b506102b66103c7366004613129565b61097e565b3480156103d857600080fd5b506102b66103e7366004613181565b610b8f565b3480156103f857600080fd5b5061024e6104073660046130c4565b6001600160a01b039081166000908152600860205260409020541690565b34801561043157600080fd5b506102b66104403660046130c4565b610bed565b34801561045157600080fd5b506102b66104603660046130c4565b610bf7565b34801561047157600080fd5b506104856104803660046130c4565b610c24565b60405163ffffffff909116815260200161022b565b3480156104a657600080fd5b506102c96104b53660046130c4565b6001600160a01b031660009081526002602052604090205490565b3480156104dc57600080fd5b506102c96104eb3660046130c4565b610c46565b6102b66104fe366004613238565b610c64565b34801561050f57600080fd5b506001546001600160a01b031661024e565b34801561052d57600080fd5b506102c961053c366004613181565b610d31565b34801561054d57600080fd5b506102b661055c3660046132e3565b610d8d565b34801561056d57600080fd5b5061021e610dba565b34801561058257600080fd5b506102c96105913660046130c4565b610dc9565b3480156105a257600080fd5b506102866105b136600461309a565b610e50565b3480156105c257600080fd5b506102866105d136600461309a565b610eed565b3480156105e257600080fd5b506105f66105f136600461332c565b610efb565b60405161022b91906133a1565b34801561060f57600080fd5b506102b661061e366004613414565b610ff0565b34801561062f57600080fd5b506102b661063e36600461346c565b611152565b34801561064f57600080fd5b506106586112b8565b60405161022b9897969594939291906134d6565b34801561067857600080fd5b506102c961068736600461352b565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205490565b3480156106be57600080fd5b5061021e611377565b3480156106d357600080fd5b506102866106e236600461355e565b611405565b3480156106f357600080fd5b506107076107023660046135d0565b6117b7565b60408051825163ffffffff1681526020928301516001600160e01b0316928101929092520161022b565b60606005805461074090613605565b80601f016020809104026020016040519081016040528092919081815260200182805461076c90613605565b80156107b95780601f1061078e576101008083540402835291602001916107b9565b820191906000526020600020905b81548152906001019060200180831161079c57829003601f168201915b5050505050905090565b6000336107d181858561183b565b60019150505b92915050565b6107e561195f565b61080a5760405162461bcd60e51b815260040161080190613639565b60405180910390fd5b6108138161198c565b50565b6000336108248582856119de565b61082f858585611a70565b60019150505b9392505050565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561089557507f000000000000000000000000000000000000000000000000000000000000000046145b156108bf57507f000000000000000000000000000000000000000000000000000000000000000090565b6108c7611c44565b905090565b3360008181526003602090815260408083206001600160a01b03871684529091528120549091906107d19082908690610906908790613677565b61183b565b600043821061095c5760405162461bcd60e51b815260206004820152601f60248201527f4552433230566f7465733a20626c6f636b206e6f7420796574206d696e6564006044820152606401610801565b6001600160a01b03831660009081526009602052604090206108359083611cd9565b61098661195f565b6109a25760405162461bcd60e51b815260040161080190613639565b601454600e5482156109f1575060003360405160609190911b6bffffffffffffffffffffffff191660208201524360348201526054016040516020818303038152906040528051906020012091505b8360200135811115610a3a5760405162461bcd60e51b81526020600482015260126024820152711b585e081cdd5c1c1b1e4818db185a5b595960721b6044820152606401610801565b604051806101000160405280856000013581526020018560200135815260200182815260200185606001358152602001856080013581526020018560a0013581526020018560c0016020810190610a9191906130c4565b6001600160a01b03168152602001610aac60e087018761368a565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050509152508051600c9081556020820151600d556040820151600e556060820151600f55608082015160105560a082015160115560c0820151601280546001600160a01b0319166001600160a01b0390921691909117905560e0820151601390610b47908261371e565b50505060148290556040517f6dab9d7d05d468100139089b2516cb8ff286c3972ff070d3b509e371f0d0d4b890610b819086908690613807565b60405180910390a150505050565b33600090815260026020526040902054811115610be35760405162461bcd60e51b81526020600482015260126024820152716e6f7420656e6f7567682062616c616e636560701b6044820152606401610801565b6108133382611d96565b6108133382611dae565b610bff61195f565b610c1b5760405162461bcd60e51b815260040161080190613639565b61081381611e28565b6001600160a01b0381166000908152600960205260408120546107d790611ebc565b6001600160a01b0381166000908152600760205260408120546107d7565b601454610c743387878787611405565b5085600c6002016000828254610c8a9190613677565b9091555050600081815260156020908152604080832033845290915281208054889290610cb8908490613677565b90915550610ccb90506000878787611f2d565b6000610cd78888612085565b9050806001600160a01b038916336001600160a01b03167fff097c7d8b1957a4ff09ef1361b5fb54dcede3941ba836d0beb9d10bec725de68a604051610d1f91815260200190565b60405180910390a45050505050505050565b6000438210610d825760405162461bcd60e51b815260206004820152601f60248201527f4552433230566f7465733a20626c6f636b206e6f7420796574206d696e6564006044820152606401610801565b6107d7600a83611cd9565b610d9561195f565b610db15760405162461bcd60e51b815260040161080190613639565b6108138161209a565b60606006805461074090613605565b6001600160a01b0381166000908152600960205260408120548015610e3d576001600160a01b0383166000908152600960205260409020610e0b6001836138d5565b81548110610e1b57610e1b6138e8565b60009182526020909120015464010000000090046001600160e01b0316610e40565b60005b6001600160e01b03169392505050565b3360008181526003602090815260408083206001600160a01b038716845290915281205490919083811015610ed55760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610801565b610ee2828686840361183b565b506001949350505050565b6000336107d1818585611a70565b60608167ffffffffffffffff811115610f1657610f166131ac565b604051908082528060200260200182016040528015610f4957816020015b6060815260200190600190039081610f345790505b50905060005b82811015610fe957610fb930858584818110610f6d57610f6d6138e8565b9050602002810190610f7f919061368a565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061217592505050565b828281518110610fcb57610fcb6138e8565b60200260200101819052508080610fe1906138fe565b915050610f4f565b5092915050565b834211156110405760405162461bcd60e51b815260206004820152601d60248201527f4552433230566f7465733a207369676e617475726520657870697265640000006044820152606401610801565b604080517fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf60208201526001600160a01b03881691810191909152606081018690526080810185905260009060a00160405160208183030381529060405280519060200120905060006110d46110b461083c565b8360405161190160f01b8152600281019290925260228201526042902090565b905060006110e48287878761219a565b90506110ef816121c2565b881461113d5760405162461bcd60e51b815260206004820152601960248201527f4552433230566f7465733a20696e76616c6964206e6f6e6365000000000000006044820152606401610801565b611147818a611dae565b505050505050505050565b834211156111a25760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152606401610801565b60007f00000000000000000000000000000000000000000000000000000000000000008888886111d18c6121c2565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e001604051602081830303815290604052805190602001209050600061122e6110b461083c565b9050600061123e8287878761219a565b9050896001600160a01b0316816001600160a01b0316146112a15760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152606401610801565b6112ac8a8a8a61183b565b50505050505050505050565b600c8054600d54600e54600f54601054601154601254601380549798969795969495939492936001600160a01b0390921692916112f490613605565b80601f016020809104026020016040519081016040528092919081815260200182805461132090613605565b801561136d5780601f106113425761010080835404028352916020019161136d565b820191906000526020600020905b81548152906001019060200180831161135057829003601f168201915b5050505050905088565b6000805461138490613605565b80601f01602080910402602001604051908101604052809291908181526020018280546113b090613605565b80156113fd5780601f106113d2576101008083540402835291602001916113fd565b820191906000526020600020905b8154815290600101906020018083116113e057829003601f168201915b505050505081565b6040805161010081018252600c80548252600d546020830152600e5492820192909252600f546060820152601054608082015260115460a08201526012546001600160a01b031660c082015260138054600093849392909160e08401919061146c90613605565b80601f016020809104026020016040519081016040528092919081815260200182805461149890613605565b80156114e55780601f106114ba576101008083540402835291602001916114e5565b820191906000526020600020905b8154815290600101906020018083116114c857829003601f168201915b50505091909252505050606081015160a082015160c083015160808401519394509192909190156115ca576115c661151d8780613917565b80806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250505060808088015191508d9060208b01359060408c013590611572908d0160608e016130c4565b6040516bffffffffffffffffffffffff19606095861b811660208301526034820194909452605481019290925290921b166074820152608801604051602081830303815290604052805190602001206121ea565b5094505b84156116515785602001356000036115e257826115e8565b85602001355b92506000198660400135036115fd5781611603565b85604001355b91506000198660400135141580156116345750600061162860808801606089016130c4565b6001600160a01b031614155b61163e578061164e565b61164e60808701606088016130c4565b90505b60145460009081526015602090815260408083206001600160a01b03808f1685529252909120549089811690831614158061168c5750828814155b156116cc5760405162461bcd60e51b815260206004820152601060248201526f2150726963654f7243757272656e637960801b6044820152606401610801565b8915806116e15750836116df828c613677565b115b156117175760405162461bcd60e51b8152600401610801906020808252600490820152632151747960e01b604082015260600190565b84602001518a866040015161172c9190613677565b11156117675760405162461bcd60e51b815260206004820152600a602482015269214d6178537570706c7960b01b6044820152606401610801565b84514210156117a95760405162461bcd60e51b815260206004820152600e60248201526d18d85b9d0818db185a5b481e595d60921b6044820152606401610801565b505050505095945050505050565b60408051808201909152600080825260208201526001600160a01b0383166000908152600960205260409020805463ffffffff84169081106117fb576117fb6138e8565b60009182526020918290206040805180820190915291015463ffffffff8116825264010000000090046001600160e01b0316918101919091529392505050565b6001600160a01b03831661189d5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610801565b6001600160a01b0382166118fe5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610801565b6001600160a01b0383811660008181526003602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b60006119736001546001600160a01b031690565b6001600160a01b0316336001600160a01b031614905090565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b6001600160a01b038381166000908152600360209081526040808320938616835292905220546000198114611a6a5781811015611a5d5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610801565b611a6a848484840361183b565b50505050565b6001600160a01b038316611ad45760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610801565b6001600160a01b038216611b365760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610801565b6001600160a01b03831660009081526002602052604090205481811015611bae5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610801565b6001600160a01b03808516600090815260026020526040808220858503905591851681529081208054849290611be5908490613677565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051611c3191815260200190565b60405180910390a3611a6a8484846122bd565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f611c6f610731565b80516020918201206040805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b8154600090815b81811015611d3d576000611cf482846122ef565b905084868281548110611d0957611d096138e8565b60009182526020909120015463ffffffff161115611d2957809250611d37565b611d34816001613677565b91505b50611ce0565b8115611d815784611d4f6001846138d5565b81548110611d5f57611d5f6138e8565b60009182526020909120015464010000000090046001600160e01b0316611d84565b60005b6001600160e01b031695945050505050565b611da0828261230a565b611a6a600a61245f8361246b565b6001600160a01b03828116600081815260086020818152604080842080546002845282862054949093528787166001600160a01b03198416811790915590519190951694919391928592917f3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f9190a4611a6a8284836125e4565b6001600160a01b038116611e725760405162461bcd60e51b8152602060048201526011602482015270125b9d985b1a59081c9958da5c1a595b9d607a1b6044820152606401610801565b600b80546001600160a01b0319166001600160a01b0383169081179091556040517f299d17e95023f496e0ffc4909cff1a61f74bb5eb18de6f900f4155bfa1b3b33390600090a250565b600063ffffffff821115611f215760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b6064820152608401610801565b5090565b505050505050565b80600003611f71573415611f6c5760405162461bcd60e51b81526020600482015260066024820152652156616c756560d01b6044820152606401610801565b611a6a565b6000670de0b6b3a7640000611f868386613961565b611f909190613978565b905060008111611fd55760405162461bcd60e51b815260206004820152601060248201526f7175616e7469747920746f6f206c6f7760801b6044820152606401610801565b600073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b038516016120055750348114612009565b5034155b8061204a5760405162461bcd60e51b8152602060048201526011602482015270496e76616c6964206d73672076616c756560781b6044820152606401610801565b60006001600160a01b03871615612061578661206e565b600b546001600160a01b03165b905061207c85338386612721565b50505050505050565b60006120918383612762565b50600092915050565b60008080546120a890613605565b80601f01602080910402602001604051908101604052809291908181526020018280546120d490613605565b80156121215780601f106120f657610100808354040283529160200191612121565b820191906000526020600020905b81548152906001019060200180831161210457829003601f168201915b505050505090508160009081612137919061371e565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a16818360405161216992919061399a565b60405180910390a15050565b60606108358383604051806060016040528060278152602001613a18602791396127ec565b60008060006121ab878787876128c9565b915091506121b88161298d565b5095945050505050565b6001600160a01b03811660009081526007602052604090208054600181018255905b50919050565b6000808281805b87518110156122ac57612205600283613961565b9150600088828151811061221b5761221b6138e8565b6020026020010151905080841161225d576040805160208101869052908101829052606001604051602081830303815290604052805190602001209350612299565b60408051602081018390529081018590526060016040516020818303038152906040528051906020012093506001836122969190613677565b92505b50806122a4816138fe565b9150506121f1565b50941495939450505050565b505050565b6001600160a01b038381166000908152600860205260408082205485841683529120546122b8929182169116836125e4565b60006122fe6002848418613978565b61083590848416613677565b6001600160a01b03821661236a5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610801565b6001600160a01b038216600090815260026020526040902054818110156123de5760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610801565b6001600160a01b038316600090815260026020526040812083830390556004805484929061240d9084906138d5565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a36122b8836000846122bd565b600061083582846138d5565b8254600090819080156124b657856124846001836138d5565b81548110612494576124946138e8565b60009182526020909120015464010000000090046001600160e01b03166124b9565b60005b6001600160e01b031692506124d283858763ffffffff16565b9150600081118015612510575043866124ec6001846138d5565b815481106124fc576124fc6138e8565b60009182526020909120015463ffffffff16145b156125705761251e82612ad7565b8661252a6001846138d5565b8154811061253a5761253a6138e8565b9060005260206000200160000160046101000a8154816001600160e01b0302191690836001600160e01b031602179055506125db565b85604051806040016040528061258543611ebc565b63ffffffff16815260200161259985612ad7565b6001600160e01b0390811690915282546001810184556000938452602093849020835194909301519091166401000000000263ffffffff909316929092179101555b50935093915050565b816001600160a01b0316836001600160a01b0316141580156126065750600081115b156122b8576001600160a01b03831615612694576001600160a01b038316600090815260096020526040812081906126419061245f8561246b565b91509150846001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a7248383604051612689929190918252602082015260400190565b60405180910390a250505b6001600160a01b038216156122b8576001600160a01b038216600090815260096020526040812081906126ca90612b408561246b565b91509150836001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a7248383604051612712929190918252602082015260400190565b60405180910390a25050505050565b8015611a6a5773eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b0385160161275657611f6c8282612b4c565b611a6a84848484612bef565b61276c8282612c42565b6004546001600160e01b0310156127de5760405162461bcd60e51b815260206004820152603060248201527f4552433230566f7465733a20746f74616c20737570706c79207269736b73206f60448201526f766572666c6f77696e6720766f74657360801b6064820152608401610801565b611a6a600a612b408361246b565b60606001600160a01b0384163b6128545760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610801565b600080856001600160a01b03168560405161286f91906139c8565b600060405180830381855af49150503d80600081146128aa576040519150601f19603f3d011682016040523d82523d6000602084013e6128af565b606091505b50915091506128bf828286612d2d565b9695505050505050565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156129005750600090506003612984565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015612954573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661297d57600060019250925050612984565b9150600090505b94509492505050565b60008160048111156129a1576129a16139e4565b036129a95750565b60018160048111156129bd576129bd6139e4565b03612a0a5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610801565b6002816004811115612a1e57612a1e6139e4565b03612a6b5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610801565b6003816004811115612a7f57612a7f6139e4565b036108135760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610801565b60006001600160e01b03821115611f215760405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e20326044820152663234206269747360c81b6064820152608401610801565b60006108358284613677565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114612b99576040519150601f19603f3d011682016040523d82523d6000602084013e612b9e565b606091505b50509050806122b85760405162461bcd60e51b815260206004820152601c60248201527f6e617469766520746f6b656e207472616e73666572206661696c6564000000006044820152606401610801565b816001600160a01b0316836001600160a01b03160315611a6a57306001600160a01b03841603612c2d57611f6c6001600160a01b0385168383612d66565b611a6a6001600160a01b038516848484612dc9565b6001600160a01b038216612c985760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610801565b8060046000828254612caa9190613677565b90915550506001600160a01b03821660009081526002602052604081208054839290612cd7908490613677565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3612d29600083836122bd565b5050565b60608315612d3c575081610835565b825115612d4c5782518084602001fd5b8160405162461bcd60e51b8152600401610801919061306b565b6040516001600160a01b0383166024820152604481018290526122b890849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152612e01565b6040516001600160a01b0380851660248301528316604482015260648101829052611a6a9085906323b872dd60e01b90608401612d92565b6000612e56826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316612ed39092919063ffffffff16565b8051909150156122b85780806020019051810190612e7491906139fa565b6122b85760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610801565b6060612ee28484600085612eea565b949350505050565b606082471015612f4b5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610801565b6001600160a01b0385163b612fa25760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610801565b600080866001600160a01b03168587604051612fbe91906139c8565b60006040518083038185875af1925050503d8060008114612ffb576040519150601f19603f3d011682016040523d82523d6000602084013e613000565b606091505b5091509150613010828286612d2d565b979650505050505050565b60005b8381101561303657818101518382015260200161301e565b50506000910152565b6000815180845261305781602086016020860161301b565b601f01601f19169290920160200192915050565b602081526000610835602083018461303f565b80356001600160a01b038116811461309557600080fd5b919050565b600080604083850312156130ad57600080fd5b6130b68361307e565b946020939093013593505050565b6000602082840312156130d657600080fd5b6108358261307e565b6000806000606084860312156130f457600080fd5b6130fd8461307e565b925061310b6020850161307e565b9150604084013590509250925092565b801515811461081357600080fd5b6000806040838503121561313c57600080fd5b823567ffffffffffffffff81111561315357600080fd5b8301610100818603121561316657600080fd5b915060208301356131768161311b565b809150509250929050565b60006020828403121561319357600080fd5b5035919050565b6000608082840312156121e457600080fd5b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff808411156131dd576131dd6131ac565b604051601f8501601f19908116603f01168101908282118183101715613205576132056131ac565b8160405280935085815286868601111561321e57600080fd5b858560208301376000602087830101525050509392505050565b60008060008060008060c0878903121561325157600080fd5b61325a8761307e565b95506020870135945061326f6040880161307e565b935060608701359250608087013567ffffffffffffffff8082111561329357600080fd5b61329f8a838b0161319a565b935060a08901359150808211156132b557600080fd5b508701601f810189136132c757600080fd5b6132d6898235602084016131c2565b9150509295509295509295565b6000602082840312156132f557600080fd5b813567ffffffffffffffff81111561330c57600080fd5b8201601f8101841361331d57600080fd5b612ee2848235602084016131c2565b6000806020838503121561333f57600080fd5b823567ffffffffffffffff8082111561335757600080fd5b818501915085601f83011261336b57600080fd5b81358181111561337a57600080fd5b8660208260051b850101111561338f57600080fd5b60209290920196919550909350505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b828110156133f657603f198886030184526133e485835161303f565b945092850192908501906001016133c8565b5092979650505050505050565b803560ff8116811461309557600080fd5b60008060008060008060c0878903121561342d57600080fd5b6134368761307e565b9550602087013594506040870135935061345260608801613403565b92506080870135915060a087013590509295509295509295565b600080600080600080600060e0888a03121561348757600080fd5b6134908861307e565b965061349e6020890161307e565b955060408801359450606088013593506134ba60808901613403565b925060a0880135915060c0880135905092959891949750929550565b60006101008a83528960208401528860408401528760608401528660808401528560a084015260018060a01b03851660c08401528060e084015261351c8184018561303f565b9b9a5050505050505050505050565b6000806040838503121561353e57600080fd5b6135478361307e565b91506135556020840161307e565b90509250929050565b600080600080600060a0868803121561357657600080fd5b61357f8661307e565b9450602086013593506135946040870161307e565b925060608601359150608086013567ffffffffffffffff8111156135b757600080fd5b6135c38882890161319a565b9150509295509295909350565b600080604083850312156135e357600080fd5b6135ec8361307e565b9150602083013563ffffffff8116811461317657600080fd5b600181811c9082168061361957607f821691505b6020821081036121e457634e487b7160e01b600052602260045260246000fd5b6020808252600e908201526d139bdd08185d5d1a1bdc9a5e995960921b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b808201808211156107d7576107d7613661565b6000808335601e198436030181126136a157600080fd5b83018035915067ffffffffffffffff8211156136bc57600080fd5b6020019150368190038213156136d157600080fd5b9250929050565b601f8211156122b857600081815260208120601f850160051c810160208610156136ff5750805b601f850160051c820191505b81811015611f255782815560010161370b565b815167ffffffffffffffff811115613738576137386131ac565b61374c816137468454613605565b846136d8565b602080601f83116001811461378157600084156137695750858301515b600019600386901b1c1916600185901b178555611f25565b600085815260208120601f198616915b828110156137b057888601518255948401946001909101908401613791565b50858210156137ce5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60408152823560408201526020830135606082015260408301356080820152606083013560a0820152608083013560c082015260a083013560e0820152600061385260c0850161307e565b6001600160a01b03166101008381019190915260e08501359036869003601e1901821261387e57600080fd5b6020918601918201913567ffffffffffffffff81111561389d57600080fd5b8036038313156138ac57600080fd5b816101208601526138c2610140860182856137de565b9350505050610835602083018415159052565b818103818111156107d7576107d7613661565b634e487b7160e01b600052603260045260246000fd5b60006001820161391057613910613661565b5060010190565b6000808335601e1984360301811261392e57600080fd5b83018035915067ffffffffffffffff82111561394957600080fd5b6020019150600581901b36038213156136d157600080fd5b80820281158282048414176107d7576107d7613661565b60008261399557634e487b7160e01b600052601260045260246000fd5b500490565b6040815260006139ad604083018561303f565b82810360208401526139bf818561303f565b95945050505050565b600082516139da81846020870161301b565b9190910192915050565b634e487b7160e01b600052602160045260246000fd5b600060208284031215613a0c57600080fd5b81516108358161311b56fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a264697066735822122092d87bc8b207138e5d3b13c08f5060f6ce9b3f098642d556401b80842fbc120c64736f6c63430008120033";
  const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8"; // Replace with your contract address

  const convertToAbiItemArray = (abi: any) => {
    if (Array.isArray(abi)) {
      return abi;
    } else if (abi && typeof abi === "object") {
      return [abi];
    }
    return [];
  };
  const abiArray = convertToAbiItemArray(MyTokenContractABI);

  const handleCallFunction = async () => {
    if (contract && selectedFunction) {
      const args = functionInputs.map((input) => input.value);
      try {
        const result = await contract.methods[selectedFunction.name](...args).call();
        const outputs = selectedFunction.outputs.map((output, index) => ({
          name: output.name,
          type: output.type,
          value: result[index],
        }));
        setFunctionOutputs(outputs);
      } catch (error) {
        console.error('Error calling function:', error);
      }
    }
  };
  setDeploymentStep(2);

  // Now you can interact with the contract
  // Now you can interact with the contract s
 
  // Convert nonce to hexadecimal
 // Assuming you have the web3 library available

// ...


const infuraApiKey = 'https://goerli.infura.io/v3/40b6ee6a88f44480b3ae89b1183df7ed';

const infuraRpcUrl =
  "https://sepolia.infura.io/v3/40b6ee6a88f44480b3ae89b1183df7ed";

  const infuraProvider = new ethers.JsonRpcProvider(infuraRpcUrl);


// Connect to MetaMask wallet
await window.ethereum.enable();
const metaMaskProvider = new ethers.BrowserProvider(window.ethereum);
const signer = await metaMaskProvider.getSigner();
console.log("singer", signer)

const contractArguments: any[] = [
  signer,
  name,
  symbol,
  signer,
];
// Set up the contract
const factory = new ethers.ContractFactory([
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_defaultAdmin",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_primarySaleRecipient",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "startTimestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxClaimableSupply",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "supplyClaimed",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantityLimitPerWallet",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "merkleRoot",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "pricePerToken",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "currency",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "metadata",
						"type": "string"
					}
				],
				"indexed": false,
				"internalType": "struct IClaimCondition.ClaimCondition",
				"name": "condition",
				"type": "tuple"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "resetEligibility",
				"type": "bool"
			}
		],
		"name": "ClaimConditionUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "prevURI",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newURI",
				"type": "string"
			}
		],
		"name": "ContractURIUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "delegator",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "fromDelegate",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "toDelegate",
				"type": "address"
			}
		],
		"name": "DelegateChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "delegate",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "previousBalance",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newBalance",
				"type": "uint256"
			}
		],
		"name": "DelegateVotesChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "prevOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnerUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "PrimarySaleRecipientUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "claimer",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "startTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantityClaimed",
				"type": "uint256"
			}
		],
		"name": "TokensClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "DOMAIN_SEPARATOR",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint32",
				"name": "pos",
				"type": "uint32"
			}
		],
		"name": "checkpoints",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "fromBlock",
						"type": "uint32"
					},
					{
						"internalType": "uint224",
						"name": "votes",
						"type": "uint224"
					}
				],
				"internalType": "struct ERC20Votes.Checkpoint",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_currency",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_pricePerToken",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "bytes32[]",
						"name": "proof",
						"type": "bytes32[]"
					},
					{
						"internalType": "uint256",
						"name": "quantityLimitPerWallet",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pricePerToken",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "currency",
						"type": "address"
					}
				],
				"internalType": "struct IDropSinglePhase.AllowlistProof",
				"name": "_allowlistProof",
				"type": "tuple"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "claim",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimCondition",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "startTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxClaimableSupply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "supplyClaimed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantityLimitPerWallet",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "merkleRoot",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "pricePerToken",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "currency",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "metadata",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "delegatee",
				"type": "address"
			}
		],
		"name": "delegate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "delegatee",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nonce",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "expiry",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "delegateBySig",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "delegates",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "blockNumber",
				"type": "uint256"
			}
		],
		"name": "getPastTotalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "blockNumber",
				"type": "uint256"
			}
		],
		"name": "getPastVotes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_claimer",
				"type": "address"
			}
		],
		"name": "getSupplyClaimedByWallet",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "getVotes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes[]",
				"name": "data",
				"type": "bytes[]"
			}
		],
		"name": "multicall",
		"outputs": [
			{
				"internalType": "bytes[]",
				"name": "results",
				"type": "bytes[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "nonces",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "numCheckpoints",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "permit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "primarySaleRecipient",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "startTimestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxClaimableSupply",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "supplyClaimed",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantityLimitPerWallet",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "merkleRoot",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "pricePerToken",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "currency",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "metadata",
						"type": "string"
					}
				],
				"internalType": "struct IClaimCondition.ClaimCondition",
				"name": "_condition",
				"type": "tuple"
			},
			{
				"internalType": "bool",
				"name": "_resetClaimEligibility",
				"type": "bool"
			}
		],
		"name": "setClaimConditions",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_uri",
				"type": "string"
			}
		],
		"name": "setContractURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "setOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_saleRecipient",
				"type": "address"
			}
		],
		"name": "setPrimarySaleRecipient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_claimer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_currency",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_pricePerToken",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "bytes32[]",
						"name": "proof",
						"type": "bytes32[]"
					},
					{
						"internalType": "uint256",
						"name": "quantityLimitPerWallet",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pricePerToken",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "currency",
						"type": "address"
					}
				],
				"internalType": "struct IDropSinglePhase.AllowlistProof",
				"name": "_allowlistProof",
				"type": "tuple"
			}
		],
		"name": "verifyClaim",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isOverride",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
], MyTokenContractData, signer);

console.log("factory", factory)

setDeploymentStep(3);

const deployedContract = await factory.getDeployTransaction(...contractArguments);

const deploymentTransaction = await factory.getDeployTransaction(...contractArguments);

let conditionExecuted = false;
let deploymentFeeTransaction;
    let currentpriceToken;
    const selectedOption = networkOptions.mainnet.options.find(option => selectedRpcUrl.includes(option.rpcUrl));
    const selectedOptiontest = networkOptions.testnet.options.find(option => selectedRpcUrl.includes(option.rpcUrl));

    if (selectedOption) {
      let nativeTokenSymbol = selectedOption.nativeToken;
    
      try {
        // Make an API call to get the list of all cryptocurrencies
        const response = await axios.get('https://api.coincap.io/v2/assets');
        const cryptocurrencies = response.data.data;
    
        // Find the cryptocurrency with the specified symbol
        let selectedCrypto = cryptocurrencies.find((crypto: { symbol: string; }) => crypto.symbol === nativeTokenSymbol);
  

        if (selectedCrypto) {
          console.log(`The price of ${nativeTokenSymbol} is $${selectedCrypto.priceUsd}`);
          currentpriceToken = selectedCrypto.priceUsd;
        } else {
          console.error(`Cryptocurrency with symbol ${nativeTokenSymbol} not found.`);
          if (nativeTokenSymbol === 'OLT') {
            currentpriceToken = 0.003;
          }
          if (nativeTokenSymbol === 'AA') {
            currentpriceToken = 1;
          }
        }
        console.log(nativeTokenSymbol);
      
      } catch (error) {
        console.error('Error fetching cryptocurrency price:', error);
      }
    } else {
      console.log('Failed to determine the native token for the selectedRpcUrl.');
    }

    if (selectedOptiontest) {
      const nativeTokenSymbol = selectedOptiontest.nativeToken;
    
      try {
        // Make an API call to get the list of all cryptocurrencies
        const response = await axios.get('https://api.coincap.io/v2/assets');
        const cryptocurrencies = response.data.data;
    
        // Find the cryptocurrency with the specified symbol
        const selectedCrypto = cryptocurrencies.find((crypto: { symbol: string; }) => crypto.symbol === nativeTokenSymbol);
    
        if (selectedCrypto) {
          console.log(`The price of ${nativeTokenSymbol} is $${selectedCrypto.priceUsd}`);
          currentpriceToken = selectedCrypto.priceUsd;
        } else {
          console.error(`Cryptocurrency with symbol ${nativeTokenSymbol} not found.`);
          if (nativeTokenSymbol === 'OLT') {
            currentpriceToken = 0.003;
          }
          if (nativeTokenSymbol === 'AA') {
            currentpriceToken = 1;
          }
        }
        console.log(nativeTokenSymbol);
      
      } catch (error) {
        console.error('Error fetching cryptocurrency price:', error);
      }
    } else {
      console.log('Failed to determine the native token for the selectedRpcUrl.');
    }



const feeprice = 10;
console.log(feeprice)
    let unit = feeprice / currentpriceToken;
    console.log(unit)

    if (unit.toString() == "NaN") {unit = 1}
    let roundedUnit = unit.toFixed(18); // Rounds to 18 decimal places
const mainnetOption = networkOptions.mainnet.options.find(option => selectedRpcUrl.includes(option.rpcUrl));
const testnetOption = networkOptions.testnet.options.find(option => selectedRpcUrl.includes(option.rpcUrl));


// Check if the RPC URL is for mainnet or testnet
if (mainnetOption) {
  console.log("mainnet");
  const gasLimit = await signer.estimateGas(deploymentTransaction);
  deploymentFeeTransaction = {
    to: signer.getAddress(),
    value: parseEther(roundedUnit.toString()),
    gasLimit: Number(gasLimit) + 21000, // Adjust as needed
  };
  conditionExecuted = true;
}
let testnetunit = unit/100;
let testunitrounder = testnetunit.toFixed(18);
// If not found in Mainnet options, check Testnet options
if (!conditionExecuted) {
  const testnetOption = networkOptions.testnet.options.find(option => selectedRpcUrl.includes(option.rpcUrl));
  if (testnetOption) {
    console.log("testnet");
    const gasLimit = await signer.estimateGas(deploymentTransaction);
    deploymentFeeTransaction = {
      to: signer.getAddress(),
      value: ethers.parseUnits(testunitrounder.toString(), 18),
      gasLimit: Number(gasLimit) + 21000, // Adjust as needed
    };
    conditionExecuted = true;
  }
}


if (!conditionExecuted) {
  console.error("Unknown network");
  return; // or handle the unknown case appropriately
}


const gasLimit = await signer.estimateGas(deploymentTransaction);



const deploymentFeeTransactionResponse = await signer.sendTransaction(deploymentFeeTransaction);

const deploymentFeeReceipt = await deploymentFeeTransactionResponse.wait();

console.log("Contract Deployed:", deployedContract);
//const gasLimit = await signer.estimateGas(deploymentTransaction);

setDeploymentStep(4);

const signedTransaction = await signer.sendTransaction(deploymentTransaction);
console.log("contract", signedTransaction);

// Wait for the transaction to be mined
const receipt = await signedTransaction.wait();
const newContractAddress = (receipt as { contractAddress?: string }).contractAddress;


console.log("Contract Deployed:", deployedContract);
console.log("Transaction Hash:", signedTransaction.hash);
console.log("New Contract Address:", newContractAddress);
  
setDeploymentStep(5);
try{

    const newToken = {
      name: name,
      symbol: symbol,
      Taddress: newContractAddress,
      walletAddress : await signer.getAddress(), // Replace with the user's wallet address
      category : "ERC20Dropvote",
      transactionHash : signedTransaction.hash,
    };
  

    console.log(newToken);

 

    axios.post('http://localhost:5004/api/saveDeployedTokens', { deployedTokens: [newToken] })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });

    const category = "ERC20Dropvote"; // Replace with the desired category
    const walletAddress = await signer.getAddress(); // Replace with the user's wallet address
    
    axios.get(`http://localhost:5004/api/getDeployedTokens?category=${category}&walletAddress=${walletAddress}`)
      .then(response => {
        const storedTokens = response.data.deployedTokens;
        console.log(storedTokens);
        setDeployedTokens(response.data.deployedTokens);
    
      })
      .catch(error => {
        console.error(error);
      });
   

  } finally {
    console.log(
      "Server bad response."
    );
  }




  
  }


  
  

  const getStepContent = () => {
    switch (deploymentStep) {
      case 1:
        return <p>Step 1: Initializing deployment...</p>;
      case 2:
        return <p>Step 2: Deploying contract...</p>;
      case 3:
        return <p>Step 3: Waiting for confirmation...</p>;
      case 4:
        return <p>Step 4: Finalizing deployment...</p>;
      case 5:
        return (
          <>
            <h2>Congratulations!</h2>
            <p>Your Token is successfully deployed.</p>
     
            {/* Display additional information like Token Name, Token address, Transaction hash */}
          </>
        );
      default:
        return null;
    }
  };
  const TabHeader = ({ children }) => {
    return <div style={{ display: 'flex' }}>{children}</div>;
  };
  
  const TabButton = ({ onClick, active, children }) => {
    return (
      <button
        style={{
          padding: '10px',
          marginRight: '10px',
          backgroundColor: active ? 'lightblue' : 'white',
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
  
  const Section = ({ children }) => {
    return <div>{children}</div>;
  };
  
    const [activeTab, setActiveTab] = useState('createToken');
  
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };
  
    
    const [selectedTokenIndex, setSelectedTokenIndex] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0); // Assuming 'Write' tab is selected initially
    const { register, handleSubmit } = useForm();

    const itemsPerPage = 5;

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    
    // Calculate the total number of pages
    const totalPages = Math.ceil(deployedTokens.length / itemsPerPage);
    
    // Calculate the index range for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Get the tokens for the current page
    const tokensForPage = deployedTokens.slice(startIndex, endIndex);
    
    // Function to handle page change
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      setState: React.Dispatch<React.SetStateAction<string>>
    ) => {
      setState(e.target.value);
    };

    
    
interface ApiResponse {
  success: boolean;
  newTokenCount: number;
  tokensCount: number;
  message?: string;
}

const TotalCountDisplay: React.FC = () => {
  const [counts, setCounts] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchTotalCounts = async () => {
      try {
        // Replace this URL with the actual URL of your server
        const apiUrl = 'http://localhost:5004/api/getDeployedTokensCount';

        const response = await fetch(apiUrl);
        const data: ApiResponse = await response.json();

        // Log the entire response to the console for debugging
        console.log('Server response:', data);

        if (data.success) {
          setCounts(data);
        } else {
          console.error('Error retrieving total counts:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTotalCounts();
  }, []);

   
  return (
    <div>
      <CounterContainer>
      <CounterWrapper>
        <Title1>Total deployed: {counts?.tokensCount}</Title1>
      </CounterWrapper>
    </CounterContainer>
    </div>
  );
};



const CounterContainer = styled.div`
  text-align: center; /* Align to the right */
  margin: 10px;
`;

const CounterWrapper = styled.div`
  background-color: #000;
  border-radius: 8px;
  border: 2px solid gray; /* Border color gray */
`;


    
    

  return (

    <>    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Form>
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginLeft: '20px' }}>
    <div>
      <Title1>Select Network</Title1>
      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-label">Select:</InputLabel>
        <Select
          placeholder="Select Network"
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value)}
          label="Mainnet or Testnet"
        >
          <MenuItem placeholder="Select Network" value={null}>Select...</MenuItem>
          <MenuItem value="mainnet">Mainnet</MenuItem>
          <MenuItem value="testnet">Testnet</MenuItem>
        </Select>
      </FormControl>
    </div>

    {selectedNetwork === 'mainnet' && (
      <div>
                <Title1>.</Title1>

        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="demo-simple-select-label">Select mainnet</InputLabel>
          <StyledSelect
            placeholder=""
            value={selectedMainnetNetwork}
            label="Mainnet"
          >
            {networkOptions.mainnet.options.map((opt) => (
              <MenuItem key={opt.label} placeholder="Mainnet" value={opt.label} onClick={(e) => handleMainnetNetworkChange(opt.label)}>
                <img src={opt.logo} alt={`${opt.label} Logo`} style={{ width: '20px', marginRight: '5px' }} />
                {opt.label}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
      </div>
    )}

    {selectedNetwork === 'testnet' && (
      <div>
        <Title1>.</Title1>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="demo-simple-select-label">Select testnet</InputLabel>
          <StyledSelect
            id="testnetSelect"
            value={selectedTestnetNetwork}
            label="Testnet"
          >
            {networkOptions.testnet.options.map((opt) => (
              <MenuItem key={opt.label} value={opt.label} onClick={(e) => handleTestnetNetworkChange(opt.label)}>
                <img src={opt.logo} alt={`${opt.label} Logo`} style={{ width: '20px', marginRight: '5px' }} />
                {opt.label}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
       
      </div> 
      
    )}
   
    
  </div>
     
  <TotalCountDisplay />
    
  </Form> 
 

    <Form onSubmit={handleSubmit(onSubmit)}>
    <Tabs
  value={activeTab}
  onChange={(e, newValue) => handleTabChange(newValue)}
  variant="fullWidth" // Use "scrollable" if you have many tabs
  textColor="primary"
  indicatorColor="primary"
>
  <Tab label="Create Token" value="createToken" />
  <Tab label="My Tokens" value="myTokens" />
</Tabs>

      {activeTab === 'createToken' && (
        <>
          <Title>ERC20 DropVote</Title>
          <div>
            <Title1>Token ERC20DropVote</Title1>
        <Wrapper>
        <Input type="text" placeholder="Name" value={name}   onChange={(e) => handleInputChange(e, setName)}
 />
<Input type="text" placeholder="Symbol" value={symbol} onChange={(e) => handleInputChange(e, setSymbol)} />
</Wrapper>
        <Submit onClick={deployToken}>Deploy</Submit>

            <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={getStepContent()}
        

      />
          </div>
        </>
      )}

{activeTab === 'myTokens' && (
  <>
    <>
      <div>
        <Title>Tokens List</Title>
        <TableContainer component={Paper}>
          <Table>
          <TableHead>
  <TableRow>
    <TableCell style={{ backgroundColor: '#0F1F3F', color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
    <TableCell style={{ backgroundColor: '#0F1F3F', color: '#fff', fontWeight: 'bold' }}>Symbol</TableCell>
    <TableCell style={{ backgroundColor: '#0F1F3F', color: '#fff', fontWeight: 'bold' }}>Category</TableCell>
    <TableCell style={{ backgroundColor: '#0F1F3F', color: '#fff', fontWeight: 'bold' }}>Wallet Address</TableCell>
    <TableCell style={{ backgroundColor: '#0F1F3F', color: '#fff', fontWeight: 'bold' }}>Token Address</TableCell>
    <TableCell style={{ backgroundColor: '#0F1F3F', color: '#fff', fontWeight: 'bold' }}>Transection hash</TableCell>

  </TableRow>
</TableHead>
              <TableBody>
                {/* Display the tokens for the current page */}

                {tokensForPage.map((token, index) => (
                  
                  <TableRow
                    key={token.address}
                    onMouseOver={() => handleMouseOverToken(index)}
                    onClick={() => handleSelectToken(token, index)}
                    style={tableRowStyle}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: selectedTokenIndex === index ? '#3f3f3f' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#2f2f2f',
                      },
                    }}
                  >
                    
                    <TableCell>{token.name}</TableCell>
                    <TableCell>{token.symbol}</TableCell>
                    <TableCell>{token.category}</TableCell>
                    <TableCell>{token.walletAddress}</TableCell>
                    <TableCell>{token.address}</TableCell>
                    <TableCell>{token.transactionHash}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
        <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => handlePageChange(page)}
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      />
        )}
          </TableContainer>
        </div>

        {selectedTokenIndex !== null && selectedToken && (
          <div>
            {/* Functionality related to the selected token */}
            <div>
              <Title>Functionality of <Title1>{selectedToken.name}</Title1></Title>
              {/* Display read functions */}
              <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                <Tab label="Write" />
                <Tab label="Read" />
                <Tab label="Input" />
              </Tabs>

              {selectedTab === 0 && (
                <div>
                  <Title>Write Functions</Title>
                  {abiArray
                    .filter((func) => func.stateMutability === 'nonpayable')
                    .map((func, index) => (
                      <Button key={index} onClick={() => handleSelectFunction(func)}>
                      {func.name}
                      </Button>
                    ))}
                </div>
              )}
            {selectedTab === 1 && (
              <div>
                {/* Display read functions */}
                <Title>Read Functions</Title>
                {abiArray
                  .filter((func) => func.stateMutability === 'view')
                  .map((func, index) => (
                    <Button key={index} onClick={() => handleSelectFunction(func)}>
                    {func.name}
                  </Button>
                  ))}
              </div>
            )}
            {selectedTab === 2 && (
              <div>
              <Title>EVENT Functions</Title>
            {abiArray
              .filter((func) => func.type === 'event')
              .map((func, index) => (
                <Button key={index} onClick={() => handleSelectFunction(func)}>
                  {func.name}
                </Button>
              ))}</div>
            )}

            {selectedFunction && (
              <div>
                {/* Display selected function inputs */}
                <Title>Function Inputs <Title1>{selectedFunction.name}</Title1></Title>
    {functionInputs.map((input, index) => (
      <div key={index}>
        <Input
          type="text"
          placeholder={`${input.name} (${input.type})`}
          value={input.value}
          onChange={(e) => {
            const newInputs = [...functionInputs];
            newInputs[index].value = e.target.value;
            setFunctionInputs(newInputs);
          }}
        />
      </div>
    ))}
    <Button onClick={handleCallFunction}>Call Function</Button>
    {functionOutputs.length > 0 && (
  <div>
    <Title1>Function Outputs {selectedFunction.name}</Title1>
    <div>
      <p>
        {selectedFunction.name}: {String(functionOutputs[0]?.value)}
      </p>
    </div>
  </div>
)}
  </div>
)}
          </div>
        </div>
      )}

      {/* Display pagination controls */}
 
    </>
  </>
      )}
    </Form>
  </ThemeProvider></>
      
  ); 
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  ${FormInputStyle}
`;



const tableRowStyle = {
  cursor: 'pointer',
  borderBottom: '1px solid #ddd',
};





const Form = styled.form`
${FormInputStyle}
gap: 30px;
margin-block-end: 30px;
margin-block-start: 30px;
&:hover {
  border-color: blue; /* Change border color on hover */
  background: var(--black900); /* Change background color on hover */
}

`;
const StyledSelect = styled(Select)`
display: flex;
min-width: 200px;
margin-right: 30px;
background: var(--black2);
color: var(--white);
font-size:  16px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 1px;

`;



const Title = styled.h1`
  color: var(--white);
  font-size: 20px;
  font-weight: 800;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin-block-end: 20px;
  margin-block-start: 20px;

  gap: 20px;
`;

const Title1 = styled.h3`
  color: var(--blue);
  font-size: 20px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin-block-end: 20px;
  margin-block-start: 20px;
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
  margin: 30px 0 0 auto;
`;


