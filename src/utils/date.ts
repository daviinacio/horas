import { config } from "../config.js";

export function format(date: Date, format?: string){
  return (format || config.get('dateformat'))
    .replace('yyyy', String(date.getFullYear()))
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('dd', String(date.getDate()).padStart(2, '0'));
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
  return !Number.isNaN(date);
}
