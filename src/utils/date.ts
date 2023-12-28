import { config } from "../config.js";
import { getMonthName } from "../constants.js";
import { MonthNumber } from "../types.js";

function convert_24h_12h(hours: number): Number {
  return hours == 0 ? 12 : ((hours -1) % 12) + 1;
}

export function format(date: Date, format?: string){
  return (format || config.get('dateformat'))
    .replace('yyyy', String(date.getFullYear()))
    .replace('MMMM', getMonthName(date.getMonth() + 1 as MonthNumber))
    .replace('MMM', getMonthName(date.getMonth() + 1 as MonthNumber).substring(0, 3))
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('dd', String(date.getDate()).padStart(2, '0'))
    .replace('HH', String(date.getHours()).padStart(2, '0'))
    .replace('hh', String(convert_24h_12h(date.getHours())).padStart(2, '0'))
    .replace('mm', String(date.getMinutes()).padStart(2, '0'))
    .replace('ss', String(date.getSeconds()).padStart(2, '0'));
}

export function injectTimezone(dateUTC: Date): Date{
  return new Date(
    dateUTC.getUTCFullYear(),
    dateUTC.getUTCMonth(),
    dateUTC.getUTCDate()
  );
}

export function parse(dateText: string, timezone = true): Date{
  const date = new Date(dateText);
  return timezone ? injectTimezone(date) : date;
}

export function validate(date: Date): Boolean {
  return !Number.isNaN(date.getDate());
}


export function addDays(date: Date, shift: number): Date {
  date.setDate(date.getDate() + shift);
  return date;
}

export function addMonth(date: Date, shift: number): Date {
  date.setMonth(date.getMonth() + shift);
  return date;
}

export function nextWeekday(date: Date, day: number): Date {
  const nextMonday = new Date(
    date.setDate(
      date.getDate() + ((7 - date.getDay() + day) % 7 || 7),
    ),
  );

  return date;
}

export function daysFromWeek(date: Date, includeWeekend = false): Array<Date> {
  const week = new Array<Date>;

  date.setDate((date.getDate() - date.getDay()));

  for (var i = 0; i < 7; i++) {
    if(includeWeekend || (![0, 6].includes(date.getDay())))
      week.push(new Date(date)); 
    date.setDate(date.getDate() +1);
  }

  return week;
}

export function daysFromMonth(inDate: Date, includeWeekend = false): Array<Date> {
  const days = new Array<Date>();
  const date = new Date(inDate);

  const startingMonth = date.getMonth();
  date.setDate(1);

  while(date.getMonth() === startingMonth){
    if(includeWeekend || (![0, 6].includes(date.getDay())))
      days.push(new Date(date));
    date.setDate(date.getDate() +1);
  }

  return days;
}
