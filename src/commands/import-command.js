import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const CONFIG_DIR = path.join(os.homedir(), '.credkit');
const STATE_FILE = path.join(CONFIG_DIR, 'state.json');

// Needed for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR);
  }
}

export default async function importCommand(filePath) {
  try {

    const absolutePath = path.resolve(process.cwd(), filePath);
    const config = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

    ensureConfigDir();

    // Save config
    fs.writeFileSync(STATE_FILE, JSON.stringify(config, null, 2), 'utf8');
    console.log('✅ Configuration imported successfully!');
  } catch (err) {
    console.error('❌ Failed to import config:', err.message);
  }
}