#!/usr/bin/env node
import { Command } from "commander";
import { config } from "./config";

/** Setup */

console.log(config.get('timesheet_folder'));

config.set('timesheet_folder', 'value');

const program = new Command();
program
  .name('task-time-manager')
  .description('A simple CLI app to manage local daily tasks notation files.')
  .version('0.6.0');


/** Commands */

program.command('criar')
  .description('Comando para criação de arquivo de horas')
  .action(() => {
    console.log('criar arquivo')
  });

program.parse(process.argv);
