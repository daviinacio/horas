import { config } from "../config.js";

function convert_24h_12h(hours: number): Number {
  return hours == 0 ? 12 : ((hours -1) % 12) + 1;
}

export function format(date: Date, format?: string){
  return (format || config.get('dateformat'))
    .replace('yyyy', String(date.getFullYear()))
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

  date.setDate((date.getDate() - date.getDay() + (includeWeekend ? 0 : 1)));

  for (var i = 0; i < (includeWeekend ? 7 : 5); i++) {
    week.push(new Date(date)); 
    date.setDate(date.getDate() +1);
  }

  return week;
}
