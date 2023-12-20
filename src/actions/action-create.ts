import { utils } from "../utils.js";
import { createTimesheetByDate } from "../lib/timesheet.js";

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
  const day = utils.format.dateTimezone(
    new Date(`${dateText}`)
  );

  if(Number.isNaN(day.getTime())){
    throw new Error('Data informada é inválida.');
  }

  createTimesheetByDate(day);
}

function createByDate(date: Date){

}
