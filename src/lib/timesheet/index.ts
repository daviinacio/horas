import * as common from './common.js';
import * as utils from '../../utils/index.js';
import Time from '../Time.js';

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

type ListCalcResult = {
  itemsFound: number
  registered: Time
  required: Time
  // isRegistered: boolean
  // isDayOff: boolean
  // partialTime: Time
  // registeredTime: Time
  // tasks: Task[]
  // props: string[]
}

export function listCalc(dateList: Array<Date>, search?: string): ListCalcResult {
  const result: ListCalcResult = {
    itemsFound: 0,
    registered: new Time(),
    required: new Time(0, false, '')
  }
  

  for(let date of dateList) {
    try {
      const dayCalcResult = dayCalc(date, search);

      if(!dayCalcResult.isDayOff)
        result.required.addHours(8);

      if(dayCalcResult.isRegistered)
        result.registered.addTime(dayCalcResult.registeredTime);
      else
        result.registered.addTime(dayCalcResult.partialTime);
    
      printDayCalcResult(date, dayCalcResult);
      result.itemsFound++;
    }
    catch(err) {}
  }

  return result;
}

export function printWeekCalcResult(dateList: Array<Date>, result: ListCalcResult){
  const balance = result.required.subtract(result.registered);

  console.log(
    `Total de horas registradas na semana ${
      utils.date.format(dateList[0], 'dd/MM')
    } - ${
      utils.date.format(dateList[dateList.length -1], 'dd/MM')
    }: ` +
    `${result.registered} / ${result.required} (${balance})` 
  );
}

export function printMonthResult(month: Date, result: ListCalcResult){
  const balance = result.required.subtract(result.registered);

  console.log(
    `Total de horas registradas no mês ${utils.date.format(month, 'MMMM/yyyy')}: ` +
    `${result.registered} / ${result.required} (${balance})` 
  );
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

export function dayCalc(date: Date, search?: string): DayCalcResult {
  const timesheet_path = common.getTimesheetFilePathByDate(date);

  if(!utils.io.exists(timesheet_path)){
    throw new Error('Não existe controle de horas para esse dia');
  }

  const result: DayCalcResult = {
    isRegistered: false,
    isDayOff: false,
    partialTime: new Time(0, false, ''),
    registeredTime: new Time(0),
    tasks: [],
    props: []
  };

  const timesheetContent = utils.io.readFile(timesheet_path);

  for(let line of timesheetContent.split('\n')){
    lineCalc(line, result, search);
  }

  result.isRegistered = registeredMark.split(',')
    .some(mark => result.props.some(prop => prop.includes(mark)));

  result.isDayOff = dayOffMarks.split(',')
    .some(mark => result.props.some(prop => prop.includes(mark)));

  return result;
}

export function printDayCalcResult(date: Date, result: DayCalcResult){
  console.log(
    `Total de horas do dia ${utils.date.format(date)}: ` +
    `${result.registeredTime} ` +
    `[${result.tasks.filter(t => t.checked).length}/${result.tasks.length}] ` +
    ((result.props.length > 0) ? ('- ' + result.props.join(' - ')) : '') +
    (!result.isRegistered && !result.partialTime.isEmpty() ? `[@${result.partialTime}]` : '')
  )
}

export function printSearchResult(result: Time){
  if(result.isEmpty())
    throw new Error('Nenhum registro encontrado durante a busca');

  console.log(`Total de hora acumulada na busca: ${result}`)
}

function lineCalc(line: string, result: DayCalcResult, search?: string): void {
  // Sanitize line
  line = line.replaceAll('\r', '');

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

  // Search
  if(search && line.indexOf(search) === -1) return;

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
