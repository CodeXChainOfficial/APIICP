import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import util from 'util';
import { exec } from 'child_process';
import fs from 'fs';


const app = express();
const port = 5004;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); 
// Create a new token



let db;

const executeScript = async (scriptPath, args) => {
  try {
    const { stdout, stderr } = await exec(`${scriptPath} ${args.join(' ')}`);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
    return stdout;
  } catch (error) {
    console.error('Error executing script:', error);
    throw error;
  }
};

async function initDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  // Check if the newToken table exists
  const tableExists = await db.get('SELECT name FROM sqlite_master WHERE type = "table" AND name = "LastToken"');

  if (!tableExists) {
    // Create the newToken table if it does not exist
    await db.exec(`
      CREATE TABLE LastToken (
        name TEXT,
        symbol TEXT,
        Taddress TEXT,
        walletAddress TEXT,
        category TEXT,
        transactionHash TEXT
      );
    `);
  }
}
// Assuming the output format is like "Canister ID: <canisterId>"
// Assuming the output format is like "Canister ID: <canisterId>"


const executeBash = async (image_url, description, mintname, CollectionName, CollectionLimit) => {
  const scriptPath = './bash.sh';
  try {
    const scriptOutput = await executeScript(scriptPath, [image_url, description, mintname, CollectionName, CollectionLimit]);

  

    console.log('Bash script execution result:', scriptOutput);
  } catch (error) {
    console.error('Error executing script:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
// Import necessary modules

// ... (previous code)

app.post('/api/createToken', async (req, res) => {
  const { CollectionName, CollectionLimit, image_url, mintname, description } = req.body;

  try {
    // Execute the script with the provided data
    // You might need to modify this based on your script
    await executeBash(image_url, description, mintname, CollectionName, CollectionLimit);

    // Read Canister ID from the file
    const canisterId = fs.readFileSync('canister-id-file', 'utf8').trim();

    res.json({ success: true, message: 'Token deployed successfully.', canisterId });
  } catch (error) {
    console.error('Error deploying token:', error);
    res.status(500).json({ success: false, message: 'Error deploying token.' });
  }
});




let storedCanisterInfo = null;

// ... (previous code)

// Define a schema and model for your tokens
/*const tokenSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  tokenAddress: String,
  walletAddress: String,
  category: String,
  // Add other properties as needed
});

const Token = mongoose.model('Token', tokenSchema);



// ... (previous code)*/

/*

app.post('/api/scriptInfo', (req, res) => {
  const { canisterInfo } = req.body;
  storedCanisterInfo = canisterInfo; // Store canisterInfo

  // Respond with a success message
  res.json({ message: 'Data receive successfully',storedCanisterInfo });
});

app.get('/api/scriptInfo', (req, res) => {
  // Respond with the storedCanisterInfo
  res.json({ storedCanisterInfo });
});


app.get('/api/storedCanisterInfo', (req, res) => {
  // Retrieve the storedCanisterInfo (implement this logic based on how you store it)
  const storedCanisterInfo = // retrieve your storedCanisterInfo

  // Respond with the storedCanisterInfo
  res.json({ storedCanisterInfo });
});


app.get("/indexICP", (req, res) => {
  const principal = req.query.principal; // Retrieve the principal from the query parameters
  const agent = JSON.parse(req.query.agent); // Parse the agent from JSON
  const actor = JSON.parse(req.query.actor); // Parse the actor from JSON

  res.send(`
    <html>
      <head>
        <title>ICP Data</title>
      </head>
      <body>
        <h1>Principal: ${principal}</h1>
        <p>Agent: ${JSON.stringify(agent)}</p>
        <p>Actor: ${JSON.stringify(actor)}</p>
      </body>
    </html>
  `);

  // Now you have access to the principal, agent, and actor.

  // Your logic here...

  res.send("Hello ICP Page"); // Respond to the request
});

*/

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
