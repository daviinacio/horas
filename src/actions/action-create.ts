import { createTimesheetByDate } from "../lib/timesheet.js";
import * as utils from '../utils/index.js';

export function today(){
  const today = new Date();
  createTimesheetByDate(today);
}

export function tomorrow(){
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  createTimesheetByDate(tomorrow);
}

export function monday(){
  const today = new Date();
  const nextMonday = new Date(
    today.setDate(
      today.getDate() + ((7 - today.getDay() + 1) % 7 || 7),
    ),
  )
  createTimesheetByDate(nextMonday);
}

export function day(dateText: string){
  const day = utils.date.parse(dateText);

  if(!utils.date.validate(day)){
    throw new Error('Data informada é inválida.');
  }

  createTimesheetByDate(day);
}

export function week(){
  const includeWeekend = false;

  const today = new Date();
  const week = [];
  
  // Set starting at Sunday
  today.setDate((today.getDate() - today.getDay() + (includeWeekend ? 0 : 1)));

  for (var i = 0; i < (includeWeekend ? 7 : 5); i++) {
    week.push(new Date(today)); 
    today.setDate(today.getDate() +1);
  }

  const results = week.map((day) => {
    try {
      createTimesheetByDate(day);
      return true
    }
    catch(err) {
      return false;
    }
  });

  if(!results.some(v => v))
    throw new Error('Controle de horas já criado para essa semana');
}

function createByDate(date: Date){

}
