#!/usr/bin/env node
import { Command } from "commander";
import { config } from "./config";

/** Default configuration */
config.setDefault('timesheet_folder', '$/Documents/Horas');

/** Setup */

const program = new Command();
program
  .name('task-time-manager')
  .description('A simple CLI app to manage local daily tasks notation files.')
  .version('0.6.0');


/** Commands */

program.command('criar')
  .description('Comando para criação de arquivo de horas')
  .action(() => {
    console.log(config.get('timesheet_folder'));

  });

program.parse(process.argv);
