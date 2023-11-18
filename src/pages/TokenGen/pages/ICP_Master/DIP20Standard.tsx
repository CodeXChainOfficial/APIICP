import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, MenuItem, Select, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import React, { useEffect, useState } from "react";
import { FormInputStyle } from "./styles/form";
import axios from "axios"; // Import Axios for making HTTP requests
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { HttpAgent, Actor, ActorConfig, IdentityInvalidError } from '@dfinity/agent';
import { canisterId } from "./declarations";
//import {  idlFactory } from './src/motoko/DIP20/motoko/src/declarations/token/index';
// Use the initialized canisterId variable wherever it is required
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const dal2= {
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


export default function DIP20Standard() {

  const [identity, setIdentity] = useState('');
  const handleCreateID = async () => {
    try {
      const response = await fetch('http://34.28.170.218:5004/api/identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nameID }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the UI with the returned Principal
        console.log(data)
        setIdentity(data.identity);

        console.log(`ID "${identity}" = Principal "${data.identity}"`);
      } else {
        console.error('Failed to create ID');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [canisterInfo, setCanisterInfo] = useState('');

  const [code, setCode] = useState('// Your code goes here');

  const handleCodeChange = newCode => {
    setCode(newCode);
  };


  const [userAddress, setUserAddress] = useState(null);
  const [deployedTokens, setDeployedTokens] = useState([]);
  const [nameID, setNameID] = useState("");

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [contract, setContract] = useState(null);
 
 
  const handleClose = () => {
    setErrorModalOpen(false);
  }


 

  const Modal = ({ isOpen, onClose, content }) => {
    return (
      <div style={{ display: isOpen ? 'block' : 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '95%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', maxWidth: '400px', color: '#fff' }}>
          {content}
          <button style={{ color: '#fff', background: 'transparent', border: '1px solid #fff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }} onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  const Modal2 = ({ isOpen, onClose, content }) => {


   
    return (
      <div
        style={{
          display: isOpen ? 'flex' : 'none',
          position: 'fixed',
          top: 20,
          left: 0,
          width: '100%',
          height: '100%',

          overflow: 'auto', // Add scroll when content exceeds the maximum height
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
      >
        <div
          style={{
            backgroundColor: '#1a1a1a',
            padding: '20px',
            borderRadius: '8px',
            width: 'auto',
            height: '80%',
            color: '#fff',
            border: '1px solid rgba(222, 222, 222, 0.5)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            overflow: 'auto', // Add this line to enable scroll if content is too big

            
          }}
        >
          {content}
          <div style={{ marginTop: '20px', marginLeft:'30px', display: 'block', justifyContent: 'block-end' }}>
            <button
              style={{
                color: '#fff',
                background: '#3498db',
                border: 'none',
                padding: '8px 15px',

                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '30px',
                display: 'flex',
            flexDirection: 'row',
              }}
              onClick={onClose}
            >
              Close
            </button>
           
          </div>
        </div>
      </div>
    );
  };
  

 
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image_url, setImage_url] = useState("");
  const [mintname, setMintName] = useState("");
  const [description, setDescription] = useState("");
  const [CollectionName, setCollectionNamel] = useState("");
  const [CollectionLimit, setCollectionLimit] = useState("");
  const [result1, setResult1] = useState<string>("");
  const [canisterIds, setCanisterIds] = useState<string[]>([]);
  
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({
    name: '',
    logo: '',
  });
  const deployTokenApiCall = async () => {

/*
    const currentCanister ="xuzvb-heaaa-aaaaa-qadza-cai";
    const endpointUrl = 'http://127.0.0.1:4943/?canisterId=zdtmx-wmaaa-aaaaa-qac2q-cai&id=';
    const agent = new HttpAgent({ host: endpointUrl });
    const myActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: currentCanister,
    });*/
    console.log(identity)
  
    console.log(image_url)
    console.log(image_url, name,symbol,decimals,totalSupply)
  
    try{
      const response = await fetch('http://34.28.170.218:5004/api/DIP20', {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url, identity, name, symbol, decimals, totalSupply }),
      });
  
      if (!response.ok) {
        throw new Error('Error deploying token.');
      }
      await new Promise(resolve => setTimeout(resolve, 30000));

    const result = await response.json();
   
        // If the result has changed, handle it
        console.log('API Call Result:', result);
        for (let i = 0; i < 10000; ) {
            console.log('API Call Result:', result);
           await deploycansiter();
           await new Promise(resolve => setTimeout(resolve, 1000));
           i++
        }
      

        setResult1(result.canisterId);
        handleReusltChange(result.canisterId);
        fetchDataForCanister(result.canisterId);
        
      } catch (error) {
    console.error('Error deploying token:', error);
    // Handle the error as needed
  }
};


const deploycansiter = async () => {
  try{
    const response = await fetch('http://34.28.170.218:5004/api/checkcanister', {
      method: 'POST',
      headers: {  
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error deploying token.');
    }
    await new Promise(resolve => setTimeout(resolve, 30000));

  const result = await response.json();
 
      // If the result has changed, handle it
      console.log('Update Canister:', result);
      setResult1(result.canisterId);
      handleReusltChange(result.canisterId);
      fetchDataForCanister(result.canisterId);
   
  // Handle the error as needed



  const newToken = {
    name: name,
    symbol: symbol,
    Taddress: result.canisterId,
    walletAddress : identity, // Replace with the user's wallet address
    category : "DIP20ICP",
    transactionHash : "transection",
  };


  console.log(newToken);



  axios.post('https://myapi-nboa.vercel.app/api/saveDeployedTokens', { deployedTokens: [newToken] })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

  const category = 'DIP20ICP'; // Replace with the desired category
  const walletAddress = identity; // Replace with the user's wallet address
  
  axios.get(`https://myapi-nboa.vercel.app/api/getDeployedTokens?category=${category}&walletAddress=${walletAddress}`)
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
  const fetchDataForCanister = async (id: string) => {
    if (id === ""){id = "wphza-r4aaa-aaaaa-qaeaa-cai"}
    const endpointUrl = 'http://127.0.0.1:4943/?canisterId=wmqac-jeaaa-aaaaa-qad5a-cai&id=';
  //  const agent = new HttpAgent({ host: endpointUrl });
 //   const myActor = Actor.createActor(idlFactory, {
 //     agent,
 //     canisterId: id,
 //   });
  
    try {
      // Call functions on the canister
    //  const name = await myActor.nameDip721();
   //   const logo = await myActor.logoDip721();
  
      return { id, title: name as string, imageSrc: image_url as string };
    } catch (error) {
      console.error('Error calling canister:', error);
      return null;
    }
  };

  // Function to fetch data for all canister IDs
  const fetchAllData = async () => {
    const cardsData = await Promise.all(canisterIds.map((id) => fetchDataForCanister(id)));
    const validCardsData = cardsData.filter((data) => data !== null) as { id: string; title: string; imageSrc: string }[];
  
    // Now validCardsData contains the data for all canister IDs
    // Use it to set the state or do whatever you need
    console.log('Valid Cards Data:', validCardsData);
  };
  
  // Call the fetchAllData function when needed, for example, in a useEffect
  useEffect(() => {
    fetchAllData();
  }, []); // Empty dependency array means it will run once when the component mounts
  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
    setState(e.target.value);
  
  };
  
  const handleReusltChange = (newResult: string) => {
      setResult1(newResult);
      console.log("result change", newResult);
  
      if (!canisterIds.includes(newResult)) {
        // Append the new canisterId to the list
        setCanisterIds((prevIds: string[]) => [...prevIds, newResult]);
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

 


    
    
const TotalCountDisplay= () => {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const fetchTotalCounts = async () => {
      try {
        // Replace this URL with the actual URL of your server
        const apiUrl = 'https://myapi-nboa.vercel.app/api/getDeployedTokensCount';

        const response = await fetch(apiUrl);
        const data = await response.json();



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

const [isTokenFunctionalityModalOpen, setIsTokenFunctionalityModalOpen] = useState(false);


const handleOpenTokenFunctionalityModal = (token) => {
  setIsTokenFunctionalityModalOpen(true);
};

// Function to close the modal
const handleCloseTokenFunctionalityModal = () => {
  setIsTokenFunctionalityModalOpen(false);
};
    






  return (

    <>    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
 

     
  <TotalCountDisplay />
    

  <div>
      <input
        type="text"
        value={nameID}
        onChange={(e) => setNameID(e.target.value)}
      />
      <button onClick={handleCreateID}>Create ID</button>
      <p> This ID is used for local and Test net only</p>
      <p> Name : {nameID}</p>
      <p> Principal: {identity}</p>
    </div>

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
        <><Form>
          <Title>DIP20 Standard</Title>
          <div>
            <Title1>Token Deployment</Title1>
        <Wrapper>
        <Input type="text" placeholder="Logo" value={image_url}   onChange={(e) => handleInputChange(e, setImage_url)}/>
        <Input type="text" placeholder="Name" value={name}   onChange={(e) => handleInputChange(e, setName)}/>
<Input type="text" placeholder="Symbol" value={symbol} onChange={(e) => handleInputChange(e, setSymbol)} />
<Input type="number" placeholder="Total Supply" value={totalSupply} onChange={(e) => handleInputChange(e, setTotalSupply)} />
<Input type="number" placeholder="Decimals" value={decimals} onChange={(e) => handleInputChange(e, setDecimals)} /> </Wrapper>
        <Submit onClick={deployTokenApiCall}>Deploy</Submit>

            <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={""}
        

      />
          </div>
          </Form> </>
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
    <TableCell style={{ backgroundColor: '#0F1F3F', color: '#fff', fontWeight: 'bold' }}>Transaction hash</TableCell>

  </TableRow>
</TableHead>
              <TableBody>
                {/* Display the tokens for the current page */}
                {tokensForPage.map((token, index) => (
                  <TableRow
                    key={token.address}
                    onMouseOver={() => handleMouseOverToken(index)}
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
                    <TableCell>{token.walletaddress}</TableCell>
                    <TableCell>{token.taddress}</TableCell>
                    <TableCell>{token.transactionhash}</TableCell>

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
        
 
    </>
  </>
      )}




  </ThemeProvider>
  
</>
      
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



