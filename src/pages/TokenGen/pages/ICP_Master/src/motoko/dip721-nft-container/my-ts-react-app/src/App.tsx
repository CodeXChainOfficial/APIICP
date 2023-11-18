import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react"
import axios from "axios"; // Import Axios for making HTTP requests
import { HttpAgent, Actor, ActorConfig } from '@dfinity/agent';
import { canisterId, idlFactory } from './declarations';
import Modal from 'react-modal';
import deepai from 'deepai'; // OR include deepai.min.js as a script tag in your HTML
import Card from './card';
import Carousel from './Carousel';

deepai.setApiKey('c039b3f1-ca9e-4084-b084-e53ebe3f7941');



interface MyComponentProps {
  isOpen: boolean;
  closeModal: () => void;  // Add closeModal prop
  name: string;
  logo: string;
}
Modal.setAppElement('#root');

const MyComponent: React.FC<MyComponentProps> = ({ isOpen, closeModal, name, logo }) => {
  return (
    <div>
      <button onClick={closeModal}>Close Modal</button>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        appElement={document.getElementById('root') || undefined} // Replace 'root' with the actual ID or class

        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)', // Add blur to the background
          },
          content: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // 75% transparent black background
            border: '1px solid lightblue', // Light blue border
            color: 'white', // White text
          },
        }}
      >
        <h2>{name}</h2>
        <img src={logo} alt="Logo" style={{ maxWidth: '100%' }} />
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
    </div>
  );
};




const App: React.FC = () => {



  const [data, setData] = useState<{ id: string; title: string; imageSrc: string }[]>([]);


  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (image) {
      try {
        const base64Image = await convertFileToBase64(image);
        const resp = await deepai.callStandardApi('image-editor', {
          image: base64Image,
          text: text || 'Default text',
        });
        console.log(resp);
        if (resp && resp.output_url) {
          setOutputUrl(resp.output_url);
          setImage_url(resp.output_url)
        }
      } catch (error) {
        console.error('Error calling DeepAI API:', error);
      }
    } else {
      console.error('No image selected');
    }
  };
  


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
  const openModal = async (id: string) => {
    setSelectedId(id);
    const endpointUrl = 'http://127.0.0.1:4943/?canisterId=zdtmx-wmaaa-aaaaa-qac2q-cai&id='; // Replace with the appropriate endpoint
console.log(id)
    const agent = new HttpAgent({ host: endpointUrl });
    const myActor = Actor.createActor(idlFactory,{
      agent,
      canisterId: id,
  });
    try {
      // Call a function on the canister
      const name = await myActor.nameDip721();
      console.log('name',name)
      const logo = await myActor.logoDip721();
  console.log('logo',logo)
  setSelectedData({ name: name as string, logo: logo as string });
  setModalIsOpen(true);
      return name;
    } catch (error) {
      console.error('Error calling canister:', error);
    }
    // Handle the data as needed (e.g., set it in state for the modal)
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  // Assuming this is inside a React component

// Define a function to fetch data for a canister ID
const fetchDataForCanister = async (id: string) => {
  const endpointUrl = 'http://127.0.0.1:4943/?canisterId=zdtmx-wmaaa-aaaaa-qac2q-cai&id=';
  const agent = new HttpAgent({ host: endpointUrl });
  const myActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: id,
  });

  try {
    // Call functions on the canister
    const name = await myActor.nameDip721();
    const logo = await myActor.logoDip721();

    return { id, title: name as string, imageSrc: logo as string };
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
// Assuming you have a function to handle the API call
const deployTokenApiCall = async () => {

  console.log(CollectionName)

  console.log(image_url)
  console.log(CollectionName,CollectionLimit,image_url,mintname,description)

  try {
    const response = await fetch('http://localhost:5004/api/createToken', {
      method: 'POST',
      headers: {  
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ CollectionName, CollectionLimit, image_url, mintname, description }),
    });

    if (!response.ok) {
      throw new Error('Error deploying token.');
    }
    const result = await response.json();
   console.log(result)
    // Define a function to wait for a condition with a timeout
    const waitForCondition = (conditionFunction: { (): Promise<boolean>; (): any; }, timeout: number) => {
      return new Promise((resolve, reject) => {
        const interval = 100; // check every 100 milliseconds
        const endTime = Date.now() + timeout;
    
        const checkCondition = async () => {
          const result = await conditionFunction();
          if (result) {
            resolve(result);
          } else if (Date.now() < endTime) {
            setTimeout(checkCondition, interval);
          } else {
            reject(new Error('Timeout waiting for condition.'));
          }
        };
    
        checkCondition();
      });
    };
    
    try {
      // Wait for canisterId to change or timeout after 40 seconds
      await waitForCondition(async () => result.canisterId !== '', 40000);
    
      // If the waiting succeeds, handle the result change
      console.log('API Call Result:', result);
      setResult1(result.canisterId);
      handleReusltChange(result.canisterId)
      fetchDataForCanister(result.canisterId);

          } catch (error) {
      console.error('Error:', error.message);
    }
    
    // Handle the result as needed
  } catch (error) {
    console.error('API Call Error:', error);
    // Handle the error as needed
  }
};
const canisterLink = `http://127.0.0.1:4943/?canisterId=zdtmx-wmaaa-aaaaa-qac2q-cai&id=${result1}`; // Replace 'your-id' with the actual id


const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading file as base64'));
    };
    reader.readAsDataURL(file);
  });
};

const [selectedOption, setSelectedOption] = useState('');

const handleOptionChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
  setSelectedOption(e.target.value);
};

const callCanister = async () => {
  const canisterId = result1; // Replace with your actual canister ID
  const endpointUrl = 'http://127.0.0.1:4943/?canisterId=zdtmx-wmaaa-aaaaa-qac2q-cai&id='; // Replace with the appropriate endpoint

  const agent = new HttpAgent({ host: endpointUrl });
  const actorConfig: ActorConfig = {
    canisterId: canisterId,
    agent: agent,
  };

  const myActor = Actor.createActor(idlFactory,{
    agent,
    canisterId,
});
  try {
    // Call a function on the canister
    const name = await myActor.nameDip721();
    console.log('name',name)
    const logo = await myActor.logoDip721();
console.log('logo',logo)


    
    return name;
  } catch (error) {
    console.error('Error calling canister:', error);
  }
};


const UploadImageComponent: React.FC = () => {
  
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        const base64Image = await convertFileToBase64(selectedFile);
        const resp = await deepai.callStandardApi('image-editor', {
          image: base64Image,
          text: 'Default text',
        });
        if (resp && resp.output_url) {
          setImage_url(resp.output_url);
        }
      } catch (error) {
        console.error('Error calling DeepAI API:', error);
      }
    }
  };
  

 

  return (
    <div>
     <input type="file" onChange={handleImageUpload} accept="image/*" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

const UploadAndModifyComponent: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string>('');

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    try {
      const base64Image = await convertFileToBase64(selectedFile);
      const resp = await deepai.callStandardApi('image-editor', {
        image: base64Image,
        text: 'Default text',
      });
      if (resp && resp.output_url) {
        setImage_url(resp.output_url);
      }
    } catch (error) {
      console.error('Error calling DeepAI API:', error);
    }
  }
};

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (image) {
      try {
        // Convert image to base64 and make API call
        const base64Image = await convertFileToBase64(image);
        const resp = await deepai.callStandardApi('image-editor', {
          image: base64Image,
          text: text || 'Default text',
        });

        if (resp && resp.output_url) {
          // Handle the output URL as needed
          setImage_url(resp.output_url);
        }
      } catch (error) {
        console.error('Error calling DeepAI API:', error);
      }
    } else {
      console.error('No image selected');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <input type="text" placeholder="Enter your text" value={text} onChange={handleTextChange} />
      <button onClick={handleSubmit}>Submit</button>
      {/* Add any additional UI or logic as needed */}
    </div>
  );
};

const GenerateFromTextComponent: React.FC = () => {
  const [text, setText] = useState<string>('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (text) {
      try {
        // Make API call to generate image from text
        console.log(text)
        const resp = await deepai.callStandardApi("text2img", {
          text: text,
        });
console.log(resp.output_url)
          // Handle the output URL as needed
          setImage_url(resp.output_url);
        
      } catch (error) {
        console.error('Error calling DeepAI API:', error);
      }
    } else {
      console.error('Text input is empty');
    }
  };

  return (
    <div>
      <input type="text" placeholder="Enter your text" value={text} onChange={handleTextChange} />
      <button onClick={handleSubmit}>Submit</button>
      {/* Add any additional UI or logic as needed */}
    </div>
  );
};


return (
  <div className="App">

    <header className="App-header">
      <title>Token Deployment</title>
      <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">Select an option</option>
        <option value="upload">Upload your image</option>
        <option value="uploadAndModify">Upload your image and modify with text</option>
        <option value="generateFromText">Generate your image from text</option>
      </select>

      {selectedOption === 'upload' && <UploadImageComponent />}
      {selectedOption === 'uploadAndModify' && <UploadAndModifyComponent />}
      {selectedOption === 'generateFromText' && <GenerateFromTextComponent />}
    </div>
      <div>
      <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
      <input type="text" id="textInput" placeholder="Enter your text" value={text} onChange={handleTextChange} />

      <button id="submitBtn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
    {outputUrl && (
        <div>
          <p>Output URL: {outputUrl}</p>
          <img src={outputUrl} alt="Output" />
        </div>
      )}
      <input type="text" placeholder="Collection Name" value={CollectionName} onChange={(e) => handleInputChange(e, setCollectionNamel)} />
      <input type="text" placeholder="Mint Limit" value={CollectionLimit} onChange={(e) => handleInputChange(e, setCollectionLimit)} />
     

      <input type="text" placeholder="Img" value={image_url} onChange={(e) => handleInputChange(e, setImage_url)} />
      <input type="text" placeholder="Name" value={mintname} onChange={(e) => handleInputChange(e, setMintName)} />
      <input type="text" placeholder="Symbol" value={description} onChange={(e) => handleInputChange(e, setDescription)} />
      <button onClick={deployTokenApiCall}>Deploy</button>

      <div>
      <p>New Canister ID created is: {result1}<img src={image_url} alt="Image" style={{ maxWidth: '100%' }} /></p>

      <ul>
      <Carousel data={data} />

        {canisterIds.map((id) => (
          <li key={id} onClick={() => openModal(id)}>
{canisterIds.map((id) => (
  <Card
    key={id}
    id={id}
    title={fetchDataForCanister(id)?.title || 'Default Title'}
    imageSrc={fetchDataForCanister(id)?.imageSrc || 'defaultImageSrc'} subtitle={''} time={''}  />
))}          </li>
        ))}
      </ul>

      <MyComponent
        isOpen={modalIsOpen}
        closeModal={closeModal}
        name={selectedData.name}
        logo={selectedData.logo}
      />
    </div>
    </header>
  </div>
);

};


export default App;


