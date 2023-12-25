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

export function week(){
  const week = utils.date.daysFromWeek(new Date());

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
