#!/usr/bin/env node
import { Command } from "commander";
import { config } from "./config";
import * as actions from './actions';

/** Default configuration */
config.setDefault('locale', 'pt-BR');
config.setDefault('dateformat', 'dd/MM/yyyy');
config.setDefault('timesheet_folder', '$/Documents/Horas');
config.setDefault('backup_folder', `${config.get('timesheet_folder')}/.backup`);
config.setDefault('template_folder', `${config.get('timesheet_folder')}/Templates`);
config.setDefault('timesheet_file_prefix', 'Horario_');
config.setDefault('timesheet_file_dateformat', 'yyyy.MM.dd');
config.setDefault('template_filename', 'DefaultTemplate.md');

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
    actions.create.today();
  });

program.parse(process.argv);
