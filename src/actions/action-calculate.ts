import * as utils from '../utils/index.js';
import * as timesheet from '../lib/timesheet/index.js';
import Time from '../lib/Time.js';

export function today(search?: string){
  const today = new Date();
  const result = timesheet.dayCalc(today, search);

  if(search) {
    timesheet.printSearchResult(result.registeredTime);
  }
  else {
    timesheet.printDayCalcResult(today, result);
  }
}

export function yesterday(search?: string){
  const yesterday = utils.date.addDays(new Date(), -1);
  const result = timesheet.dayCalc(yesterday, search);
  
  if(search) {
    timesheet.printSearchResult(result.registeredTime);
  }
  else {
    timesheet.printDayCalcResult(yesterday, result);
  }
}

export function day(dateText: string, search?: string){
  const day = utils.date.parse(dateText);

  if(!utils.date.validate(day)){
    throw new Error('Data informada é inválida.');
  }

  const result = timesheet.dayCalc(day, search);
  
  if(search) {
    timesheet.printSearchResult(result.registeredTime);
  }
  else {
    timesheet.printDayCalcResult(day, result);
  }
}

export function week(search?: string, weekShift = 0){
  const week = utils.date.daysFromWeek(
    utils.date.addDays(new Date(), weekShift * 7)
  );

  console.log(`Semana: ${
    utils.date.format(week[0], 'dd/MM/yyyy')
  } - ${
    utils.date.format(week[week.length -1], 'dd/MM/yyyy')
  }`);

  const result = timesheet.listCalc(week, search);

  if(result.registered.equals(new Time()))
    throw new Error('As horas dessa semana ainda não foram lançadas no DevOps');

  if(result.itemsFound === 0)
    throw new Error('Não existe controle de horas para essa semana');
  
  if(search) {
    timesheet.printSearchResult(result.registered);
  }
  else {
    timesheet.printWeekCalcResult(week, result);
  }
}

export function month(search?: string, monthShift = 0){
  const month = utils.date.addMonth(new Date(), monthShift);
  const monthDays = utils.date.daysFromMonth(month);

  console.log(`Mês: ${utils.date.format(month, 'MMMM/yyyy')}`);

  const result = timesheet.listCalc(monthDays, search);

  if(result.registered.isEmpty())
    throw new Error('As horas desse mês ainda não foram lançadas no DevOps');

  if(result.itemsFound === 0)
    throw new Error('Não existe controle de horas para esse mês');
  
  if(search) {
    timesheet.printSearchResult(result.registered);
  }
  else {
    timesheet.printMonthResult(month, result);
  }

  // const date = new Date();
  // date.setDate(1);
  // date.setMonth(date.getMonth() + (monthShift));

  // console.log('calculate month', monthShift, {
  //   month: date.getMonth() + 1,
  //   year: date.getFullYear()
  // }, search);
}
