import * as utils from '../utils/index.js';
import * as timesheet from '../lib/timesheet/index.js';

export function today(){
  const today = new Date();
  timesheet.create(today);
}

export function tomorrow(){
  const tomorrow = utils.date.addDays(new Date(), 1);
  timesheet.create(tomorrow);
}

export function monday(){
  const nextMonday = utils.date.nextWeekday(new Date(), 1);
  timesheet.create(nextMonday);
}

export function day(dateText: string){
  const day = utils.date.parse(dateText);

  if(!utils.date.validate(day)){
    throw new Error('Data informada é inválida.');
  }

  timesheet.create(day);
}

export function week(weekShift = 0){
  const week = utils.date.daysFromWeek(
    utils.date.addDays(new Date(), weekShift * 7)
  );

  const results = week.map((day) => {
    try {
      timesheet.create(day);
      return true
    }
    catch(err) {
      return false;
    }
  });

  if(!results.some(v => v))
    throw new Error('Controle de horas já criado para essa semana');
}

export function month(monthShift = 0){
  const month = utils.date.addMonth(new Date(), monthShift);
  const monthDays = utils.date.daysFromMonth(month);

  const results = monthDays.map((day) => {
    try {
      timesheet.create(day);
      return true
    }
    catch(err) {
      return false;
    }
  });

  if(!results.some(v => v))
    throw new Error('Controle de horas já criado para esse mês');
}
