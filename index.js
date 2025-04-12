#!/usr/bin/env node

import { Command } from 'commander';
import importCommand from "./src/commands/import-command.js"
import tokenCommand from "./src/commands/token-command.js"
import addCommand from './src/commands/add-command.js';
import clearCommand from './src/commands/clear-command.js';
import { ensureAzLogin } from './src/utils/keyvault.js';
import { checkNodeVersion } from './src/utils/checkNodeVersion.js';

const program = new Command();

ensureAzLogin();
checkNodeVersion('18.0.0');

program
  .name('credkit')
  .description('CLI to manage secrets and generate tokens')
  .version('1.0.0');

program
  .command('import')
  .description('Import configuration JSON')
  .argument('<filepath>', 'Path to config JSON file')
  .action(importCommand);


program
  .command('token')
  .description('Generate token from imported config')
  .action(tokenCommand);

program
  .command('add')
  .description('Add new token generation config')
  .action(addCommand);

program
  .command('clear')
  .description('Clears all token generation configuration')
  .action(clearCommand);

program.parse();