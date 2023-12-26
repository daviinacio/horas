import * as utils from '../utils/index.js';
import * as timesheet from '../lib/timesheet/index.js';

export function today(search?: string){
  const today = new Date();
  const result = timesheet.dayCalc(today);
  timesheet.printDayCalcResult(today, result);
}

export function yesterday(search?: string){
  const yesterday = utils.date.addDays(new Date(), -1);
  const result = timesheet.dayCalc(yesterday);
  timesheet.printDayCalcResult(yesterday, result);
}

export function day(dateText: string, search?: string){
  const day = utils.date.parse(dateText);

  if(!utils.date.validate(day)){
    throw new Error('Data informada é inválida.');
  }

  const result = timesheet.dayCalc(day);
  timesheet.printDayCalcResult(day, result);
}

export function month(search?: string, monthShift = 0){
  const days = utils.date.daysFromMonth(new Date());

  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + (monthShift));

  console.log('calculate month', monthShift, {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  }, search);
}
