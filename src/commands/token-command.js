import fs from 'fs';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';
import { getSecretFromKeyVault } from '../utils/keyvault.js';
import { getTokenFromClientCredentials } from '../utils/token.js';

const CONFIG_PATH = path.join(os.homedir(), '.credkit', 'state.json');

export default async function tokenCommand() {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.error('❌ No configuration found. Please run `credkit add` or `credkit import <config file-path>` first.');
      return;
    }
  
    const configData = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  
    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'Select a token to generate:',
        choices: configData.map(entry => ({
          name: entry['display-name'],
          value: entry
        }))
      }
    ]);
  
    var selection = response.selection;
    const {
      'keyvault-name': keyVaultName,
      'client-id': clientId,
      'resource-id': resourceId,
      'keyvault-client-secret-name': secretName,
      'grant-type': grantType
    } = selection;
  
    try {
      const clientSecret = await getSecretFromKeyVault(keyVaultName, secretName);
      const token = await getTokenFromClientCredentials({
        clientId,
        clientSecret,
        resourceId,
        grantType
      });
  
      console.log(`\n🎟️  Token for ${selection['display-name']}:\n`);
      console.log(token);
    } catch (err) {
      console.error('❌ Failed to generate token:', err.message);
    }
  }
