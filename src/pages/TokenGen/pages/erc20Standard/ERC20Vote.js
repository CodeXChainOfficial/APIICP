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
import MyTokenContractABI from "./ABIerc20Drop.json";
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
    const category = "ERC20Drop"; // Replace with the desired category
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
    const category = "ERC20Drop"; // Replace with the desired category
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
    "6101006040527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c960e0523480156200003657600080fd5b5060405162002d1338038062002d138339810160408190526200005991620002f1565b8181818160056200006b83826200040a565b5060066200007a82826200040a565b50504660a052503060c0526200008f620000a9565b60805250620000a090508362000140565b505050620004d6565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f620000d662000192565b80516020918201206040805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b606060058054620001a3906200037b565b80601f0160208091040260200160405190810160405280929190818152602001828054620001d1906200037b565b8015620002225780601f10620001f65761010080835404028352916020019162000222565b820191906000526020600020905b8154815290600101906020018083116200020457829003601f168201915b5050505050905090565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200025457600080fd5b81516001600160401b03808211156200027157620002716200022c565b604051601f8301601f19908116603f011681019082821181831017156200029c576200029c6200022c565b81604052838152602092508683858801011115620002b957600080fd5b600091505b83821015620002dd5785820183015181830184015290820190620002be565b600093810190920192909252949350505050565b6000806000606084860312156200030757600080fd5b83516001600160a01b03811681146200031f57600080fd5b60208501519093506001600160401b03808211156200033d57600080fd5b6200034b8783880162000242565b935060408601519150808211156200036257600080fd5b50620003718682870162000242565b9150509250925092565b600181811c908216806200039057607f821691505b602082108103620003b157634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200040557600081815260208120601f850160051c81016020861015620003e05750805b601f850160051c820191505b818110156200040157828155600101620003ec565b5050505b505050565b81516001600160401b038111156200042657620004266200022c565b6200043e816200043784546200037b565b84620003b7565b602080601f8311600181146200047657600084156200045d5750858301515b600019600386901b1c1916600185901b17855562000401565b600085815260208120601f198616915b82811015620004a75788860151825594840194600190910190840162000486565b5085821015620004c65787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05160c05160e051612803620005106000396000610de1015260006105d6015260006106000152600061062a01526128036000f3fe608060405234801561001057600080fd5b50600436106101da5760003560e01c806379cc679011610104578063a457c2d7116100a2578063d505accf11610071578063d505accf14610436578063dd62ed3e14610449578063e8a3d4851461045c578063f1127ed81461046457600080fd5b8063a457c2d7146103dd578063a9059cbb146103f0578063ac9650d814610403578063c3cda5201461042357600080fd5b80638e539e8c116100de5780638e539e8c1461039c578063938e3d7b146103af57806395d89b41146103c25780639ab24eb0146103ca57600080fd5b806379cc6790146103655780637ecebe00146103785780638da5cb5b1461038b57600080fd5b8063395093511161017c578063587cde1e1161014b578063587cde1e146102bd5780635c19a95c146103015780636fcfff451461031457806370a082311461033c57600080fd5b806339509351146102715780633a46b1a81461028457806342966c6814610297578063449a52f8146102aa57600080fd5b806318160ddd116101b857806318160ddd1461023557806323b872dd14610247578063313ce5671461025a5780633644e5151461026957600080fd5b806306fdde03146101df578063095ea7b3146101fd57806313af403514610220575b600080fd5b6101e76104a1565b6040516101f4919061217c565b60405180910390f35b61021061020b3660046121ab565b610533565b60405190151581526020016101f4565b61023361022e3660046121d5565b61054d565b005b6004545b6040519081526020016101f4565b6102106102553660046121f0565b6105a3565b604051601281526020016101f4565b6102396105c9565b61021061027f3660046121ab565b610659565b6102396102923660046121ab565b610698565b6102336102a536600461222c565b61070b565b6102336102b83660046121ab565b610762565b6102e96102cb3660046121d5565b6001600160a01b039081166000908152600860205260409020541690565b6040516001600160a01b0390911681526020016101f4565b61023361030f3660046121d5565b61080b565b6103276103223660046121d5565b610815565b60405163ffffffff90911681526020016101f4565b61023961034a3660046121d5565b6001600160a01b031660009081526002602052604090205490565b6102336103733660046121ab565b610837565b6102396103863660046121d5565b61092d565b6001546001600160a01b03166102e9565b6102396103aa36600461222c565b61094b565b6102336103bd36600461225b565b6109a7565b6101e76109f5565b6102396103d83660046121d5565b610a04565b6102106103eb3660046121ab565b610a8b565b6102106103fe3660046121ab565b610b28565b61041661041136600461230c565b610b36565b6040516101f49190612381565b6102336104313660046123f4565b610c2b565b61023361044436600461244c565b610d8d565b6102396104573660046124b6565b610ef3565b6101e7610f1e565b6104776104723660046124e9565b610fac565b60408051825163ffffffff1681526020928301516001600160e01b031692810192909252016101f4565b6060600580546104b090612529565b80601f01602080910402602001604051908101604052809291908181526020018280546104dc90612529565b80156105295780601f106104fe57610100808354040283529160200191610529565b820191906000526020600020905b81548152906001019060200180831161050c57829003601f168201915b5050505050905090565b600033610541818585611030565b60019150505b92915050565b610555611154565b6105975760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b60448201526064015b60405180910390fd5b6105a081611181565b50565b6000336105b18582856111d3565b6105bc85858561124d565b60019150505b9392505050565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561062257507f000000000000000000000000000000000000000000000000000000000000000046145b1561064c57507f000000000000000000000000000000000000000000000000000000000000000090565b610654611421565b905090565b3360008181526003602090815260408083206001600160a01b03871684529091528120549091906105419082908690610693908790612573565b611030565b60004382106106e95760405162461bcd60e51b815260206004820152601f60248201527f4552433230566f7465733a20626c6f636b206e6f7420796574206d696e656400604482015260640161058e565b6001600160a01b03831660009081526009602052604090206105c290836114b6565b806107153361034a565b10156107585760405162461bcd60e51b81526020600482015260126024820152716e6f7420656e6f7567682062616c616e636560701b604482015260640161058e565b6105a03382611573565b61076a611154565b6107b65760405162461bcd60e51b815260206004820152601760248201527f4e6f7420617574686f72697a656420746f206d696e742e000000000000000000604482015260640161058e565b806000036107fd5760405162461bcd60e51b815260206004820152601460248201527326b4b73a34b733903d32b937903a37b5b2b7399760611b604482015260640161058e565b610807828261158b565b5050565b6105a03382611615565b6001600160a01b0381166000908152600960205260408120546105479061168f565b61083f611154565b61088b5760405162461bcd60e51b815260206004820152601760248201527f4e6f7420617574686f72697a656420746f206275726e2e000000000000000000604482015260640161058e565b806108ab836001600160a01b031660009081526002602052604090205490565b10156108ee5760405162461bcd60e51b81526020600482015260126024820152716e6f7420656e6f7567682062616c616e636560701b604482015260640161058e565b6000816108fb8433610ef3565b6109059190612586565b905061091383336000611030565b61091e833383611030565b6109288383611573565b505050565b6001600160a01b038116600090815260076020526040812054610547565b600043821061099c5760405162461bcd60e51b815260206004820152601f60248201527f4552433230566f7465733a20626c6f636b206e6f7420796574206d696e656400604482015260640161058e565b610547600a836114b6565b6109af611154565b6109ec5760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b604482015260640161058e565b6105a0816116f8565b6060600680546104b090612529565b6001600160a01b0381166000908152600960205260408120548015610a78576001600160a01b0383166000908152600960205260409020610a46600183612586565b81548110610a5657610a56612599565b60009182526020909120015464010000000090046001600160e01b0316610a7b565b60005b6001600160e01b03169392505050565b3360008181526003602090815260408083206001600160a01b038716845290915281205490919083811015610b105760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b606482015260840161058e565b610b1d8286868403611030565b506001949350505050565b60003361054181858561124d565b60608167ffffffffffffffff811115610b5157610b51612245565b604051908082528060200260200182016040528015610b8457816020015b6060815260200190600190039081610b6f5790505b50905060005b82811015610c2457610bf430858584818110610ba857610ba8612599565b9050602002810190610bba91906125af565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506117d392505050565b828281518110610c0657610c06612599565b60200260200101819052508080610c1c906125fd565b915050610b8a565b5092915050565b83421115610c7b5760405162461bcd60e51b815260206004820152601d60248201527f4552433230566f7465733a207369676e61747572652065787069726564000000604482015260640161058e565b604080517fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf60208201526001600160a01b03881691810191909152606081018690526080810185905260009060a0016040516020818303038152906040528051906020012090506000610d0f610cef6105c9565b8360405161190160f01b8152600281019290925260228201526042902090565b90506000610d1f828787876117f8565b9050610d2a81611820565b8814610d785760405162461bcd60e51b815260206004820152601960248201527f4552433230566f7465733a20696e76616c6964206e6f6e636500000000000000604482015260640161058e565b610d82818a611615565b505050505050505050565b83421115610ddd5760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e65000000604482015260640161058e565b60007f0000000000000000000000000000000000000000000000000000000000000000888888610e0c8c611820565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e0016040516020818303038152906040528051906020012090506000610e69610cef6105c9565b90506000610e79828787876117f8565b9050896001600160a01b0316816001600160a01b031614610edc5760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e61747572650000604482015260640161058e565b610ee78a8a8a611030565b50505050505050505050565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205490565b60008054610f2b90612529565b80601f0160208091040260200160405190810160405280929190818152602001828054610f5790612529565b8015610fa45780601f10610f7957610100808354040283529160200191610fa4565b820191906000526020600020905b815481529060010190602001808311610f8757829003601f168201915b505050505081565b60408051808201909152600080825260208201526001600160a01b0383166000908152600960205260409020805463ffffffff8416908110610ff057610ff0612599565b60009182526020918290206040805180820190915291015463ffffffff8116825264010000000090046001600160e01b0316918101919091529392505050565b6001600160a01b0383166110925760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161058e565b6001600160a01b0382166110f35760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161058e565b6001600160a01b0383811660008181526003602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b60006111686001546001600160a01b031690565b6001600160a01b0316336001600160a01b031614905090565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b60006111df8484610ef3565b90506000198114611247578181101561123a5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161058e565b6112478484848403611030565b50505050565b6001600160a01b0383166112b15760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161058e565b6001600160a01b0382166113135760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161058e565b6001600160a01b0383166000908152600260205260409020548181101561138b5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161058e565b6001600160a01b038085166000908152600260205260408082208585039055918516815290812080548492906113c2908490612573565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161140e91815260200190565b60405180910390a3611247848484611848565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f61144c6104a1565b80516020918201206040805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b8154600090815b8181101561151a5760006114d1828461187a565b9050848682815481106114e6576114e6612599565b60009182526020909120015463ffffffff16111561150657809250611514565b611511816001612573565b91505b506114bd565b811561155e578461152c600184612586565b8154811061153c5761153c612599565b60009182526020909120015464010000000090046001600160e01b0316611561565b60005b6001600160e01b031695945050505050565b61157d8282611895565b611247600a6119ea836119f6565b6115958282611b6f565b6004546001600160e01b0310156116075760405162461bcd60e51b815260206004820152603060248201527f4552433230566f7465733a20746f74616c20737570706c79207269736b73206f60448201526f766572666c6f77696e6720766f74657360801b606482015260840161058e565b611247600a611c56836119f6565b6001600160a01b03828116600081815260086020818152604080842080546002845282862054949093528787166001600160a01b03198416811790915590519190951694919391928592917f3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f9190a4611247828483611c62565b600063ffffffff8211156116f45760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b606482015260840161058e565b5090565b600080805461170690612529565b80601f016020809104026020016040519081016040528092919081815260200182805461173290612529565b801561177f5780601f106117545761010080835404028352916020019161177f565b820191906000526020600020905b81548152906001019060200180831161176257829003601f168201915b5050505050905081600090816117959190612664565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a1681836040516117c7929190612724565b60405180910390a15050565b60606105c283836040518060600160405280602781526020016127a760279139611d9f565b600080600061180987878787611e7c565b9150915061181681611f40565b5095945050505050565b6001600160a01b03811660009081526007602052604090208054600181018255905b50919050565b6001600160a01b0383811660009081526008602052604080822054858416835291205461092892918216911683611c62565b60006118896002848418612752565b6105c290848416612573565b6001600160a01b0382166118f55760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b606482015260840161058e565b6001600160a01b038216600090815260026020526040902054818110156119695760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b606482015260840161058e565b6001600160a01b0383166000908152600260205260408120838303905560048054849290611998908490612586565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a361092883600084611848565b60006105c28284612586565b825460009081908015611a415785611a0f600183612586565b81548110611a1f57611a1f612599565b60009182526020909120015464010000000090046001600160e01b0316611a44565b60005b6001600160e01b03169250611a5d83858763ffffffff16565b9150600081118015611a9b57504386611a77600184612586565b81548110611a8757611a87612599565b60009182526020909120015463ffffffff16145b15611afb57611aa98261208a565b86611ab5600184612586565b81548110611ac557611ac5612599565b9060005260206000200160000160046101000a8154816001600160e01b0302191690836001600160e01b03160217905550611b66565b856040518060400160405280611b104361168f565b63ffffffff168152602001611b248561208a565b6001600160e01b0390811690915282546001810184556000938452602093849020835194909301519091166401000000000263ffffffff909316929092179101555b50935093915050565b6001600160a01b038216611bc55760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161058e565b8060046000828254611bd79190612573565b90915550506001600160a01b03821660009081526002602052604081208054839290611c04908490612573565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a361080760008383611848565b60006105c28284612573565b816001600160a01b0316836001600160a01b031614158015611c845750600081115b15610928576001600160a01b03831615611d12576001600160a01b03831660009081526009602052604081208190611cbf906119ea856119f6565b91509150846001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a7248383604051611d07929190918252602082015260400190565b60405180910390a250505b6001600160a01b03821615610928576001600160a01b03821660009081526009602052604081208190611d4890611c56856119f6565b91509150836001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a7248383604051611d90929190918252602082015260400190565b60405180910390a25050505050565b60606001600160a01b0384163b611e075760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b606482015260840161058e565b600080856001600160a01b031685604051611e229190612774565b600060405180830381855af49150503d8060008114611e5d576040519150601f19603f3d011682016040523d82523d6000602084013e611e62565b606091505b5091509150611e728282866120f3565b9695505050505050565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115611eb35750600090506003611f37565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015611f07573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611f3057600060019250925050611f37565b9150600090505b94509492505050565b6000816004811115611f5457611f54612790565b03611f5c5750565b6001816004811115611f7057611f70612790565b03611fbd5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161058e565b6002816004811115611fd157611fd1612790565b0361201e5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161058e565b600381600481111561203257612032612790565b036105a05760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161058e565b60006001600160e01b038211156116f45760405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e20326044820152663234206269747360c81b606482015260840161058e565b606083156121025750816105c2565b8251156121125782518084602001fd5b8160405162461bcd60e51b815260040161058e919061217c565b60005b8381101561214757818101518382015260200161212f565b50506000910152565b6000815180845261216881602086016020860161212c565b601f01601f19169290920160200192915050565b6020815260006105c26020830184612150565b80356001600160a01b03811681146121a657600080fd5b919050565b600080604083850312156121be57600080fd5b6121c78361218f565b946020939093013593505050565b6000602082840312156121e757600080fd5b6105c28261218f565b60008060006060848603121561220557600080fd5b61220e8461218f565b925061221c6020850161218f565b9150604084013590509250925092565b60006020828403121561223e57600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b60006020828403121561226d57600080fd5b813567ffffffffffffffff8082111561228557600080fd5b818401915084601f83011261229957600080fd5b8135818111156122ab576122ab612245565b604051601f8201601f19908116603f011681019083821181831017156122d3576122d3612245565b816040528281528760208487010111156122ec57600080fd5b826020860160208301376000928101602001929092525095945050505050565b6000806020838503121561231f57600080fd5b823567ffffffffffffffff8082111561233757600080fd5b818501915085601f83011261234b57600080fd5b81358181111561235a57600080fd5b8660208260051b850101111561236f57600080fd5b60209290920196919550909350505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b828110156123d657603f198886030184526123c4858351612150565b945092850192908501906001016123a8565b5092979650505050505050565b803560ff811681146121a657600080fd5b60008060008060008060c0878903121561240d57600080fd5b6124168761218f565b95506020870135945060408701359350612432606088016123e3565b92506080870135915060a087013590509295509295509295565b600080600080600080600060e0888a03121561246757600080fd5b6124708861218f565b965061247e6020890161218f565b9550604088013594506060880135935061249a608089016123e3565b925060a0880135915060c0880135905092959891949750929550565b600080604083850312156124c957600080fd5b6124d28361218f565b91506124e06020840161218f565b90509250929050565b600080604083850312156124fc57600080fd5b6125058361218f565b9150602083013563ffffffff8116811461251e57600080fd5b809150509250929050565b600181811c9082168061253d57607f821691505b60208210810361184257634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b808201808211156105475761054761255d565b818103818111156105475761054761255d565b634e487b7160e01b600052603260045260246000fd5b6000808335601e198436030181126125c657600080fd5b83018035915067ffffffffffffffff8211156125e157600080fd5b6020019150368190038213156125f657600080fd5b9250929050565b60006001820161260f5761260f61255d565b5060010190565b601f82111561092857600081815260208120601f850160051c8101602086101561263d5750805b601f850160051c820191505b8181101561265c57828155600101612649565b505050505050565b815167ffffffffffffffff81111561267e5761267e612245565b6126928161268c8454612529565b84612616565b602080601f8311600181146126c757600084156126af5750858301515b600019600386901b1c1916600185901b17855561265c565b600085815260208120601f198616915b828110156126f6578886015182559484019460019091019084016126d7565b50858210156127145787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6040815260006127376040830185612150565b82810360208401526127498185612150565b95945050505050565b60008261276f57634e487b7160e01b600052601260045260246000fd5b500490565b6000825161278681846020870161212c565b9190910192915050565b634e487b7160e01b600052602160045260246000fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220a5d1aa76e72df3e3652fcc4dba8b17e2924fe6c755f010a9e09aa877b8e92d2c64736f6c63430008120033";
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
      category : "ERC20Drop",
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

    const category = "ERC20Drop"; // Replace with the desired category
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
          <Title>ERC20 Drop</Title>
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


