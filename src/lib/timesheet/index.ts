import * as common from './common.js';
import * as utils from '../../utils/index.js';

export function create(date: Date){
  const month_path = common.getMonthPathByDate(date);
  const template_path = common.getCurrentTemplatePath();
  const timesheet_path = common.getTimesheetFilePathByDate(date);

  if(!utils.io.exists(template_path)) {
    throw new Error('Arquivo template nao encontrado');
  }

  if(utils.io.exists(timesheet_path)){
    throw new Error(`Controle de horas ja criado para ${
      utils.date.format(date)
    }`);
  }

  utils.io.mkdir(month_path);
  cloneTemplate(template_path, timesheet_path);

  console.log(`Controle de horas criado com sucesso para o dia ${
    utils.date.format(date)
  }`);
}

function cloneTemplate(template_path: string, timesheet_path: string){
  // TODO: Implement copy metadata from last day
  utils.io.writeFile(timesheet_path, utils.io.readFile(template_path));
}

const dayOffMarks = 'Feriado, Facultativo, Fim de semana, Folga';
const registeredMark = 'Anotado';

export function monthCalc(date:Date){
  // TODO: Implement this method
}

type Task = {
  name: string
  checked: boolean
};

type DayCalcResult = {
  isRegistered: boolean
  isDayOff: boolean
  partialTime: Time
  registeredTime: Time
  tasks: Task[]
  props: string[]
}

export function dayCalc(date: Date): DayCalcResult {
  const timesheet_path = common.getTimesheetFilePathByDate(date);

  if(!utils.io.exists(timesheet_path)){
    throw new Error('Não existe controle de horas para esse dia');
  }

  const result: DayCalcResult = {
    isRegistered: false,
    isDayOff: false,
    partialTime: new Time(0),
    registeredTime: new Time(0),
    tasks: [],
    props: []
  };

  const timesheetContent = utils.io.readFile(timesheet_path);

  for(let line of timesheetContent.split('\n')){
    lineCalc(line, result);
  }

  result.isRegistered = registeredMark.split(',')
    .some(mark => result.props.includes(mark));

  result.isDayOff = dayOffMarks.split(',')
    .some(mark => result.props.includes(mark));

  return result;
}

export function printDayCalcResult(date: Date, result: DayCalcResult){
  //console.log(common.getTimesheetFilenameByDate(date), result);
  console.log(
    `Total de horas do dia ${utils.date.format(date)} ` +
    `${result.registeredTime} ` +
    `[${result.tasks.filter(t => t.checked).length}/${result.tasks.length}] ` +
    result.props.join(' - ')
  )
}

function lineCalc(line: string, result: DayCalcResult): void {
  // File properties
  if(line.substring(0, 6) === '- [x] '){
    const name = line.substring(6).trim();
    if(name === '') return;

    result.props.push(name);
  }

  // Task
  const taskOpenIndex = line.indexOf('. [');
  if(taskOpenIndex > -1 && taskOpenIndex <= 2){
    const name = line.substring(taskOpenIndex + 6).trim();
    if(name === '') return;

    const checked = line.charAt(taskOpenIndex + 3).toLowerCase() === 'x';

    result.tasks.push({
      name, checked
    })
  }

  // 30 minutes
  if(line.charAt(2) === ':'){
    if(line.substring(8, 11) === 'OFF') return;
    if(line.charAt(8) === '') return;
    
    result.registeredTime.addMinutes(30);

    if(line.charAt(8) === '@')
      result.partialTime.addMinutes(30);
  }

  // 15 minutes
  if(line.charAt(4) === ':'){
    if(line.substring(10, 13) === 'OFF') return;
    if(line.charAt(10) === '') return;
    
    result.registeredTime.addMinutes(15);

    if(line.charAt(10) === '@')
      result.partialTime.addMinutes(15);
  }
}

class Time {
  #minutes: number = 0;

  constructor(initialMinutes = 0){
    this.#minutes = initialMinutes;
  }

  addMinutes(minutes: number){
    this.#minutes += minutes;
  }

  get minutes(){
    return this.#minutes % 60;
  }

  get hours(){
    return Math.floor(this.#minutes / 60);
  }

  toString(){
    return String(this.hours).padStart(2, '0') + 'h' + String(this.minutes).padStart(2, '0');
  }
}
