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
import MyTokenContractABI from "./ABIerc20Staking.json";
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
    const category = "ERC20Staking"; // Replace with the desired category
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
    const category = "ERC20Staking"; // Replace with the desired category
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
    "6101006040523480156200001257600080fd5b5060405162003353380380620033538339810160408190526200003591620004dc565b8083846001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000076573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200009c91906200056c565b60ff16846001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015620000de573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200010491906200056c565b600160025560ff166001600160a01b038316158015906200012d57506001600160a01b03841615155b6200016b5760405162461bcd60e51b815260206004820152600960248201526806164647265737320360bc1b60448201526064015b60405180910390fd5b61ffff82161580159062000182575061ffff811615155b620001bd5760405162461bcd60e51b815260206004820152600a6024820152690646563696d616c7320360b41b604482015260640162000162565b6001600160a01b039384166080529190921660a05261ffff91821660c0521660e052620001ea866200029d565b620001f7878686620002ef565b826001600160a01b0316826001600160a01b031603620002705760405162461bcd60e51b815260206004820152602d60248201527f52657761726420546f6b656e20616e64205374616b696e6720546f6b656e206360448201526c30b713ba1031329039b0b6b29760991b606482015260840162000162565b50600880546001600160a01b0319166001600160a01b039290921691909117905550620005f49350505050565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b806000036200032f5760405162461bcd60e51b815260206004820152600b60248201526a064697669646520627920360ac1b604482015260640162000162565b826001600160501b03166000036200038a5760405162461bcd60e51b815260206004820152601460248201527f74696d652d756e69742063616e27742062652030000000000000000000000000604482015260640162000162565b600380546001600160401b0316906001906000620003a98385620005ae565b82546001600160401b039182166101009390930a9283029190920219909116179055506040805160a0810182526001600160501b03808716825242811660208084019182526000848601818152606086018a8152608087018a815289845260079094529690912094518554935191518516600160a01b02600160a01b600160f01b03199286166a0100000000000000000000026001600160a01b0319909516919095161792909217919091169190911782559151600182015590516002909101558015620004b957426007600062000483600185620005d8565b815260200190815260200160002060000160146101000a8154816001600160501b0302191690836001600160501b031602179055505b50505050565b80516001600160a01b0381168114620004d757600080fd5b919050565b600080600080600080600060e0888a031215620004f857600080fd5b87516001600160501b03811681146200051057600080fd5b96506200052060208901620004bf565b955060408801519450606088015193506200053e60808901620004bf565b92506200054e60a08901620004bf565b91506200055e60c08901620004bf565b905092959891949750929550565b6000602082840312156200057f57600080fd5b815160ff811681146200059157600080fd5b9392505050565b634e487b7160e01b600052601160045260246000fd5b6001600160401b03818116838216019080821115620005d157620005d162000598565b5092915050565b81810381811115620005ee57620005ee62000598565b92915050565b60805160a05160c05160e051612cb56200069e600039600081816104010152611efe0152600081816104a80152611f320152600081816102a30152818161126d01528181611541015281816115d401528181611744015281816119a801526119ec01526000818161015301528181610ebd01528181610f630152818161129101528181611571015281816117680152818161198001528181611a120152611fe90152612cb56000f3fe6080604052600436106101435760003560e01c806393ce5343116100b6578063b9f7a7b51161006f578063b9f7a7b514610496578063c3453153146104ca578063cb43b2dd146104ea578063d68124c71461050a578063e8a3d4851461051f578063f7c618c11461054157600080fd5b806393ce5343146103b057806397e1b4bc146103c55780639bdcecd1146103ef578063a694fc3a14610436578063ac9650d814610449578063b218f0691461047657600080fd5b80635357e916116101085780635357e9161461025457806372f702f3146102915780638caaa271146102c55780638da5cb5b146102e95780639168ae7214610307578063938e3d7b1461039057600080fd5b80621b7934146101cc57806313af4035146101ec57806316c621e01461020c5780632e1a7d4d1461021f578063372500ab1461023f57600080fd5b366101c757336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146101c55760405162461bcd60e51b815260206004820181905260248201527f63616c6c6572206e6f74206e617469766520746f6b656e20777261707065722e60448201526064015b60405180910390fd5b005b600080fd5b3480156101d857600080fd5b506101c56101e7366004612560565b610561565b3480156101f857600080fd5b506101c5610207366004612582565b6106d1565b6101c561021a3660046125ab565b610701565b34801561022b57600080fd5b506101c561023a3660046125ab565b610737565b34801561024b57600080fd5b506101c5610765565b34801561026057600080fd5b5061027461026f3660046125ab565b610799565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561029d57600080fd5b506102747f000000000000000000000000000000000000000000000000000000000000000081565b3480156102d157600080fd5b506102db60045481565b604051908152602001610288565b3480156102f557600080fd5b506001546001600160a01b0316610274565b34801561031357600080fd5b5061035e610322366004612582565b6006602052600090815260409020805460018201546002909201546001600160801b03821692600160801b9092046001600160401b0316919084565b604080516001600160801b0390951685526001600160401b039093166020850152918301526060820152608001610288565b34801561039c57600080fd5b506101c56103ab3660046125da565b6107c3565b3480156103bc57600080fd5b506009546102db565b3480156103d157600080fd5b506103da6107f0565b60408051928352602083019190915201610288565b3480156103fb57600080fd5b506104237f000000000000000000000000000000000000000000000000000000000000000081565b60405161ffff9091168152602001610288565b6101c56104443660046125ab565b610876565b34801561045557600080fd5b5061046961046436600461268a565b6108a4565b604051610288919061274e565b34801561048257600080fd5b506101c56104913660046127b0565b610999565b3480156104a257600080fd5b506104237f000000000000000000000000000000000000000000000000000000000000000081565b3480156104d657600080fd5b506103da6104e5366004612582565b610aed565b3480156104f657600080fd5b506101c56105053660046125ab565b610b1a565b34801561051657600080fd5b506102db610b48565b34801561052b57600080fd5b50610534610b90565b60405161028891906127d9565b34801561054d57600080fd5b50600854610274906001600160a01b031681565b610569610c1e565b6105855760405162461bcd60e51b81526004016101bc906127ec565b60035460009060079082906105a5906001906001600160401b031661282a565b6001600160401b031681526020808201929092526040908101600020815160a08101835281546001600160501b038082168352600160501b8204811695830195909552600160a01b900490931691830191909152600181015460608301819052600290910154608083015290915083141580610625575080608001518214155b6106715760405162461bcd60e51b815260206004820152601760248201527f52657761726420726174696f20756e6368616e6765642e00000000000000000060448201526064016101bc565b805161067e908484610c4b565b60608082015160808084015160408051938452602084018890528301529181018490527feb6684a1e7c9bd2adc792fb253558f022bcbef39fb6ad31dc58cdfefdd5b5190910160405180910390a1505050565b6106d9610c1e565b6106f55760405162461bcd60e51b81526004016101bc906127ec565b6106fe81610e05565b50565b60028054036107225760405162461bcd60e51b81526004016101bc9061284a565b6002805561072f81610e57565b506001600255565b60028054036107585760405162461bcd60e51b81526004016101bc9061284a565b6002805561072f8161101d565b60028054036107865760405162461bcd60e51b81526004016101bc9061284a565b600280556107926112ee565b6001600255565b600581815481106107a957600080fd5b6000918252602090912001546001600160a01b0316905081565b6107cb610c1e565b6107e75760405162461bcd60e51b81526004016101bc906127ec565b6106fe81611415565b60035460009081906007908290610812906001906001600160401b031661282a565b6001600160401b03168152602001908152602001600020600101549150600760006001600360009054906101000a90046001600160401b0316610855919061282a565b6001600160401b031681526020019081526020016000206002015490509091565b60028054036108975760405162461bcd60e51b81526004016101bc9061284a565b6002805561072f816114e4565b6060816001600160401b038111156108be576108be6125c4565b6040519080825280602002602001820160405280156108f157816020015b60608152602001906001900390816108dc5790505b50905060005b82811015610991576109613085858481811061091557610915612881565b90506020028101906109279190612897565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061188392505050565b82828151811061097357610973612881565b60200260200101819052508080610989906128dd565b9150506108f7565b505b92915050565b6109a1610c1e565b6109bd5760405162461bcd60e51b81526004016101bc906127ec565b60035460009060079082906109dd906001906001600160401b031661282a565b6001600160401b031681526020808201929092526040908101600020815160a08101835281546001600160501b03808216808452600160501b8304821696840196909652600160a01b9091048116938201939093526001820154606082015260029091015460808201529250831603610a8f5760405162461bcd60e51b81526020600482015260146024820152732a34b6b296bab734ba103ab731b430b733b2b21760611b60448201526064016101bc565b610aa28282606001518360800151610c4b565b8051604080516001600160501b03928316815291841660208301527fd968de290ed68f978b9e4816f7d4be9ef46189fe8eeb3eeb86199e7229cf2de091015b60405180910390a15050565b6001600160a01b03811660009081526006602052604081206001015490610b13836118af565b9050915091565b6002805403610b3b5760405162461bcd60e51b81526004016101bc9061284a565b6002805561072f8161191f565b6003546000906007908290610b68906001906001600160401b031661282a565b6001600160401b031681526020810191909152604001600020546001600160501b0316919050565b60008054610b9d906128f6565b80601f0160208091040260200160405190810160405280929190818152602001828054610bc9906128f6565b8015610c165780601f10610beb57610100808354040283529160200191610c16565b820191906000526020600020905b815481529060010190602001808311610bf957829003601f168201915b505050505081565b6000610c326001546001600160a01b031690565b6001600160a01b0316336001600160a01b031614905090565b80600003610c895760405162461bcd60e51b815260206004820152600b60248201526a064697669646520627920360ac1b60448201526064016101bc565b826001600160501b0316600003610cd95760405162461bcd60e51b8152602060048201526014602482015273074696d652d756e69742063616e277420626520360641b60448201526064016101bc565b600380546001600160401b0316906001906000610cf68385612930565b82546001600160401b039182166101009390930a9283029190920219909116179055506040805160a0810182526001600160501b03808716825242811660208084019182526000848601818152606086018a8152608087018a815289845260079094529690912094518554935191518516600160a01b0269ffffffffffffffffffff60a01b19928616600160501b026001600160a01b0319909516919095161792909217919091169190911782559151600182015590516002909101558015610dff574260076000610dc9600185612950565b815260200190815260200160002060000160146101000a8154816001600160501b0302191690836001600160501b031602179055505b50505050565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b6001546001600160a01b03163314610e815760405162461bcd60e51b81526004016101bc906127ec565b6008546000906001600160a01b031673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14610ebb576008546001600160a01b0316610edd565b7f00000000000000000000000000000000000000000000000000000000000000005b6040516370a0823160e01b81523060048201529091506000906001600160a01b038316906370a0823190602401602060405180830381865afa158015610f27573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f4b9190612963565b600854909150610f87906001600160a01b03163330867f0000000000000000000000000000000000000000000000000000000000000000611af5565b6040516370a0823160e01b815230600482015260009082906001600160a01b038516906370a0823190602401602060405180830381865afa158015610fd0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ff49190612963565b610ffe9190612950565b90508060096000828254611012919061297c565b909155505050505050565b33600090815260066020526040812060010154908290036110775760405162461bcd60e51b81526020600482015260146024820152735769746864726177696e67203020746f6b656e7360601b60448201526064016101bc565b818110156110c75760405162461bcd60e51b815260206004820152601c60248201527f5769746864726177696e67206d6f7265207468616e207374616b65640000000060448201526064016101bc565b6110d033611c66565b818103611227576000600580548060200260200160405190810160405280929190818152602001828054801561112f57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611111575b5050505050905060005b815181101561122457336001600160a01b031682828151811061115e5761115e612881565b60200260200101516001600160a01b0316036112145781600183516111839190612950565b8151811061119357611193612881565b6020026020010151600582815481106111ae576111ae612881565b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060058054806111ed576111ed61298f565b600082815260209020810160001990810180546001600160a01b0319169055019055611224565b61121d816128dd565b9050611139565b50505b3360009081526006602052604081206001018054849290611249908490612950565b9250508190555081600460008282546112629190612950565b909155506112b590507f00000000000000000000000000000000000000000000000000000000000000003033857f0000000000000000000000000000000000000000000000000000000000000000611af5565b60405182815233907f6352c5382c4a4578e712449ca65e83cdb392d045dfcf1cad9615189db2da244b9060200160405180910390a25050565b60006112f933611d36565b33600090815260066020526040902060020154611316919061297c565b9050806000036113555760405162461bcd60e51b815260206004820152600a6024820152694e6f207265776172647360b01b60448201526064016101bc565b33600090815260066020526040812080546001600160801b031916426001600160501b031617815560020155600354611399906001906001600160401b031661282a565b33600081815260066020526040902080546001600160401b0393909316600160801b0267ffffffffffffffff60801b19909316929092179091556113dd9082611f6b565b60405181815233907ffc30cddea38e2bf4d6ea7d3f9ed3b6ad7f176419f4963bd81318067a4aee73fe9060200160405180910390a250565b6000808054611423906128f6565b80601f016020809104026020016040519081016040528092919081815260200182805461144f906128f6565b801561149c5780601f106114715761010080835404028352916020019161149c565b820191906000526020600020905b81548152906001019060200180831161147f57829003601f168201915b5050505050905081600090816114b291906129f3565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a168183604051610ae1929190612ab2565b806000036115275760405162461bcd60e51b815260206004820152601060248201526f5374616b696e67203020746f6b656e7360801b60448201526064016101bc565b600073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed197f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03160161159557507f00000000000000000000000000000000000000000000000000000000000000006115f4565b34156115d15760405162461bcd60e51b815260206004820152600b60248201526a056616c7565206e6f7420360ac1b60448201526064016101bc565b507f00000000000000000000000000000000000000000000000000000000000000005b336000908152600660205260409020600101541561161a5761161533611c66565b6116d2565b6005805460018082019092557f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db00180546001600160a01b03191633908117909155600090815260066020526040902080546001600160801b0319166001600160501b03421617905560035461169891906001600160401b031661282a565b33600090815260066020526040902080546001600160401b0392909216600160801b0267ffffffffffffffff60801b199092169190911790555b6040516370a0823160e01b81523060048201526000906001600160a01b038316906370a0823190602401602060405180830381865afa158015611719573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061173d9190612963565b905061178c7f00000000000000000000000000000000000000000000000000000000000000003330867f0000000000000000000000000000000000000000000000000000000000000000611af5565b6040516370a0823160e01b815230600482015260009082906001600160a01b038516906370a0823190602401602060405180830381865afa1580156117d5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117f99190612963565b6118039190612950565b3360009081526006602052604081206001018054929350839290919061182a90849061297c565b925050819055508060046000828254611843919061297c565b909155505060405181815233907fb539ca1e5c8d398ddf1c41c30166f33404941683be4683319b57669a93dad4ef9060200160405180910390a250505050565b60606118a88383604051806060016040528060278152602001612c596027913961200d565b9392505050565b6001600160a01b03811660009081526006602052604081206001015481036118f057506001600160a01b031660009081526006602052604090206002015490565b6118f982611d36565b6001600160a01b038316600090815260066020526040902060020154610993919061297c565b6001546001600160a01b031633146119495760405162461bcd60e51b81526004016101bc906127ec565b600954811161196557806009546119609190612950565b611968565b60005b6009556008546119a4906001600160a01b03163033847f0000000000000000000000000000000000000000000000000000000000000000611af5565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14611a10577f0000000000000000000000000000000000000000000000000000000000000000611a32565b7f00000000000000000000000000000000000000000000000000000000000000005b600480546040516370a0823160e01b815230928101929092529192506001600160a01b038316906370a0823190602401602060405180830381865afa158015611a7f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611aa39190612963565b1015611af15760405162461bcd60e51b815260206004820152601e60248201527f5374616b696e6720746f6b656e2062616c616e636520726564756365642e000060448201526064016101bc565b5050565b8115611c5f5773eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b03861601611c5357306001600160a01b03851603611b9a57604051632e1a7d4d60e01b8152600481018390526001600160a01b03821690632e1a7d4d90602401600060405180830381600087803b158015611b7257600080fd5b505af1158015611b86573d6000803e3d6000fd5b50505050611b958383836120ea565b611c5f565b306001600160a01b03841603611c4857348214611bef5760405162461bcd60e51b81526020600482015260136024820152721b5cd9cb9d985b1d5948084f48185b5bdd5b9d606a1b60448201526064016101bc565b806001600160a01b031663d0e30db0836040518263ffffffff1660e01b81526004016000604051808303818588803b158015611c2a57600080fd5b505af1158015611c3e573d6000803e3d6000fd5b5050505050611c5f565b611b958383836120ea565b611c5f858585856121af565b5050505050565b6000611c7182611d36565b6001600160a01b038316600090815260066020526040812060020180549293508392909190611ca190849061297c565b90915550506001600160a01b038216600090815260066020526040902080546001600160801b0319166001600160501b034216179055600354611cef906001906001600160401b031661282a565b6001600160a01b03909216600090815260066020526040902080546001600160401b0393909316600160801b0267ffffffffffffffff60801b199093169290921790915550565b6001600160a01b0381166000908152600660209081526040808320815160808101835281546001600160801b03811682526001600160401b03600160801b9091048116948201859052600183015493820193909352600290910154606082015260035490929116815b81811015611ef4576000818152600760209081526040808320815160a08101835281546001600160501b038082168352600160501b8204811695830195909552600160a01b9004909316918301919091526001810154606083015260020154608082015290848303611e12578551611e21565b81602001516001600160501b03165b6001600160801b03169050600082604001516001600160501b0316600003611e495742611e58565b82604001516001600160501b03165b9050600080611e8589604001518585611e719190612950565b611e7b9190612ad7565b8660600151612207565b91509150600080611ebd8c886080015189600001516001600160501b031686611eae9190612b04565b611eb89190612b04565b612252565b91509150838015611ecb5750815b611ed5578b611ed7565b805b9b5050505050505050600181611eed919061297c565b9050611d9f565b50611f2984611f247f0000000000000000000000000000000000000000000000000000000000000000600a612c0a565b612207565b9450611f5890507f0000000000000000000000000000000000000000000000000000000000000000600a612c0a565b611f629085612b04565b95945050505050565b600954811115611fbd5760405162461bcd60e51b815260206004820152601860248201527f4e6f7420656e6f7567682072657761726420746f6b656e73000000000000000060448201526064016101bc565b8060096000828254611fcf9190612950565b9091555050600854611af1906001600160a01b03163084847f0000000000000000000000000000000000000000000000000000000000000000611af5565b60606001600160a01b0384163b6120755760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b60648201526084016101bc565b600080856001600160a01b0316856040516120909190612c1a565b600060405180830381855af49150503d80600081146120cb576040519150601f19603f3d011682016040523d82523d6000602084013e6120d0565b606091505b50915091506120e082828661226d565b9695505050505050565b6000836001600160a01b03168360405160006040518083038185875af1925050503d8060008114612137576040519150601f19603f3d011682016040523d82523d6000602084013e61213c565b606091505b5050905080610dff57816001600160a01b031663d0e30db0846040518263ffffffff1660e01b81526004016000604051808303818588803b15801561218057600080fd5b505af1158015612194573d6000803e3d6000fd5b50610dff935050506001600160a01b038416905085856122a6565b816001600160a01b0316836001600160a01b03160315610dff57306001600160a01b038416036121f2576121ed6001600160a01b03851683836122a6565b610dff565b610dff6001600160a01b03851684848461230e565b6000808360000361221e575060019050600061224b565b8383028385828161223157612231612aee565b041461224457600080925092505061224b565b6001925090505b9250929050565b6000808383018481101561224457600080925092505061224b565b6060831561227c5750816118a8565b82511561228c5782518084602001fd5b8160405162461bcd60e51b81526004016101bc91906127d9565b6040516001600160a01b03831660248201526044810182905261230990849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152612346565b505050565b6040516001600160a01b0380851660248301528316604482015260648101829052610dff9085906323b872dd60e01b906084016122d2565b600061239b826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166124189092919063ffffffff16565b80519091501561230957808060200190518101906123b99190612c36565b6123095760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016101bc565b6060612427848460008561242f565b949350505050565b6060824710156124905760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016101bc565b6001600160a01b0385163b6124e75760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016101bc565b600080866001600160a01b031685876040516125039190612c1a565b60006040518083038185875af1925050503d8060008114612540576040519150601f19603f3d011682016040523d82523d6000602084013e612545565b606091505b509150915061255582828661226d565b979650505050505050565b6000806040838503121561257357600080fd5b50508035926020909101359150565b60006020828403121561259457600080fd5b81356001600160a01b03811681146118a857600080fd5b6000602082840312156125bd57600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b6000602082840312156125ec57600080fd5b81356001600160401b038082111561260357600080fd5b818401915084601f83011261261757600080fd5b813581811115612629576126296125c4565b604051601f8201601f19908116603f01168101908382118183101715612651576126516125c4565b8160405282815287602084870101111561266a57600080fd5b826020860160208301376000928101602001929092525095945050505050565b6000806020838503121561269d57600080fd5b82356001600160401b03808211156126b457600080fd5b818501915085601f8301126126c857600080fd5b8135818111156126d757600080fd5b8660208260051b85010111156126ec57600080fd5b60209290920196919550909350505050565b60005b83811015612719578181015183820152602001612701565b50506000910152565b6000815180845261273a8160208601602086016126fe565b601f01601f19169290920160200192915050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b828110156127a357603f19888603018452612791858351612722565b94509285019290850190600101612775565b5092979650505050505050565b6000602082840312156127c257600080fd5b81356001600160501b03811681146118a857600080fd5b6020815260006118a86020830184612722565b6020808252600e908201526d139bdd08185d5d1a1bdc9a5e995960921b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b6001600160401b0382811682821603908082111561099157610991612814565b6020808252601f908201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604082015260600190565b634e487b7160e01b600052603260045260246000fd5b6000808335601e198436030181126128ae57600080fd5b8301803591506001600160401b038211156128c857600080fd5b60200191503681900382131561224b57600080fd5b6000600182016128ef576128ef612814565b5060010190565b600181811c9082168061290a57607f821691505b60208210810361292a57634e487b7160e01b600052602260045260246000fd5b50919050565b6001600160401b0381811683821601908082111561099157610991612814565b8181038181111561099357610993612814565b60006020828403121561297557600080fd5b5051919050565b8082018082111561099357610993612814565b634e487b7160e01b600052603160045260246000fd5b601f82111561230957600081815260208120601f850160051c810160208610156129cc5750805b601f850160051c820191505b818110156129eb578281556001016129d8565b505050505050565b81516001600160401b03811115612a0c57612a0c6125c4565b612a2081612a1a84546128f6565b846129a5565b602080601f831160018114612a555760008415612a3d5750858301515b600019600386901b1c1916600185901b1785556129eb565b600085815260208120601f198616915b82811015612a8457888601518255948401946001909101908401612a65565b5085821015612aa25787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b604081526000612ac56040830185612722565b8281036020840152611f628185612722565b808202811582820484141761099357610993612814565b634e487b7160e01b600052601260045260246000fd5b600082612b2157634e487b7160e01b600052601260045260246000fd5b500490565b600181815b80851115612b61578160001904821115612b4757612b47612814565b80851615612b5457918102915b93841c9390800290612b2b565b509250929050565b600082612b7857506001610993565b81612b8557506000610993565b8160018114612b9b5760028114612ba557612bc1565b6001915050610993565b60ff841115612bb657612bb6612814565b50506001821b610993565b5060208310610133831016604e8410600b8410161715612be4575081810a610993565b612bee8383612b26565b8060001904821115612c0257612c02612814565b029392505050565b60006118a861ffff841683612b69565b60008251612c2c8184602087016126fe565b9190910192915050565b600060208284031215612c4857600080fd5b815180151581146118a857600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220380c44d4f4b4fa196ac53045f6089b74e4664ae5f74df9a38d05c288069bde1964736f6c63430008120033";
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
      category : "ERC20Staking",
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

    const category = "ERC20Staking"; // Replace with the desired category
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
          <Title>ERC20 Staking</Title>
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


