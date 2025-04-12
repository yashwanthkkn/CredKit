import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.credkit');
const STATE_FILE = path.join(CONFIG_DIR, 'state.json');

export default async function clearCommand() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
      console.log('🧹 State cleared successfully!');
    } else {
      console.log('ℹ️ No state file found to clear.');
    }
  } catch (err) {
    console.error('❌ Error clearing state file:', err.message);
  }
}