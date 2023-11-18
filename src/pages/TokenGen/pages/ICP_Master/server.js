
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg';
import {exec} from 'child_process'
import fs from 'fs'
import {spawn} from 'child_process'


const app = express();
const port = 5004;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:1CCf63d-c25c3dgff1Cab6F2A5*C5cFC@roundhouse.proxy.rlwy.net:38917/railway';
const { Client } = pkg;

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
  }
}

connectToDatabase();

// Check if the LastToken table exists and create it if not
async function initDatabase() {
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'LastToken'
      );
    `);

    const tableExists = result.rows[0].exists;

    if (!tableExists) {
      // Create the LastToken table if it does not exist
      await client.query(`
        CREATE TABLE LastToken (
          name TEXT,
          symbol TEXT,
          Taddress TEXT,
          walletAddress TEXT,
          category TEXT,
          transactionHash TEXT
        );
      `);

      console.log('LastToken table created');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}


try {
  const result = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'ICPTokens2'
    );
  `);

  const tableExists = result.rows[0].exists;

  if (!tableExists) {
    // Create the LastToken table if it does not exist
    await client.query(`
      CREATE TABLE ICPTokens2 (
        logo TEXT,
        name TEXT,
        symbol TEXT,
        decimals TEXT,
        totalsupply TEXT,
        fee TEXT
      );
    `);

    console.log('ICPTokens2 table created');
  }
} catch (error) {
  console.error('Error initializing database ICPTokens:', error);
}


initDatabase();

// Assuming the output format is like "Canister ID: <canisterId>"
// Assuming the output format is like "Canister ID: <canisterId>"


const executeBash = async (image_url, decimals, totalSupply, name, symbol, identity) => {
  const scriptPath = './src/motoko/DIP20/motoko/bash.sh';
  try {
    const scriptOutput = await executeScript(scriptPath, [image_url, decimals, totalSupply, name, symbol, identity]);

    console.log('Bash script execution DeployToken:', scriptOutput);
  } catch (error) {
    console.error('Error executing script:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};


const executeBashID = async (nameID) => {
  const scriptPath = './identity.sh';
  try {
    const scriptOutput = await executeScript(scriptPath, [nameID]);

  

    console.log('Bash script execution result:', scriptOutput);
    return scriptOutput;
  } catch (error) {
    console.error('Error executing script:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
// Import necessary modules

// ... (previous code)
app.post('/api/checkcanister', async (req, res) => {
  const canisterId = fs.readFileSync('./src/motoko/DIP20/motoko/canister-id-dip20', 'utf8').trim();
  res.json({ success: true, message: 'Token deployed successfully.', canisterId });

});


app.post('/api/DIP20', async (req, res) => {
  const { image_url, identity, name, symbol, decimals, totalSupply } = req.body;

  try {
    // Execute the script with the provided data
    // You might need to modify this based on your script
    await executeBash(image_url, decimals, totalSupply, name, symbol, identity);



    // Read Canister ID from the file
    const canisterId = fs.readFileSync('./src/motoko/DIP20/motoko/canister-id-dip20', 'utf8').trim();

    res.json({ success: true, message: 'Token deployed successfully.', canisterId });
  } catch (error) {
    console.error('Error deploying token:', error);
    res.status(500).json({ success: false, message: 'Error deploying token.' });
  }
});
function executeScript(scriptPath, args, callback) {
  const process = spawn('bash', [scriptPath, ...args]);

  let scriptOutput = '';
  let scriptErrors = '';

  process.stdout.on('data', (data) => {
    scriptOutput += data.toString();
  });

  process.stderr.on('data', (data) => {
    scriptErrors += data.toString();
  });

  process.on('close', (code) => {
    if (code === 0) {
      console.log('Script executed successfully');
      if (callback) {
        callback(scriptOutput, scriptErrors);
      }
    } else {
      console.error(`Script execution failed with code ${code}`);
      console.error('Script errors:', scriptErrors);
      if (callback) {
        callback(null, scriptErrors);
      }
    }
  });
}
app.post('/api/identity', async (req, res) => {
  const { nameID } = req.body;

  try {
    // Execute the script with the provided data
    // You might need to modify this based on your script
    await executeBashID(nameID);

    // Read Canister ID from the file
    const identity = fs.readFileSync('ID-id-file', 'utf8').trim();

    res.json({ success: true, message: 'New Identity.', identity });
  } catch (error) {
    console.error('Identity:', error);
    res.status(500).json({ success: false, message: 'Error deploying token.' });
  }
});


// API endpoint to save deployed tokens
app.post('/api/postDIP20', async (req, res) => {
  const deployedTokens = req.body.deployedTokens;
  console.log('Received request at post /api/saveDeployedTokens');

  try {
    for (const token of deployedTokens) {
      await client.query('INSERT INTO LastToken VALUES ($1, $2, $3, $4, $5, $6)', [
        token.name,
        token.symbol,
        token.Taddress,
        token.walletAddress,
        token.category,
        token.transactionHash,
      ]);
    }

    res.json({ success: true, message: 'Tokens saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error saving tokens.' });
  }
});

// API endpoint to get deployed tokens based on category and walletAddress
app.get('/api/getDIP20', async (req, res) => {
  const { category, walletAddress } = req.query;

  try {
    // Query the database based on category and walletAddress
    console.log('Received request at get /api/getDeployedTokens');
    console.log('Request query:', req.query);

    let query = 'SELECT name, symbol, Taddress, walletAddress, category, "transactionhash" FROM LastToken    ';
    const params = [];

    if (category && walletAddress) {
      query += ' WHERE category = $1 AND walletAddress = $2';
      params.push(category, walletAddress);
    } else if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    } else if (walletAddress) {
      query += ' WHERE walletAddress = $2';
      params.push(walletAddress);
    }

    const result = await client.query(query, params);
    const storedTokens = result.rows;

    if (storedTokens.length === 0) {
      // No tokens found
      res.json({ success: true, message: 'No tokens found for the given category and wallet address.', deployedTokens: [] });
    } else {
      // Tokens found
      res.json({ success: true, deployedTokens: storedTokens });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving tokens.' });
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
