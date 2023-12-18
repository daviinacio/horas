#!/usr/bin/env node
import { Command } from "commander";
import { config } from "./config";
import * as actions from "./actions";

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

program.hook('preAction', (thisCommand, actionCommand) => {
  
});

program.hook('postAction', (thisCommand, actionCommand) => {
  
});

/** Commands */
actions.create.setup(program);
actions.calculate.setup(program);

/** Runtime Execution */
program.exitOverride();

try {
  program.parse(process.argv);
} catch (err) {
  if(err instanceof Error){
    console.error(err.message);
  }
}
