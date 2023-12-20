#!/usr/bin/env node
import { Command, CommanderError, createCommand } from "commander";
import { config } from "./config";
import * as actions from "./actions";

/** Default configuration */
config.setDefault('locale', 'pt-BR');
config.setDefault('dateformat', 'dd/MM/yyyy');
config.setDefault('timesheet_folder', '$/Documents/Horas');
config.setDefault('timesheet_file_dateformat', 'yyyy.MM.dd');
config.setDefault('timesheet_file_prefix', 'Horario_');
config.setDefault('template_folder', `${config.get('timesheet_folder')}/Templates`);
config.setDefault('template_filename', 'DefaultTemplate.md');
config.setDefault('backup_folder', `${config.get('timesheet_folder')}/.backup`);

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
const command_create = program.command('criar')
    .description('Comando para criação de arquivo de horas');

command_create.command('hoje')
  .description('Criar controle para hoje')
  .action(actions.create.today);

command_create.command('amanha')
  .description('Criar controle para amanhã')
  .action(actions.create.tomorrow);

command_create.command('segunda')
  .description('Criar controle para proxima segunda-feira')
  .action(actions.create.monday);

command_create.command('dia')
  .description('Criar controle para um dia específico')
  .argument('<data>', 'formato MM/dd/yyyy ou yyyy-MM-dd')
  .action(actions.create.day);


const command_calculate = program.command('calcular')
  .description('Comando de calculo de horas');

command_calculate.command('hoje')
  .description('Horas de hoje')
  .action(actions.calculate.today);

command_calculate.command('ontem')
  .description('Horas de ontem')
  .action(actions.calculate.yesterday);

command_calculate.command('dia')
  .description('Horas de um dia específico')
  .argument('<data>', 'formato MM/dd/yyyy ou yyyy-MM-dd')
  .action(actions.calculate.day);

command_calculate.command('mes')
  .description('Horas do mês atual')
  .action(() => actions.calculate.month(0))

  .addCommand(createCommand('atual')
    .description('Horas do mês atual')
    .action(() => actions.calculate.month(0)))

  .addCommand(createCommand('passado')
    .description('Horas do mês passado (mês atual -1)')
    .action(() => actions.calculate.month(-1)))

  .addCommand(createCommand('retrasado')
    .description('Horas do mês retrasado (mês atual -2)')
    .action(() => actions.calculate.month(-2)))

/** Runtime Execution */
program.exitOverride();

try {
  program.parse(process.argv);
  
} catch (err) {
  if(err instanceof CommanderError){

  }
  else
  if(err instanceof Error){
    console.error(err.message);
  }
}
