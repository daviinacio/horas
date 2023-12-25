import * as common from './common.js';
import * as utils from '../../utils/index.js';

export function create(date: Date){
  const template_path = common.getCurrentTemplatePath();

  if(!utils.io.exists(template_path)) {
    throw new Error('Arquivo template nao encontrado');
  }

  const timesheet_path = common.getTimesheetFilePathByDate(date);

  if(utils.io.exists(timesheet_path)){
    throw new Error(`Controle de horas ja criado para ${
      utils.date.format(date)
    }`);
  }

  const month_path = common.getMonthPathByDate(date);
  const template_date = utils.io.readFile(template_path);

  utils.io.mkdir(month_path);
  utils.io.writeFile(timesheet_path, template_date);

  console.log(`Controle de horas criado com sucesso para o dia ${
    utils.date.format(date)
  }`);
}
