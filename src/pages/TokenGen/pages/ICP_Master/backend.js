import fs from 'fs';
import { exec } from 'child_process';

export function createToken(tokenData) {
  // Update token_config.json
  console.log('create token start');
  const configFile = './token_config.json'
  let tokenConfig = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  tokenConfig.tokens.push(tokenData);
  fs.writeFileSync(configFile, JSON.stringify(tokenConfig, null, 2));
}

export function executeBash() {
  exec('./bash.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);
  });
}
