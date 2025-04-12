import inquirer from 'inquirer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { listSubscriptions, listKeyVaults, listSecretsFromVault } from '../utils/keyvault.js';

const CONFIG_DIR = path.join(os.homedir(), '.credkit');
const STATE_FILE = path.join(CONFIG_DIR, 'state.json');

function ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR);
    }
}

function loadConfig() {
    ensureConfigDir();
    if (!fs.existsSync(STATE_FILE)) return [];
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveConfig(data) {
    ensureConfigDir();
    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export default async function addCommand() {
    const configData = loadConfig();

    const { displayName } = await inquirer.prompt({
        type: 'input',
        name: 'displayName',
        message: 'What would you like to call the name of token generation scope? * (e.g. myapp-dev-token)',
        validate: input => input.trim() !== '' || 'This field is required.'
    });

    const { clientId } = await inquirer.prompt({
        type: 'input',
        name: 'clientId',
        message: "What's the client ID? *",
        validate: input => input.trim() !== '' || 'This field is required.'
    });

    const subs = await listSubscriptions();
    const { selectedSubId } = await inquirer.prompt({
    type: 'list',
    name: 'selectedSubId',
    message: 'Select a subscription:',
    choices: subs.map(s => ({ name: `${s.name} (${s.id})`, value: s.id }))
    });

    const keyvaults = await listKeyVaults(selectedSubId);
    const { keyVaultName } = await inquirer.prompt({
        type: 'list',
        name: 'keyVaultName',
        message: "Where's the secret located? (select keyvault)",
        choices: keyvaults
    });

    const secretList = await listSecretsFromVault(keyVaultName);
    const { secretName } = await inquirer.prompt({
        type: 'list',
        name: 'secretName',
        message: "Which secret holds the client secret?",
        choices: secretList
    });

    const { resourceId } = await inquirer.prompt({
        type: 'input',
        name: 'resourceId',
        message: "What's the resource ID? ",
        validate: input => input.trim() !== '' || 'This field is required.'
    });

    const newEntry = {
        'display-name': displayName,
        'client-id': clientId,
        'keyvault-name': keyVaultName,
        'keyvault-client-secret-name': secretName,
        'grant-type': 'client_credentials',
        'resource-id': resourceId
    };

    configData.push(newEntry);
    saveConfig(configData);

    console.log('✅ New token config added successfully!');
}