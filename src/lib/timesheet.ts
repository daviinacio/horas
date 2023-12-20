import { config } from "../config.js";
import { getMonthFolderName } from "../constants.js";
import { MonthNumber } from "../types.js";
import { utils } from "../utils.js";

export function getTimesheetMonthPathByDate(date: Date){
  return `${
    config.get('timesheet_folder')
  }/${
    date.getFullYear()
  }/${
    getMonthFolderName(date.getMonth() + 1 as MonthNumber)
  }`;
}

export function getTimesheetFilenameByDate(date: Date){
  const formattedDate = utils.format.dateformat(date, config.get('timesheet_file_dateformat'));
  return config.get('timesheet_file_prefix') + formattedDate + '.md';
}

export function createTimesheetByDate(date: Date){
  const template_folder = config.get('template_folder');
  const template_filename = config.get('template_filename');
  const template_filepath = `${template_folder}/${template_filename}`;

  if(!utils.io.exists(template_filepath)) {
    throw new Error('Arquivo template nao encontrado');
  }

  const folder_name = getTimesheetMonthPathByDate(date);
  const file_name = getTimesheetFilenameByDate(date);
  const timesheet_filepath = `${folder_name}/${file_name}`;

  if(utils.io.exists(timesheet_filepath)) {
    throw new Error(`Controle de horas ja criado para ${
      utils.format.dateformat(date)
    }`);
  }

  const templateData = utils.io.readFile(template_filepath);
  utils.io.mkdirRecursive(folder_name);
  utils.io.writeFile(timesheet_filepath, templateData);

  console.log(`Controle de horas criado com sucesso para o dia ${
    utils.format.dateformat(date)
  }`);
}
