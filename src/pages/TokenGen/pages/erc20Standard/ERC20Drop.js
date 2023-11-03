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
import MyTokenContractABI from "./ABIerc20Vote.json";
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
  const abi = MyTokenContractABI;
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
    const category = "ERC20Vote"; // Replace with the desired category
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
    const category = "ERC20Vote"; // Replace with the desired category
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
    "6101006040527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c960e0908152503480156200003957600080fd5b50604051620065fb380380620065fb83398181016040528101906200005f9190620005e9565b828281818160059081620000749190620008e4565b508060069081620000869190620008e4565b5050504660a081815250503073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff1681525050620000d56200010a60201b60201c565b608081815250505050620000ef846200019860201b60201c565b62000100816200025e60201b60201c565b5050505062000ae8565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f6200013d6200035760201b60201c565b805190602001207fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc646306040516020016200017d95949392919062000a08565b60405160208183030381529060405280519060200120905090565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7660405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620002d0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002c79062000ac6565b60405180910390fd5b80600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff167f299d17e95023f496e0ffc4909cff1a61f74bb5eb18de6f900f4155bfa1b3b33360405160405180910390a250565b6060600580546200036890620006d3565b80601f01602080910402602001604051908101604052809291908181526020018280546200039690620006d3565b8015620003e75780601f10620003bb57610100808354040283529160200191620003e7565b820191906000526020600020905b815481529060010190602001808311620003c957829003601f168201915b5050505050905090565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620004328262000405565b9050919050565b620004448162000425565b81146200045057600080fd5b50565b600081519050620004648162000439565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620004bf8262000474565b810181811067ffffffffffffffff82111715620004e157620004e062000485565b5b80604052505050565b6000620004f6620003f1565b9050620005048282620004b4565b919050565b600067ffffffffffffffff82111562000527576200052662000485565b5b620005328262000474565b9050602081019050919050565b60005b838110156200055f57808201518184015260208101905062000542565b60008484015250505050565b6000620005826200057c8462000509565b620004ea565b905082815260208101848484011115620005a157620005a06200046f565b5b620005ae8482856200053f565b509392505050565b600082601f830112620005ce57620005cd6200046a565b5b8151620005e08482602086016200056b565b91505092915050565b60008060008060808587031215620006065762000605620003fb565b5b6000620006168782880162000453565b945050602085015167ffffffffffffffff8111156200063a576200063962000400565b5b6200064887828801620005b6565b935050604085015167ffffffffffffffff8111156200066c576200066b62000400565b5b6200067a87828801620005b6565b92505060606200068d8782880162000453565b91505092959194509250565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620006ec57607f821691505b602082108103620007025762000701620006a4565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200076c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200072d565b6200077886836200072d565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620007c5620007bf620007b98462000790565b6200079a565b62000790565b9050919050565b6000819050919050565b620007e183620007a4565b620007f9620007f082620007cc565b8484546200073a565b825550505050565b600090565b6200081062000801565b6200081d818484620007d6565b505050565b5b8181101562000845576200083960008262000806565b60018101905062000823565b5050565b601f82111562000894576200085e8162000708565b62000869846200071d565b8101602085101562000879578190505b6200089162000888856200071d565b83018262000822565b50505b505050565b600082821c905092915050565b6000620008b96000198460080262000899565b1980831691505092915050565b6000620008d48383620008a6565b9150826002028217905092915050565b620008ef8262000699565b67ffffffffffffffff8111156200090b576200090a62000485565b5b620009178254620006d3565b6200092482828562000849565b600060209050601f8311600181146200095c576000841562000947578287015190505b620009538582620008c6565b865550620009c3565b601f1984166200096c8662000708565b60005b8281101562000996578489015182556001820191506020850194506020810190506200096f565b86831015620009b65784890151620009b2601f891682620008a6565b8355505b6001600288020188555050505b505050505050565b6000819050919050565b620009e081620009cb565b82525050565b620009f18162000790565b82525050565b62000a028162000425565b82525050565b600060a08201905062000a1f6000830188620009d5565b62000a2e6020830187620009d5565b62000a3d6040830186620009d5565b62000a4c6060830185620009e6565b62000a5b6080830184620009f7565b9695505050505050565b600082825260208201905092915050565b7f496e76616c696420726563697069656e74000000000000000000000000000000600082015250565b600062000aae60118362000a65565b915062000abb8262000a76565b602082019050919050565b6000602082019050818103600083015262000ae18162000a9f565b9050919050565b60805160a05160c05160e051615ad962000b2260003960006113b1015260006108f40152600061094a015260006109730152615ad96000f3fe6080604052600436106101b75760003560e01c806379cc6790116100ec578063a9059cbb1161008a578063d637ed5911610064578063d637ed5914610649578063dd62ed3e1461067b578063e8a3d485146106b8578063eec8897c146106e3576101b7565b8063a9059cbb146105a6578063ac9650d8146105e3578063d505accf14610620576101b7565b80638da5cb5b116100c65780638da5cb5b146104ea578063938e3d7b1461051557806395d89b411461053e578063a457c2d714610569576101b7565b806379cc6790146104685780637ecebe001461049157806384bb1e42146104ce576101b7565b806335b65e1f11610159578063426cfaf311610133578063426cfaf3146103b057806342966c68146103d95780636f4f28371461040257806370a082311461042b576101b7565b806335b65e1f1461030b5780633644e515146103485780633950935114610373576101b7565b806313af40351161019557806313af40351461024f57806318160ddd1461027857806323b872dd146102a3578063313ce567146102e0576101b7565b806306fdde03146101bc578063079fe40e146101e7578063095ea7b314610212575b600080fd5b3480156101c857600080fd5b506101d1610720565b6040516101de91906134d3565b60405180910390f35b3480156101f357600080fd5b506101fc6107b2565b6040516102099190613536565b60405180910390f35b34801561021e57600080fd5b50610239600480360381019061023491906135c7565b6107dc565b6040516102469190613622565b60405180910390f35b34801561025b57600080fd5b506102766004803603810190610271919061363d565b6107ff565b005b34801561028457600080fd5b5061028d610852565b60405161029a9190613679565b60405180910390f35b3480156102af57600080fd5b506102ca60048036038101906102c59190613694565b61085c565b6040516102d79190613622565b60405180910390f35b3480156102ec57600080fd5b506102f561088b565b6040516103029190613703565b60405180910390f35b34801561031757600080fd5b50610332600480360381019061032d919061363d565b610894565b60405161033f9190613679565b60405180910390f35b34801561035457600080fd5b5061035d6108f0565b60405161036a9190613737565b60405180910390f35b34801561037f57600080fd5b5061039a600480360381019061039591906135c7565b6109a7565b6040516103a79190613622565b60405180910390f35b3480156103bc57600080fd5b506103d760048036038101906103d291906137a3565b610a51565b005b3480156103e557600080fd5b5061040060048036038101906103fb91906137ff565b610cd9565b005b34801561040e57600080fd5b506104296004803603810190610424919061363d565b610d31565b005b34801561043757600080fd5b50610452600480360381019061044d919061363d565b610d84565b60405161045f9190613679565b60405180910390f35b34801561047457600080fd5b5061048f600480360381019061048a91906135c7565b610dcd565b005b34801561049d57600080fd5b506104b860048036038101906104b3919061363d565b610e9e565b6040516104c59190613679565b60405180910390f35b6104e860048036038101906104e39190613980565b610eee565b005b3480156104f657600080fd5b506104ff611042565b60405161050c9190613536565b60405180910390f35b34801561052157600080fd5b5061053c60048036038101906105379190613ae6565b61106c565b005b34801561054a57600080fd5b506105536110bf565b60405161056091906134d3565b60405180910390f35b34801561057557600080fd5b50610590600480360381019061058b91906135c7565b611151565b60405161059d9190613622565b60405180910390f35b3480156105b257600080fd5b506105cd60048036038101906105c891906135c7565b61123b565b6040516105da9190613622565b60405180910390f35b3480156105ef57600080fd5b5061060a60048036038101906106059190613b8f565b61125e565b6040516106179190613cf3565b60405180910390f35b34801561062c57600080fd5b5061064760048036038101906106429190613d6d565b61136a565b005b34801561065557600080fd5b5061065e6114b4565b604051610672989796959493929190613e0f565b60405180910390f35b34801561068757600080fd5b506106a2600480360381019061069d9190613e94565b611592565b6040516106af9190613679565b60405180910390f35b3480156106c457600080fd5b506106cd611619565b6040516106da91906134d3565b60405180910390f35b3480156106ef57600080fd5b5061070a60048036038101906107059190613ed4565b6116a7565b6040516107179190613622565b60405180910390f35b60606005805461072f90613f9a565b80601f016020809104026020016040519081016040528092919081815260200182805461075b90613f9a565b80156107a85780601f1061077d576101008083540402835291602001916107a8565b820191906000526020600020905b81548152906001019060200180831161078b57829003601f168201915b5050505050905090565b6000600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000806107e7611b74565b90506107f4818585611b7c565b600191505092915050565b610807611d45565b610846576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161083d90614017565b60405180910390fd5b61084f81611d82565b50565b6000600454905090565b600080610867611b74565b9050610874858285611e48565b61087f858585611ed4565b60019150509392505050565b60006012905090565b600060126000601154815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1614801561096c57507f000000000000000000000000000000000000000000000000000000000000000046145b15610999577f000000000000000000000000000000000000000000000000000000000000000090506109a4565b6109a1612156565b90505b90565b6000806109b2611b74565b9050610a46818585600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610a419190614066565b611b7c565b600191505092915050565b610a596121da565b610a98576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a8f90614017565b60405180910390fd5b60006011549050600060096002015490508215610ae65760009050610abb612217565b43604051602001610acd929190614103565b6040516020818303038152906040528051906020012091505b8360200135811115610b2d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b249061417b565b60405180910390fd5b604051806101000160405280856000013581526020018560200135815260200182815260200185606001358152602001856080013581526020018560a0013581526020018560c0016020810190610b84919061363d565b73ffffffffffffffffffffffffffffffffffffffff168152602001858060e00190610baf91906141aa565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050508152506009600082015181600001556020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060e0820151816007019081610c8f91906143b9565b50905050816011819055507f6dab9d7d05d468100139089b2516cb8ff286c3972ff070d3b509e371f0d0d4b88484604051610ccb92919061469f565b60405180910390a150505050565b80610ce333610d84565b1015610d24576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d1b9061471b565b60405180910390fd5b610d2e338261221f565b50565b610d396123f7565b610d78576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d6f90614017565b60405180910390fd5b610d8181612434565b50565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610dd561252a565b610e14576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e0b90614787565b60405180910390fd5b80610e1e83610d84565b1015610e5f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e569061471b565b60405180910390fd5b600081610e6c8433611592565b610e7691906147a7565b9050610e8483336000611b7c565b610e8f833383611b7c565b610e99838361221f565b505050565b6000610ee7600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020612567565b9050919050565b610efc868686868686612575565b60006011549050610f17610f0e612217565b878787876116a7565b508560096002016000828254610f2d9190614066565b9250508190555085601260008381526020019081526020016000206000610f52612217565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610f9b9190614066565b92505081905550610faf600087878761257d565b6000610fbb8888612729565b9050808873ffffffffffffffffffffffffffffffffffffffff16610fdd612217565b73ffffffffffffffffffffffffffffffffffffffff167fff097c7d8b1957a4ff09ef1361b5fb54dcede3941ba836d0beb9d10bec725de68a6040516110229190613679565b60405180910390a461103888888888888861273f565b5050505050505050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b611074612747565b6110b3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110aa90614017565b60405180910390fd5b6110bc81612784565b50565b6060600680546110ce90613f9a565b80601f01602080910402602001604051908101604052809291908181526020018280546110fa90613f9a565b80156111475780601f1061111c57610100808354040283529160200191611147565b820191906000526020600020905b81548152906001019060200180831161112a57829003601f168201915b5050505050905090565b60008061115c611b74565b90506000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905083811015611222576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112199061484d565b60405180910390fd5b61122f8286868403611b7c565b60019250505092915050565b600080611246611b74565b9050611253818585611ed4565b600191505092915050565b60608282905067ffffffffffffffff81111561127d5761127c613855565b5b6040519080825280602002602001820160405280156112b057816020015b606081526020019060019003908161129b5790505b50905060005b8383905081101561136357611332308585848181106112d8576112d761486d565b5b90506020028101906112ea919061489c565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505061285f565b8282815181106113455761134461486d565b5b6020026020010181905250808061135b906148ff565b9150506112b6565b5092915050565b834211156113ad576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113a490614993565b60405180910390fd5b60007f00000000000000000000000000000000000000000000000000000000000000008888886113dc8c61288c565b896040516020016113f2969594939291906149b3565b604051602081830303815290604052805190602001209050600061141d6114176108f0565b836128ea565b9050600061142d8287878761292b565b90508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461149d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161149490614a60565b60405180910390fd5b6114a88a8a8a611b7c565b50505050505050505050565b60098060000154908060010154908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600701805461150f90613f9a565b80601f016020809104026020016040519081016040528092919081815260200182805461153b90613f9a565b80156115885780601f1061155d57610100808354040283529160200191611588565b820191906000526020600020905b81548152906001019060200180831161156b57829003601f168201915b5050505050905088565b6000600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6000805461162690613f9a565b80601f016020809104026020016040519081016040528092919081815260200182805461165290613f9a565b801561169f5780601f106116745761010080835404028352916020019161169f565b820191906000526020600020905b81548152906001019060200180831161168257829003601f168201915b505050505081565b6000806009604051806101000160405290816000820154815260200160018201548152602001600282015481526020016003820154815260200160048201548152602001600582015481526020016006820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160078201805461175a90613f9a565b80601f016020809104026020016040519081016040528092919081815260200182805461178690613f9a565b80156117d35780601f106117a8576101008083540402835291602001916117d3565b820191906000526020600020905b8154815290600101906020018083116117b657829003601f168201915b505050505081525050905060008160600151905060008260a00151905060008360c0015190506000801b8460800151146118b1576118ab86806000019061181a9190614a80565b80806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505085608001518c89602001358a604001358b606001602081019061187d919061363d565b6040516020016118909493929190614ae3565b60405160208183030381529060405280519060200120612956565b50809550505b841561199e5760008660200135036118c957826118cf565b85602001355b92507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8660400135036119025781611908565b85604001355b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86604001351415801561197d5750600073ffffffffffffffffffffffffffffffffffffffff16866060016020810190611964919061363d565b73ffffffffffffffffffffffffffffffffffffffff1614155b611987578061199b565b85606001602081019061199a919061363d565b5b90505b600060126000601154815260200190815260200160002060008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508173ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff16141580611a305750828814155b15611a70576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a6790614b7d565b60405180910390fd5b60008a1480611a89575083818b611a879190614066565b115b15611ac9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ac090614be9565b60405180910390fd5b84602001518a8660400151611ade9190614066565b1115611b1f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b1690614c55565b60405180910390fd5b4285600001511115611b66576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b5d90614cc1565b60405180910390fd5b505050505095945050505050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603611beb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611be290614d53565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611c5a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c5190614de5565b60405180910390fd5b80600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051611d389190613679565b60405180910390a3505050565b6000611d4f611042565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7660405160405180910390a35050565b6000611e548484611592565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114611ece5781811015611ec0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611eb790614e51565b60405180910390fd5b611ecd8484848403611b7c565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603611f43576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611f3a90614ee3565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611fb2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611fa990614f75565b60405180910390fd5b611fbd838383612a32565b6000600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015612044576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161203b90615007565b60405180910390fd5b818103600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546120d99190614066565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161213d9190613679565b60405180910390a3612150848484612a37565b50505050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f612181610720565b805190602001207fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc646306040516020016121bf959493929190615027565b60405160208183030381529060405280519060200120905090565b60006121e4611042565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361228e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612285906150ec565b60405180910390fd5b61229a82600083612a32565b6000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015612321576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016123189061517e565b60405180910390fd5b818103600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816004600082825461237991906147a7565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516123de9190613679565b60405180910390a36123f283600084612a37565b505050565b6000612401611042565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036124a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161249a906151ea565b60405180910390fd5b80600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff167f299d17e95023f496e0ffc4909cff1a61f74bb5eb18de6f900f4155bfa1b3b33360405160405180910390a250565b6000612534611042565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b600081600001549050919050565b505050505050565b600081036125cd57600034146125c8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016125bf90615256565b60405180910390fd5b612723565b6000670de0b6b3a764000082856125e49190615276565b6125ee91906152e7565b905060008111612633576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161262a90615364565b60405180910390fd5b600073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff160361268657813414905061268d565b6000341490505b806126cd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016126c4906153d0565b60405180910390fd5b60008073ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff16146127085786612711565b6127106107b2565b5b905061271f85338386612a3c565b5050505b50505050565b60006127358383612aaf565b6000905092915050565b505050505050565b6000612751611042565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b600080805461279290613f9a565b80601f01602080910402602001604051908101604052809291908181526020018280546127be90613f9a565b801561280b5780601f106127e05761010080835404028352916020019161280b565b820191906000526020600020905b8154815290600101906020018083116127ee57829003601f168201915b50505050509050816000908161282191906143b9565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a1681836040516128539291906153f0565b60405180910390a15050565b60606128848383604051806060016040528060278152602001615a7d60279139612c0f565b905092915050565b600080600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506128d981612567565b91506128e481612cdc565b50919050565b60006040517f190100000000000000000000000000000000000000000000000000000000000081528360028201528260228201526042812091505092915050565b600080600061293c87878787612cf2565b9150915061294981612dd4565b8192505050949350505050565b60008060008390506000805b8751811015612a1f576002826129789190615276565b9150600088828151811061298f5761298e61486d565b5b602002602001015190508084116129d05783816040516020016129b3929190615448565b604051602081830303815290604052805190602001209350612a0b565b80846040516020016129e3929190615448565b604051602081830303815290604052805190602001209350600183612a089190614066565b92505b508080612a17906148ff565b915050612962565b5085821481935093505050935093915050565b505050565b505050565b6000810315612aa95773eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603612a9b57612a968282612f3a565b612aa8565b612aa784848484612feb565b5b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603612b1e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612b15906154c0565b60405180910390fd5b612b2a60008383612a32565b8060046000828254612b3c9190614066565b9250508190555080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254612b929190614066565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051612bf79190613679565b60405180910390a3612c0b60008383612a37565b5050565b6060612c1a846130b7565b612c59576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612c5090615552565b60405180910390fd5b6000808573ffffffffffffffffffffffffffffffffffffffff1685604051612c8191906155ae565b600060405180830381855af49150503d8060008114612cbc576040519150601f19603f3d011682016040523d82523d6000602084013e612cc1565b606091505b5091509150612cd18282866130da565b925050509392505050565b6001816000016000828254019250508190555050565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08360001c1115612d2d576000600391509150612dcb565b600060018787878760405160008152602001604052604051612d5294939291906155c5565b6020604051602081039080840390855afa158015612d74573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603612dc257600060019250925050612dcb565b80600092509250505b94509492505050565b60006004811115612de857612de761560a565b5b816004811115612dfb57612dfa61560a565b5b0315612f375760016004811115612e1557612e1461560a565b5b816004811115612e2857612e2761560a565b5b03612e68576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612e5f90615685565b60405180910390fd5b60026004811115612e7c57612e7b61560a565b5b816004811115612e8f57612e8e61560a565b5b03612ecf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612ec6906156f1565b60405180910390fd5b60036004811115612ee357612ee261560a565b5b816004811115612ef657612ef561560a565b5b03612f36576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612f2d90615783565b60405180910390fd5b5b50565b60008273ffffffffffffffffffffffffffffffffffffffff1682604051612f60906157c9565b60006040518083038185875af1925050503d8060008114612f9d576040519150601f19603f3d011682016040523d82523d6000602084013e612fa2565b606091505b5050905080612fe6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612fdd9061582a565b60405180910390fd5b505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603156130b1573073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036130825761307d82828673ffffffffffffffffffffffffffffffffffffffff166131419092919063ffffffff16565b6130b0565b6130af8383838773ffffffffffffffffffffffffffffffffffffffff166131c7909392919063ffffffff16565b5b5b50505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b606083156130ea5782905061313a565b6000835111156130fd5782518084602001fd5b816040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161313191906134d3565b60405180910390fd5b9392505050565b6131c28363a9059cbb60e01b848460405160240161316092919061584a565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050613250565b505050565b61324a846323b872dd60e01b8585856040516024016131e893929190615873565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050613250565b50505050565b60006132b2826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff166133179092919063ffffffff16565b905060008151111561331257808060200190518101906132d291906158bf565b613311576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016133089061595e565b60405180910390fd5b5b505050565b6060613326848460008561332f565b90509392505050565b606082471015613374576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161336b906159f0565b60405180910390fd5b61337d856130b7565b6133bc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016133b390615a5c565b60405180910390fd5b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040516133e591906155ae565b60006040518083038185875af1925050503d8060008114613422576040519150601f19603f3d011682016040523d82523d6000602084013e613427565b606091505b50915091506134378282866130da565b92505050949350505050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561347d578082015181840152602081019050613462565b60008484015250505050565b6000601f19601f8301169050919050565b60006134a582613443565b6134af818561344e565b93506134bf81856020860161345f565b6134c881613489565b840191505092915050565b600060208201905081810360008301526134ed818461349a565b905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000613520826134f5565b9050919050565b61353081613515565b82525050565b600060208201905061354b6000830184613527565b92915050565b6000604051905090565b600080fd5b600080fd5b61356e81613515565b811461357957600080fd5b50565b60008135905061358b81613565565b92915050565b6000819050919050565b6135a481613591565b81146135af57600080fd5b50565b6000813590506135c18161359b565b92915050565b600080604083850312156135de576135dd61355b565b5b60006135ec8582860161357c565b92505060206135fd858286016135b2565b9150509250929050565b60008115159050919050565b61361c81613607565b82525050565b60006020820190506136376000830184613613565b92915050565b6000602082840312156136535761365261355b565b5b60006136618482850161357c565b91505092915050565b61367381613591565b82525050565b600060208201905061368e600083018461366a565b92915050565b6000806000606084860312156136ad576136ac61355b565b5b60006136bb8682870161357c565b93505060206136cc8682870161357c565b92505060406136dd868287016135b2565b9150509250925092565b600060ff82169050919050565b6136fd816136e7565b82525050565b600060208201905061371860008301846136f4565b92915050565b6000819050919050565b6137318161371e565b82525050565b600060208201905061374c6000830184613728565b92915050565b600080fd5b6000610100828403121561376e5761376d613752565b5b81905092915050565b61378081613607565b811461378b57600080fd5b50565b60008135905061379d81613777565b92915050565b600080604083850312156137ba576137b961355b565b5b600083013567ffffffffffffffff8111156137d8576137d7613560565b5b6137e485828601613757565b92505060206137f58582860161378e565b9150509250929050565b6000602082840312156138155761381461355b565b5b6000613823848285016135b2565b91505092915050565b60006080828403121561384257613841613752565b5b81905092915050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61388d82613489565b810181811067ffffffffffffffff821117156138ac576138ab613855565b5b80604052505050565b60006138bf613551565b90506138cb8282613884565b919050565b600067ffffffffffffffff8211156138eb576138ea613855565b5b6138f482613489565b9050602081019050919050565b82818337600083830152505050565b600061392361391e846138d0565b6138b5565b90508281526020810184848401111561393f5761393e613850565b5b61394a848285613901565b509392505050565b600082601f8301126139675761396661384b565b5b8135613977848260208601613910565b91505092915050565b60008060008060008060c0878903121561399d5761399c61355b565b5b60006139ab89828a0161357c565b96505060206139bc89828a016135b2565b95505060406139cd89828a0161357c565b94505060606139de89828a016135b2565b935050608087013567ffffffffffffffff8111156139ff576139fe613560565b5b613a0b89828a0161382c565b92505060a087013567ffffffffffffffff811115613a2c57613a2b613560565b5b613a3889828a01613952565b9150509295509295509295565b600067ffffffffffffffff821115613a6057613a5f613855565b5b613a6982613489565b9050602081019050919050565b6000613a89613a8484613a45565b6138b5565b905082815260208101848484011115613aa557613aa4613850565b5b613ab0848285613901565b509392505050565b600082601f830112613acd57613acc61384b565b5b8135613add848260208601613a76565b91505092915050565b600060208284031215613afc57613afb61355b565b5b600082013567ffffffffffffffff811115613b1a57613b19613560565b5b613b2684828501613ab8565b91505092915050565b600080fd5b600080fd5b60008083601f840112613b4f57613b4e61384b565b5b8235905067ffffffffffffffff811115613b6c57613b6b613b2f565b5b602083019150836020820283011115613b8857613b87613b34565b5b9250929050565b60008060208385031215613ba657613ba561355b565b5b600083013567ffffffffffffffff811115613bc457613bc3613560565b5b613bd085828601613b39565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600081519050919050565b600082825260208201905092915050565b6000613c2f82613c08565b613c398185613c13565b9350613c4981856020860161345f565b613c5281613489565b840191505092915050565b6000613c698383613c24565b905092915050565b6000602082019050919050565b6000613c8982613bdc565b613c938185613be7565b935083602082028501613ca585613bf8565b8060005b85811015613ce15784840389528151613cc28582613c5d565b9450613ccd83613c71565b925060208a01995050600181019050613ca9565b50829750879550505050505092915050565b60006020820190508181036000830152613d0d8184613c7e565b905092915050565b613d1e816136e7565b8114613d2957600080fd5b50565b600081359050613d3b81613d15565b92915050565b613d4a8161371e565b8114613d5557600080fd5b50565b600081359050613d6781613d41565b92915050565b600080600080600080600060e0888a031215613d8c57613d8b61355b565b5b6000613d9a8a828b0161357c565b9750506020613dab8a828b0161357c565b9650506040613dbc8a828b016135b2565b9550506060613dcd8a828b016135b2565b9450506080613dde8a828b01613d2c565b93505060a0613def8a828b01613d58565b92505060c0613e008a828b01613d58565b91505092959891949750929550565b600061010082019050613e25600083018b61366a565b613e32602083018a61366a565b613e3f604083018961366a565b613e4c606083018861366a565b613e596080830187613728565b613e6660a083018661366a565b613e7360c0830185613527565b81810360e0830152613e85818461349a565b90509998505050505050505050565b60008060408385031215613eab57613eaa61355b565b5b6000613eb98582860161357c565b9250506020613eca8582860161357c565b9150509250929050565b600080600080600060a08688031215613ef057613eef61355b565b5b6000613efe8882890161357c565b9550506020613f0f888289016135b2565b9450506040613f208882890161357c565b9350506060613f31888289016135b2565b925050608086013567ffffffffffffffff811115613f5257613f51613560565b5b613f5e8882890161382c565b9150509295509295909350565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680613fb257607f821691505b602082108103613fc557613fc4613f6b565b5b50919050565b7f4e6f7420617574686f72697a6564000000000000000000000000000000000000600082015250565b6000614001600e8361344e565b915061400c82613fcb565b602082019050919050565b6000602082019050818103600083015261403081613ff4565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061407182613591565b915061407c83613591565b925082820190508082111561409457614093614037565b5b92915050565b60008160601b9050919050565b60006140b28261409a565b9050919050565b60006140c4826140a7565b9050919050565b6140dc6140d782613515565b6140b9565b82525050565b6000819050919050565b6140fd6140f882613591565b6140e2565b82525050565b600061410f82856140cb565b60148201915061411f82846140ec565b6020820191508190509392505050565b7f6d617820737570706c7920636c61696d65640000000000000000000000000000600082015250565b600061416560128361344e565b91506141708261412f565b602082019050919050565b6000602082019050818103600083015261419481614158565b9050919050565b600080fd5b600080fd5b600080fd5b600080833560016020038436030381126141c7576141c661419b565b5b80840192508235915067ffffffffffffffff8211156141e9576141e86141a0565b5b602083019250600182023603831315614205576142046141a5565b5b509250929050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261426f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82614232565b6142798683614232565b95508019841693508086168417925050509392505050565b6000819050919050565b60006142b66142b16142ac84613591565b614291565b613591565b9050919050565b6000819050919050565b6142d08361429b565b6142e46142dc826142bd565b84845461423f565b825550505050565b600090565b6142f96142ec565b6143048184846142c7565b505050565b5b818110156143285761431d6000826142f1565b60018101905061430a565b5050565b601f82111561436d5761433e8161420d565b61434784614222565b81016020851015614356578190505b61436a61436285614222565b830182614309565b50505b505050565b600082821c905092915050565b600061439060001984600802614372565b1980831691505092915050565b60006143a9838361437f565b9150826002028217905092915050565b6143c282613443565b67ffffffffffffffff8111156143db576143da613855565b5b6143e58254613f9a565b6143f082828561432c565b600060209050601f8311600181146144235760008415614411578287015190505b61441b858261439d565b865550614483565b601f1984166144318661420d565b60005b8281101561445957848901518255600182019150602085019450602081019050614434565b868310156144765784890151614472601f89168261437f565b8355505b6001600288020188555050505b505050505050565b600061449a60208401846135b2565b905092915050565b6144ab81613591565b82525050565b60006144c06020840184613d58565b905092915050565b6144d18161371e565b82525050565b60006144e6602084018461357c565b905092915050565b6144f781613515565b82525050565b600080fd5b600080fd5b600080fd5b6000808335600160200384360303811261452957614528614507565b5b83810192508235915060208301925067ffffffffffffffff821115614551576145506144fd565b5b60018202360383131561456757614566614502565b5b509250929050565b600082825260208201905092915050565b600061458c838561456f565b9350614599838584613901565b6145a283613489565b840190509392505050565b600061010083016145c1600084018461448b565b6145ce60008601826144a2565b506145dc602084018461448b565b6145e960208601826144a2565b506145f7604084018461448b565b61460460408601826144a2565b50614612606084018461448b565b61461f60608601826144a2565b5061462d60808401846144b1565b61463a60808601826144c8565b5061464860a084018461448b565b61465560a08601826144a2565b5061466360c08401846144d7565b61467060c08601826144ee565b5061467e60e084018461450c565b85830360e0870152614691838284614580565b925050508091505092915050565b600060408201905081810360008301526146b981856145ad565b90506146c86020830184613613565b9392505050565b7f6e6f7420656e6f7567682062616c616e63650000000000000000000000000000600082015250565b600061470560128361344e565b9150614710826146cf565b602082019050919050565b60006020820190508181036000830152614734816146f8565b9050919050565b7f4e6f7420617574686f72697a656420746f206275726e2e000000000000000000600082015250565b600061477160178361344e565b915061477c8261473b565b602082019050919050565b600060208201905081810360008301526147a081614764565b9050919050565b60006147b282613591565b91506147bd83613591565b92508282039050818111156147d5576147d4614037565b5b92915050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b600061483760258361344e565b9150614842826147db565b604082019050919050565b600060208201905081810360008301526148668161482a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080833560016020038436030381126148b9576148b861419b565b5b80840192508235915067ffffffffffffffff8211156148db576148da6141a0565b5b6020830192506001820236038313156148f7576148f66141a5565b5b509250929050565b600061490a82613591565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361493c5761493b614037565b5b600182019050919050565b7f45524332305065726d69743a206578706972656420646561646c696e65000000600082015250565b600061497d601d8361344e565b915061498882614947565b602082019050919050565b600060208201905081810360008301526149ac81614970565b9050919050565b600060c0820190506149c86000830189613728565b6149d56020830188613527565b6149e26040830187613527565b6149ef606083018661366a565b6149fc608083018561366a565b614a0960a083018461366a565b979650505050505050565b7f45524332305065726d69743a20696e76616c6964207369676e61747572650000600082015250565b6000614a4a601e8361344e565b9150614a5582614a14565b602082019050919050565b60006020820190508181036000830152614a7981614a3d565b9050919050565b60008083356001602003843603038112614a9d57614a9c61419b565b5b80840192508235915067ffffffffffffffff821115614abf57614abe6141a0565b5b602083019250602082023603831315614adb57614ada6141a5565b5b509250929050565b6000614aef82876140cb565b601482019150614aff82866140ec565b602082019150614b0f82856140ec565b602082019150614b1f82846140cb565b60148201915081905095945050505050565b7f2150726963654f7243757272656e637900000000000000000000000000000000600082015250565b6000614b6760108361344e565b9150614b7282614b31565b602082019050919050565b60006020820190508181036000830152614b9681614b5a565b9050919050565b7f2151747900000000000000000000000000000000000000000000000000000000600082015250565b6000614bd360048361344e565b9150614bde82614b9d565b602082019050919050565b60006020820190508181036000830152614c0281614bc6565b9050919050565b7f214d6178537570706c7900000000000000000000000000000000000000000000600082015250565b6000614c3f600a8361344e565b9150614c4a82614c09565b602082019050919050565b60006020820190508181036000830152614c6e81614c32565b9050919050565b7f63616e7420636c61696d20796574000000000000000000000000000000000000600082015250565b6000614cab600e8361344e565b9150614cb682614c75565b602082019050919050565b60006020820190508181036000830152614cda81614c9e565b9050919050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000614d3d60248361344e565b9150614d4882614ce1565b604082019050919050565b60006020820190508181036000830152614d6c81614d30565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000614dcf60228361344e565b9150614dda82614d73565b604082019050919050565b60006020820190508181036000830152614dfe81614dc2565b9050919050565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b6000614e3b601d8361344e565b9150614e4682614e05565b602082019050919050565b60006020820190508181036000830152614e6a81614e2e565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b6000614ecd60258361344e565b9150614ed882614e71565b604082019050919050565b60006020820190508181036000830152614efc81614ec0565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b6000614f5f60238361344e565b9150614f6a82614f03565b604082019050919050565b60006020820190508181036000830152614f8e81614f52565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b6000614ff160268361344e565b9150614ffc82614f95565b604082019050919050565b6000602082019050818103600083015261502081614fe4565b9050919050565b600060a08201905061503c6000830188613728565b6150496020830187613728565b6150566040830186613728565b615063606083018561366a565b6150706080830184613527565b9695505050505050565b7f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b60006150d660218361344e565b91506150e18261507a565b604082019050919050565b60006020820190508181036000830152615105816150c9565b9050919050565b7f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60008201527f6365000000000000000000000000000000000000000000000000000000000000602082015250565b600061516860228361344e565b91506151738261510c565b604082019050919050565b600060208201905081810360008301526151978161515b565b9050919050565b7f496e76616c696420726563697069656e74000000000000000000000000000000600082015250565b60006151d460118361344e565b91506151df8261519e565b602082019050919050565b60006020820190508181036000830152615203816151c7565b9050919050565b7f2156616c75650000000000000000000000000000000000000000000000000000600082015250565b600061524060068361344e565b915061524b8261520a565b602082019050919050565b6000602082019050818103600083015261526f81615233565b9050919050565b600061528182613591565b915061528c83613591565b925082820261529a81613591565b915082820484148315176152b1576152b0614037565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006152f282613591565b91506152fd83613591565b92508261530d5761530c6152b8565b5b828204905092915050565b7f7175616e7469747920746f6f206c6f7700000000000000000000000000000000600082015250565b600061534e60108361344e565b915061535982615318565b602082019050919050565b6000602082019050818103600083015261537d81615341565b9050919050565b7f496e76616c6964206d73672076616c7565000000000000000000000000000000600082015250565b60006153ba60118361344e565b91506153c582615384565b602082019050919050565b600060208201905081810360008301526153e9816153ad565b9050919050565b6000604082019050818103600083015261540a818561349a565b9050818103602083015261541e818461349a565b90509392505050565b6000819050919050565b61544261543d8261371e565b615427565b82525050565b60006154548285615431565b6020820191506154648284615431565b6020820191508190509392505050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b60006154aa601f8361344e565b91506154b582615474565b602082019050919050565b600060208201905081810360008301526154d98161549d565b9050919050565b7f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f60008201527f6e74726163740000000000000000000000000000000000000000000000000000602082015250565b600061553c60268361344e565b9150615547826154e0565b604082019050919050565b6000602082019050818103600083015261556b8161552f565b9050919050565b600081905092915050565b600061558882613c08565b6155928185615572565b93506155a281856020860161345f565b80840191505092915050565b60006155ba828461557d565b915081905092915050565b60006080820190506155da6000830187613728565b6155e760208301866136f4565b6155f46040830185613728565b6156016060830184613728565b95945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f45434453413a20696e76616c6964207369676e61747572650000000000000000600082015250565b600061566f60188361344e565b915061567a82615639565b602082019050919050565b6000602082019050818103600083015261569e81615662565b9050919050565b7f45434453413a20696e76616c6964207369676e6174757265206c656e67746800600082015250565b60006156db601f8361344e565b91506156e6826156a5565b602082019050919050565b6000602082019050818103600083015261570a816156ce565b9050919050565b7f45434453413a20696e76616c6964207369676e6174757265202773272076616c60008201527f7565000000000000000000000000000000000000000000000000000000000000602082015250565b600061576d60228361344e565b915061577882615711565b604082019050919050565b6000602082019050818103600083015261579c81615760565b9050919050565b50565b60006157b3600083615572565b91506157be826157a3565b600082019050919050565b60006157d4826157a6565b9150819050919050565b7f6e617469766520746f6b656e207472616e73666572206661696c656400000000600082015250565b6000615814601c8361344e565b915061581f826157de565b602082019050919050565b6000602082019050818103600083015261584381615807565b9050919050565b600060408201905061585f6000830185613527565b61586c602083018461366a565b9392505050565b60006060820190506158886000830186613527565b6158956020830185613527565b6158a2604083018461366a565b949350505050565b6000815190506158b981613777565b92915050565b6000602082840312156158d5576158d461355b565b5b60006158e3848285016158aa565b91505092915050565b7f5361666545524332303a204552433230206f7065726174696f6e20646964206e60008201527f6f74207375636365656400000000000000000000000000000000000000000000602082015250565b6000615948602a8361344e565b9150615953826158ec565b604082019050919050565b600060208201905081810360008301526159778161593b565b9050919050565b7f416464726573733a20696e73756666696369656e742062616c616e636520666f60008201527f722063616c6c0000000000000000000000000000000000000000000000000000602082015250565b60006159da60268361344e565b91506159e58261597e565b604082019050919050565b60006020820190508181036000830152615a09816159cd565b9050919050565b7f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000600082015250565b6000615a46601d8361344e565b9150615a5182615a10565b602082019050919050565b60006020820190508181036000830152615a7581615a39565b905091905056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220715565846591959935cb589b917f28ff5c37741af46f29eec0249cd6bd0cafa964736f6c63430008120033";
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
const factory = new ethers.ContractFactory(MyTokenContractABI, MyTokenContractData, signer);

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
      category : "ERC20Vote",
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

    const category = "ERC20Vote";
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
          <Title>ERC20 Vote</Title>
          <div>
            <Title1>Token Deployment</Title1>
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


