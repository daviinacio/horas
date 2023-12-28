#!/usr/bin/env node
import { Command, CommanderError, createCommand } from "commander";
import { config } from "./config.js";
import * as actions from "./actions/index.js";

/** Default configuration */
config.setDefault('locale', 'pt-BR');
config.setDefault('dateformat', 'dd/MM/yyyy');
config.setDefault('timesheet_folder', '$/Documents/Horas');
config.setDefault('timesheet_file_dateformat', 'yyyy.MM.dd');
config.setDefault('timesheet_file_prefix', 'Horario_');
config.setDefault('timesheet_filename', 'Horario_yyyy.MM.dd');
config.setDefault('template_folder', `${config.get('timesheet_folder')}/Templates`);
config.setDefault('template_filename', 'DefaultTemplate.md');
config.setDefault('backup_folder', `${config.get('timesheet_folder')}/.backup`);

/** Setup */
const program = new Command();
program
  .name('task-time-manager')
  .description('A simple CLI app to manage local daily tasks notation files.')
  .version('0.6.0 node');

program.hook('preAction', (thisCommand, actionCommand) => {
  
});

program.hook('postAction', (thisCommand, actionCommand) => {
  
});

/** Commands */
program.addHelpCommand('ajuda', 'Ajuda geral');

const command_create = program.command('criar')
    .description('Comando para criação de arquivo de horas')
    .addHelpCommand('ajuda', 'Ajuda nos comandos de criação');

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

command_create.command('semana')
  .description('Criar controle para todos os dias úteis da semana')
  .action(() => actions.create.week(0))

  .addCommand(createCommand('atual')
    .description('Criar controle para todos os dias úteis da semana atual')
    .action(() => actions.create.week(0)))

  .addCommand(createCommand('passada')
    .description('Criar controle para todos os dias úteis da semana passada (semana atual -1)')
    .action(() => actions.create.week(-1)))

  .addCommand(createCommand('retrasada')
    .description('Criar controle para todos os dias úteis da semana retrasada (semana atual -2)')
    .action(() => actions.create.week(-2)));

command_create.command('mes')
  .description('Criar controle para todos os dias úteis do mês')
  .action(() => actions.create.month(0))

  .addCommand(createCommand('atual')
    .description('Criar controle para todos os dias úteis do mês atual')
    .action(() => actions.create.month(0)))

  .addCommand(createCommand('passado')
    .description('Criar controle para todos os dias úteis do mês passado (mês atual -1)')
    .action(() => actions.create.month(-1)))

  .addCommand(createCommand('retrasado')
    .description('Criar controle para todos os dias úteis do mês retrasado (mês atual -2)')
    .action(() => actions.create.month(-2)));

const command_calculate = program.command('calcular')
  .description('Comando de calculo de horas')
  .addHelpCommand('ajuda', 'Ajuda nos comandos de calculo');

command_calculate.command('hoje')
  .description('Horas de hoje')
  .argument('[busca]', 'texto da busca')
  .action(actions.calculate.today);

command_calculate.command('ontem')
  .description('Horas de ontem')
  .argument('[busca]', 'texto da busca')
  .action(actions.calculate.yesterday);

command_calculate.command('dia')
  .description('Horas de um dia específico')
  .argument('<data>', 'formato MM/dd/yyyy ou yyyy-MM-dd')
  .argument('[busca]', 'texto da busca')
  .action(actions.calculate.day);

command_calculate.command('semana')
  .description('Horas da semana')
  .argument('[busca]', 'texto da busca')
  .action((search) => actions.calculate.week(search, 0))

  .addCommand(createCommand('atual')
    .description('Horas da semana atual')
    .argument('[busca]', 'texto da busca')
    .action((search) => actions.calculate.week(search, 0)))

  .addCommand(createCommand('passada')
    .description('Horas da semana passada (semana atual -1)')
    .argument('[busca]', 'texto da busca')
    .action((search) => actions.calculate.week(search, -1)))

  .addCommand(createCommand('retrasada')
    .description('Horas da semana retrasada (semana atual -2)')
    .argument('[busca]', 'texto da busca')
    .action((search) => actions.calculate.week(search, -2)));

command_calculate.command('mes')
  .description('Horas do mês atual')
  .argument('[busca]', 'texto da busca')
  .action((search) => actions.calculate.month(search, 0))

  .addCommand(createCommand('atual')
    .description('Horas do mês atual')
    .argument('[busca]', 'texto da busca')
    .action((search) => actions.calculate.month(search, 0)))

  .addCommand(createCommand('passado')
    .description('Horas do mês passado (mês atual -1)')
    .argument('[busca]', 'texto da busca')
    .action((search) => actions.calculate.month(search, -1)))

  .addCommand(createCommand('retrasado')
    .description('Horas do mês retrasado (mês atual -2)')
    .argument('[busca]', 'texto da busca')
    .action((search) => actions.calculate.month(search, -2)));

program.command('atualizar')
  .description('Buscar por novas atualizações')
  .action(actions.manage.update);

program.command('config')
  .description('Ler ou alterar uma configuração')
  .argument('[key]', 'Nome do valor a ser configurado')
  .argument('[value]', 'Valor a ser armazenado')
  .option('-g, --global', 'Define a configuração globalmente')
  .option('-u, --unset <string>', 'Restaura valor padrão')
  .option('-l, --list-all', 'Lista todas as configurações armazenadas')
  .option('--get <string>', 'Ler o valor de uma configuração')
  .action(actions.manage.configure);

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
